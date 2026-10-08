import bcrypt from "bcryptjs";
import type { UploadApiResponse } from "cloudinary";
import crypto from "crypto";
import ejs, { renderFile } from "ejs";
import httpStatus from "http-status";
import path from "path";

import config from "../../config";
import { IQuery } from "../../interfaces";
import { cloudinary } from "../../lib/cloudinary";
import { transporter } from "../../lib/nodemailer";
import { prisma } from "../../lib/prisma";
import { redisClient } from "../../lib/redis";
import { RequestUser } from "../../middleware/checkAuth";
import { AppError } from "../../utils/AppError";
import {  IApproveProviderPayload, ICreateProvider, IUpdateProviderProfilePayload, IVerifyProviderEmailPayload } from "./provider.interface";
import { ProviderStatus, Role } from "../../../generated/prisma/enums";
import { ProviderWhereInput } from "../../../generated/prisma/models";

const applyAsProvider = async (
	payload: ICreateProvider,
	resume: Buffer,
) => {
    const isUserExists = await prisma.user.findUnique({
        where: {
            email: payload.user.email,
		},
	});
    
    const email = payload.user.email.trim().toLowerCase();
	if (isUserExists) {
		throw new AppError(httpStatus.CONFLICT, "User Already Exists With This Email");
	}

	const resumeUploadResult = await new Promise<UploadApiResponse>(
		(resolve, reject) => {
			cloudinary.uploader
				.upload_stream(
					{
						resource_type: "auto",
					},

					async (error, result) => {
						if (error) {
							return reject(error);
						}

						if (!result) {
							return reject(
								new AppError(
									httpStatus.INTERNAL_SERVER_ERROR,
									"No result returned from Cloudinary",
								),
							);
						}

						resolve(result);
					},
				)
				.end(resume);
		},
	);



	const hashedPassword = await bcrypt.hash(
		payload.user.password,
		Number(config.bcrypt_salt_rounds),
	);

const providerRegistration = await prisma.user.create({
  data: {
    ...payload.user,
    password: hashedPassword,
    role: Role.PROVIDER,
    needPasswordChange: true,
    provider: {
      create: {
        fullName: payload.user.name,
        email: payload.user.email,
        businessName: payload.provider.businessName,
        phone: payload.provider.phone || "",
        address: payload.provider.address ||"",
        city: payload.provider.city || "",
        nidNumber: payload.provider.nidNumber,
        tradeLicense: payload.provider.tradeLicense,
        experience: payload.provider.experience,
        description: payload.provider.description,
        // Uploaded NID document
        nidDocument: resumeUploadResult.secure_url,
        nidPublicId: resumeUploadResult.public_id,

        profileImage: payload.provider.profileImage,

      },
    },
  },

  include: {
    provider: true,
  },
});

	const expirationSeconds = 60 * 60 

	const otpKey = `provider-registration-otp:${email}`
	const otpValue = crypto.randomInt(100000, 1000000).toString();

	await redisClient.set(otpKey, otpValue, {
		expiration: {
			type: "EX",
			value: expirationSeconds,
		},
	});
    

    const tempatePath = path.join(
        process.cwd(),
        "src/app/templates/registration-user-otp.ejs",
    );

	const templateData = {	
        name: payload.user.name,
		email : email,
		otp: otpValue,
		expirationMinutes: expirationSeconds / 60,
	};
	const html = await ejs.renderFile(tempatePath, templateData);
    console.log(html)
	await transporter.sendMail({
		from: config.email_sender,
		to: email,
		subject: "Provider Application - Email Verification",
		html,
	});
    
	return 
};

