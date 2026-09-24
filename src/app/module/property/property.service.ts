/** biome-ignore-all lint/style/useConst: <explanation> */
import bcrypt from "bcryptjs";
import crypto from "crypto";
import ejs from "ejs";
import type { TokenPayload } from "google-auth-library";
import httpStatus from "http-status";
import type { JwtPayload, SignOptions } from "jsonwebtoken";
import path from "path";
import {
	AuthProvider,
	Role,
	UserStatus,
} from "../../../generated/prisma/enums";
import config from "../../config";
// import { googleClient } from "../../lib/googleAuth";
import { transporter } from "../../lib/nodemailer";
import { prisma } from "../../lib/prisma";
import { redisClient } from "../../lib/redis";
import { AppError } from "../../utils/AppError";
import { jwtUtils } from "../../utils/jwt";


const propertyCreate = async (payload:{}) => {
	// const { name, password, customer: userData } = payload;

	// const email = payload.email.trim().toLowerCase();

	// const isUserExists = await prisma.user.findUnique({
	// 	where: { email },
	// });

	// if (isUserExists) {
	// 	throw new AppError(httpStatus.CONFLICT, "User with this email already exists");
	// }

	// const hashedPassword = await bcrypt.hash(password, 8);

	// const expirationSeconds = 5 * 60;

	// const otpKey = `customer-registration-otp:${email}`;
	// const otpValue = crypto.randomInt(100000, 1000000).toString();

	// await redisClient.set(otpKey, otpValue, {
	// 	expiration: {
	// 		type: "EX",
	// 		value: expirationSeconds,
	// 	},
	// });

	// const userRegistrationKey = `user-registration-data:${email}`;
	// const redisUserDataPayload = {
	// 	name,
	// 	email,
	// 	password: hashedPassword,
	// 	patient: userData,
	// };

	// await redisClient.set(
	// 	userRegistrationKey,
	// 	JSON.stringify(redisUserDataPayload),
	// 	{
	// 		expiration: {
	// 			type: "EX",
	// 			value: expirationSeconds,
	// 		},
	// 	},
	// );

	// const tempatePath = path.join(
	// 	process.cwd(),
	// 	"src/app/templates/registration-user-otp.ejs",
	// );

	// const templateData = {
	// 	name,
	// 	email,
	// 	otp: otpValue,
	// 	expirationMinutes: expirationSeconds / 60,
	// };

	// const html = await ejs.renderFile(tempatePath, templateData);

	// await transporter.sendMail({
	// 	from: config.email_sender,
	// 	to: email,
	// 	subject: "Email Verification",
	// 	// text : `Your OTP is ${otp}`
	// 	// html: `<h1>Your OTP is ${otp}</h1>`
	// 	html,
	// });
};

// const verifyUserEmail = async (payload: IVerifyEmailPayload) => {
// 	const otp = payload.otp;
// 	const email = payload.email.trim().toLowerCase();

// 	const isUserExist = await prisma.user.findUnique({
// 		where: { email },
// 	});

// 	if (isUserExist?.status === "BLOCKED") {
// 		throw new AppError(httpStatus.FORBIDDEN, "User is Blocked");
// 	}

// 	if (isUserExist?.emailVerified) {
// 		throw new AppError(httpStatus.CONFLICT, "Email ALready Verified");
// 	}

// 	if (isUserExist?.isDeleted || isUserExist?.status === "DELETED") {
// 		throw new AppError(httpStatus.FORBIDDEN, "User is Deleted");
// 	}

// 	const otpKey = `customer-registration-otp:${email}`;

// 	const redisOtp = await redisClient.get(otpKey);
// 	console.log(redisOtp)

// 	if (!redisOtp) {
// 		throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
// 	}

// 	if (redisOtp !== otp) {
// 		throw new AppError(httpStatus.BAD_REQUEST, "OTP Does Not Match");
// 	}

// 	await redisClient.del(otpKey);

// 	const UserRegistrationKey = `user-registration-data:${email}`;

// 	const redisUserData = await redisClient.get(UserRegistrationKey);
// 	console.log(redisUserData)
	

// 	if (!redisUserData) {
// 		throw new AppError(httpStatus.NOT_FOUND, "User Doesnt Exist");
// 	}

// 	const userPayload: IRegisterUserPayload = JSON.parse(redisUserData);

// 	const createdUser = await prisma.user.create({
// 		data: {
// 			name: userPayload.name,
// 			email: userPayload.email,
// 			password: userPayload.password,
// 			role: Role.CUSTOMER,
// 			status: UserStatus.ACTIVE,
// 			emailVerified: true,
			
// 		},
// 		omit: { password: true },
// 	});

// 	await redisClient.del(UserRegistrationKey);

// 	const tempatePath = path.join(
// 		process.cwd(),
// 		"src/app/templates/customer-welcome-email.ejs",
// 	);

// 	const templateData = {
// 		name: createdUser.name,
// 	};

// 	const html = await ejs.renderFile(tempatePath, templateData);

// 	await transporter.sendMail({
// 		from: config.email_sender,
// 		to: email,
// 		subject: "Welcome To PH Home nesty",
// 		// text : `Your OTP is ${otp}`
// 		// html: `<h1>Your OTP is ${otp}</h1>`
// 		html,
// 	});

// 	const {...user } = createdUser;
// 	const jwtPayload = {
// 		userId: user.id,
// 		name: user.name,
// 		email: user.email,
// 		role: user.role,
// 	};

// 	const accessToken = jwtUtils.createToken(
// 		jwtPayload,
// 		config.jwt_access_secret,
// 		config.jwt_access_expires_in as SignOptions,
// 	);

// 	const refreshToken = jwtUtils.createToken(
// 		jwtPayload,
// 		config.jwt_refresh_secret,
// 		config.jwt_refresh_expires_in as SignOptions,
// 	);

// 	return {
// 		user,
// 		accessToken,
// 		refreshToken,
// 	};
// };










export const PropertyService = {
propertyCreate
};