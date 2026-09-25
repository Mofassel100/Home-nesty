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


const propertyCreate = async (payload:IProperty,buffer: Buffer,userId:string) => {
	

	// const currentUser = await prisma.property.findUnique({
	// 		where: {
	// 			id: userId,
	// 		},
	// 		select: {
	// 			imagePublicId: true,
	// 			imageUrl: true,
	// 		},
	// 	});
	
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
    ownerId: userId,

    title: payload.title,
    description: payload.description,

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



const getAllOwnProperty = async (userId: string) => {

	const result = await prisma.property.findMany({
		where:{ownerId:userId}
	})
	return result
}







export const PropertyService = {
propertyCreate,
getAllOwnProperty
};