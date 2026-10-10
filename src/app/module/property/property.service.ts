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
import { IProperty } from "./property.interface";
import { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../../lib/cloudinary";
import { de } from "zod/v4/locales";
import { title } from "process";

const propertyCreate = async (
	payload: IProperty,
	buffer: Buffer,
	userId: string,
) => {
	
	  // 1. Validate the user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  include:{
	provider:true,
	
  },
	
  });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User not found. Please log in again.",
    );
  }
	const cloudinaryResult = await new Promise<UploadApiResponse>(
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
							return reject(new Error("No result returned from Cloudinary"));
						}

						resolve(result);
					},
				)
				.end(buffer);
		},
	);
	const createProperty = await prisma.property.create({
		data: {
            providerId:user?.provider?.id as string,
			title: payload.title,
			description: payload.description,
            category: payload.category,
			propertyType: payload.propertyType,

			address: payload.address,
			city: payload.city,
			area: payload.area ?? null,

			rent: payload.rent,
			securityDeposit: payload.securityDeposit ?? null,

			bedrooms: payload.bedrooms,
			bathrooms: payload.bathrooms,
			availableRooms: payload.availableRooms,

			furnished: payload.furnished,

			imageUrl: cloudinaryResult.secure_url,
			imagePublicId: cloudinaryResult.public_id,

			contactName: payload.contactName ?? null,
			contactPhone: payload.contactPhone ?? null,
			contactEmail: payload.contactEmail ?? null,

			status: payload.status,
		},
	});

	return createProperty;
};

const getAllOwnProperty = async () => {
	const result = await prisma.property.findMany();
	return result;
};
const getSingleOwnProperty = async (propertyId: string) => {
	const result = await prisma.property.findMany({
		where: { id: propertyId },
	});
	return result;
};

// property update from db
const propertyUpdated = async (
	payload: IProperty,
	buffer: Buffer |null | undefined,
	userId: string,
	propertyID: string,
) => {
	const currentProperty = await prisma.property.findUnique({
		where: {
			id: propertyID,
		},
		select: {
			imagePublicId: true,
			imageUrl: true,
		},
	});
if (!currentProperty) { throw new Error("Property not found"); }
let imageUrl = currentProperty.imageUrl;
let imagePublicId = currentProperty.imagePublicId;
   if (buffer && buffer.length > 0) { 
	const cloudinaryResult = await new Promise<UploadApiResponse>( (resolve, reject) => 
    { const uploadStream = cloudinary.uploader.upload_stream( { resource_type: "image", folder: "property", }, (error, result) => 
        { if (error) { return reject(error); } 
   if (!result)
 { return reject( new Error("No result returned from Cloudinary"), ); }
   
   resolve(result); }, ); uploadStream.end(buffer); }, ); 
   imageUrl = cloudinaryResult.secure_url;
  imagePublicId = cloudinaryResult.public_id
}
	// 


	if (currentProperty?.imagePublicId && currentProperty.imageUrl) {
		await cloudinary.uploader.destroy(currentProperty.imagePublicId);
	}

	
	

	const updatedProperty = await prisma.property.update({
		where: {
			id: propertyID,
		},
		data: {
			title: payload.title,
			description: payload.description,
			propertyType: payload.propertyType,
			address: payload.address,
			city: payload.city,
			area: payload.area ?? null,
			rent: payload.rent,
			securityDeposit: payload.securityDeposit ?? null,
            category:payload.category,
			bedrooms: payload.bedrooms,
			bathrooms: payload.bathrooms,
			availableRooms: payload.availableRooms,
			furnished: payload.furnished,
			imageUrl: imageUrl,
			imagePublicId: imagePublicId,
			contactName: payload.contactName ?? null,
			contactPhone: payload.contactPhone ?? null,
			contactEmail: payload.contactEmail ?? null,
			status: payload.status,
		},
	});
	if (currentProperty?.imagePublicId && currentProperty.imageUrl) {
		await cloudinary.uploader.destroy(currentProperty.imagePublicId);
	}

	return updatedProperty;
};

const deleteProperty = async (propertyId: string, userId: string) => {
	const user = await prisma.user.findUnique({
		where: { id: userId },
	});

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User Profile Not Found");
	}

	const getProperty = await prisma.property.findUnique({
		where: { id: propertyId },
	});

	if (!getProperty || getProperty.isDeleted) {
		throw new AppError(httpStatus.NOT_FOUND, "Property Not Found");
	}
	const deletedSchedule = await prisma.property.update({
		where: { id: getProperty.id },
		data: { isDeleted: true, deletedAt: new Date() },
	});

	return deletedSchedule;
};

export const PropertyService = {
	propertyCreate,
	getAllOwnProperty,
	getSingleOwnProperty,
	deleteProperty,
	propertyUpdated,
};