const verifyProviderEmail = async (payload : IVerifyProviderEmailPayload) => {
	const otp = payload.otp;
	const email = payload.email.trim().toLowerCase();

	const existingUser = await prisma.user.findUnique({
		where: { email, role: Role.PROVIDER },
	});

	if (!existingUser) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Provider registration Not Found. Please Apply Again.",
		);
	}

	if (existingUser.emailVerified) {
		throw new AppError(httpStatus.CONFLICT, "Email Already Verified");
	}

	const otpKey = `provider-registration-otp:${email}`;

	const redisOtp = await redisClient.get(otpKey);

	if (!redisOtp) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"OTP Expired. Your Application Window Has Closed, Please Apply Again.",
		);
	}

	if (redisOtp !== otp) {
		throw new AppError(httpStatus.BAD_REQUEST, "OTP Does Not Match");
	}

	await redisClient.del(otpKey);

	const verifiedUser = await prisma.user.update({
		where: { id: existingUser.id },
		data: { emailVerified: true },
		omit: { password: true },
		include: { provider: true },
	});

	return verifiedUser

}

const approveProvider = async (payload : IApproveProviderPayload, reviewer : RequestUser) => {
	const { ProviderId, verificationStatus, rejectionReason } = payload;

	const existingProvider = await prisma.provider.findUnique({
		where: { id: ProviderId },
		include: { user: true },
	});

	if (!existingProvider) {
		throw new AppError(httpStatus.NOT_FOUND, "provider Application Not Found");
	}

	if (existingProvider.isDeleted) {
		throw new AppError(httpStatus.GONE, "Provider Application Has Been Deleted");
	}

	if (!existingProvider.user.emailVerified) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"provider Has Not Verified Their Email Yet. Application Cannot Be Reviewed.",
		);
	}

	if (existingProvider.verificationStatus !== ProviderStatus.PENDING) {
		throw new AppError(
			httpStatus.CONFLICT,
			`Provider Application Has Already Been ${existingProvider.verificationStatus.toLowerCase()}`,
		);
	}

	if (
		verificationStatus === ProviderStatus.REJECTED &&
		!rejectionReason
	) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Rejection Reason Is Required When Rejecting A Provider Application",
		);
	}

const updatedProvider = await prisma.provider.update({
  where: {
    id: ProviderId,
  },

  data: {
     verificationStatus,
    rejectionReason:
      payload.verificationStatus === ProviderStatus.REJECTED
        ? payload.rejectionReason
        : null,

    reviewedById: reviewer.userId,

    approvedAt:
      payload.verificationStatus === ProviderStatus.APPROVED
        ? new Date()
        : null,

    rejectedAt:
      payload.verificationStatus === ProviderStatus.REJECTED
        ? new Date()
        : null,
  },
});

	const isApproved = verificationStatus === ProviderStatus.APPROVED;

	const tempatePath = path.join(
		process.cwd(),
		`src/app/templates/${isApproved
			? "provider-application-approved.ejs"
			: "provider-application-rejected.ejs"
		}`,
	);

	const templateData = {
		name: updatedProvider.fullName,
		reason: updatedProvider.rejectionReason,
	};


	const html = await ejs.renderFile(tempatePath, templateData);

	await transporter.sendMail({
		from: config.email_sender,
		to: updatedProvider.email,
		subject: isApproved
			? "Your Provider Application Has Been Approved"
			: "Your Provider Application Has Been Rejected",
		html,
	});

	return updatedProvider



}

const getAllProviders = async (query: IQuery) => {

	const limit = query.limit ? Number(query.limit) : 10;
	const page = query.page ? Number(query.page) : 1;
	const skip = (page - 1) * limit;
	const sortBy = query.sortBy ? query.sortBy : "createdAt";
	const sortOrder = query.sortOrder ? query.sortOrder : "desc"

	const andConditions: ProviderWhereInput[] = []

	//Searching
	if (query.searchTerm) {
		andConditions.push({
			OR: [
				{ fullName: { contains: query.searchTerm, mode: "insensitive" } },
				{ email: { contains: query.searchTerm, mode: "insensitive" } },
				{
					businessName: {
						contains: query.searchTerm,
						mode: "insensitive",
					},
				},
				{
					nidNumber: {
						contains: query.searchTerm,
						mode: "insensitive",
					},
				},
			],
		});
	}

	//filtering
	if (query.businessName) {
		andConditions.push({
			businessName: { equals: query.businessName, mode: "insensitive" },
		});
	}

	if (query.email) {
		andConditions.push({
			email: { contains: query.email, mode: "insensitive" },
		});
	}

	if (query.nidNumber) {
		andConditions.push({
			nidNumber: { equals: query.nidNumber, mode: "insensitive" },
		});
	}

	if (query.verificationStatus) {
		andConditions.push({
			verificationStatus: query.verificationStatus as ProviderStatus,
		});
	}

	andConditions.push({ isDeleted: false });

	const allProviders = await prisma.provider.findMany({
		where : {
			AND : andConditions.length > 0 ? andConditions : undefined
		},

		take: limit,
		skip: skip,


		orderBy: {
			// sortBy : sortOrder
			[sortBy]: sortOrder
		},

		include:{
			user: {
				omit:{
					password: true
				}
			},

		}

	});

	const totalProviderCount = await prisma.provider.count({
		where: {
			AND: andConditions
		}
	})

	return {
		data: allProviders,
		meta: {
			page: page,
			limit: limit,
			total: totalProviderCount,
			totalPages: Math.ceil(totalProviderCount / limit)
		}
	}
}

const updateProviderProfile = async (payload : IUpdateProviderProfilePayload,user : RequestUser) => {
	const existingProvider = await prisma.provider.findUnique({
		where: { userId: user.userId },
	});

	if (!existingProvider) {
		throw new AppError(httpStatus.NOT_FOUND, "Provider Profile Not Found");
	}
console.log(existingProvider)
	const updatedProvider = await prisma.provider.update({
		where: { id: existingProvider.id },
		data:payload,
	});

	return updatedProvider;

}

// Fields safe to expose on the public (unauthenticated) Provider-discovery endpoints.
// Deliberately excludes resume/additionalFiles, verification review metadata, and
// anything relation/auth related (user, userId, isDeleted, deletedAt...).


const getAvailableProviderByTodaysSchedule = async (query: IQuery) => {

	// const limit = query.limit ? Number(query.limit) : 10;
	// const page = query.page ? Number(query.page) : 1;
	// const skip = (page - 1) * limit;
	// const sortBy = query.sortBy ? query.sortBy : "createdAt";
	// const sortOrder = query.sortOrder ? query.sortOrder : "desc"

	// const now = new Date();
	// const startOfToday = startOfDay(now);
	// const startOfTomorrow = addDays(startOfToday, 1);

	// // A Provider is "available today" if they have at least one published,
	// // not-yet-started schedule today with open slots left.

	// const andConditions: ProviderWhereInput[] = [
	// 	{ isDeleted: false },
	// 	{ verificationStatus: ProviderVerificationStatus.APPROVED },
	// 	{
	// 		schedules: {
	// 			some: {
	// 				isDeleted: false,
	// 				status: ScheduleStatus.PUBLISHED,
	// 				availableSlots: { gt: 0 },
	// 				startDateTime: {
	// 					gte: startOfToday,
	// 					lt: startOfTomorrow,
	// 					gt: now,
	// 				},
	// 			} } },
	// ];

	// if (query.searchTerm) {
	// 	andConditions.push({
	// 		OR: [
	// 			{ name: { contains: query.searchTerm, mode: "insensitive" } },
	// 			{ specialization: { contains: query.searchTerm, mode: "insensitive" } },
	// 		],
	// 	});
	// }

	// if (query.specialization) {
	// 	andConditions.push({
	// 		specialization: { equals: query.specialization, mode: "insensitive" },
	// 	});
	// }

	// const availableProviders = await prisma.Provider.findMany({
	// 	where: {
	// 		AND: andConditions,
	// 	},

	// 	take: limit,
	// 	skip,

	// 	orderBy: {
	// 		[sortBy]: sortOrder,
	// 	},

	// 	select: {
	// 		id: true,
	// 		name: true,
	// 		specialization: true,
	// 		licenseNumber: true,
	// 		qualifications: true,
	// 		experienceYears: true,
	// 		bio: true,
	// 		consultationFee: true,
	// 		createdAt: true,
	// 		schedules: {
	// 			where: {
	// 				isDeleted: false,
	// 				status: ScheduleStatus.PUBLISHED,
	// 				availableSlots: { gt: 0 },
	// 				startDateTime: {
	// 					gte: startOfToday,
	// 					lt: startOfTomorrow,
	// 					gt: now,
	// 				},
	// 			},
	// 			orderBy: { [sortBy] : sortOrder },
	// 			select: {
	// 				id: true,
	// 				startDateTime: true,
	// 				endDateTime: true,
	// 				availableSlots: true,
	// 				totalSlots: true,
	// 			},
	// 		},
	// 	},
	// });

	// const totalAvailableProviderCount = await prisma.Provider.count({
	// 	where: { AND: andConditions },
	// });

	// return {
	// 	data: availableProviders,
	// 	meta: {
	// 		page,
	// 		limit,
	// 		total: totalAvailableProviderCount,
	// 		totalPages: Math.ceil(totalAvailableProviderCount / limit),
	// 	},
	// };
}

const getAllProvidersListPublic = async (query: IQuery) => {

	// const limit = query.limit ? Number(query.limit) : 10;
	// const page = query.page ? Number(query.page) : 1;
	// const skip = (page - 1) * limit;
	// const sortBy = query.sortBy ? query.sortBy : "createdAt";
	// const sortOrder = query.sortOrder ? query.sortOrder : "desc"

	// const andConditions: ProviderWhereInput[] = [
	// 	{ isDeleted: false },
	// 	{ verificationStatus: ProviderVerificationStatus.APPROVED },
	// ];

	// if (query.searchTerm) {
	// 	andConditions.push({
	// 		OR: [
	// 			{ name: { contains: query.searchTerm, mode: "insensitive" } },
	// 			{ specialization: { contains: query.searchTerm, mode: "insensitive" } },
	// 			{ qualifications: { contains: query.searchTerm, mode: "insensitive" } },
	// 		],
	// 	});
	// }

	// if (query.specialization) {
	// 	andConditions.push({
	// 		specialization: { equals: query.specialization, mode: "insensitive" },
	// 	});
	// }

	// const allProviders = await prisma.Provider.findMany({
	// 	where: {
	// 		AND: andConditions,
	// 	},

	// 	take: limit,
	// 	skip,

	// 	orderBy: {
	// 		[sortBy]: sortOrder,
	// 	},

	// 	select: {
	// 		id: true,
	// 		name: true,
	// 		specialization: true,
	// 		licenseNumber: true,
	// 		qualifications: true,
	// 		experienceYears: true,
	// 		bio: true,
	// 		consultationFee: true,
	// 		createdAt: true,
	// 	},
	// });

	// const totalProviderCount = await prisma.Provider.count({
	// 	where: { AND: andConditions },
	// });

	// return {
	// 	data: allProviders,
	// 	meta: {
	// 		page,
	// 		limit,
	// 		total: totalProviderCount,
	// 		totalPages: Math.ceil(totalProviderCount / limit),
	// 	},
	// };
}

const getSingleProviderPublicProfile = async (ProviderId: string) => {

	// const Provider = await prisma.Provider.findUnique({
	// 	where: {
	// 		id: ProviderId,
	// 		isDeleted: false,
	// 		verificationStatus: ProviderVerificationStatus.APPROVED,
	// 	},
	// 	select: {
	// 		id: true,
	// 		name: true,
	// 		specialization: true,
	// 		licenseNumber: true,
	// 		qualifications: true,
	// 		experienceYears: true,
	// 		bio: true,
	// 		consultationFee: true,
	// 		createdAt: true,
	// 	},
	// });

	// if (!Provider) {
	// 	throw new AppError(httpStatus.NOT_FOUND, "Provider Not Found");
	// }

	// return Provider;
}



export const ProviderServices = {
	applyAsProvider,
	verifyProviderEmail,
	approveProvider,
	getAllProviders,
	updateProviderProfile,
	getAvailableProviderByTodaysSchedule,
	getAllProvidersListPublic,
	getSingleProviderPublicProfile
};