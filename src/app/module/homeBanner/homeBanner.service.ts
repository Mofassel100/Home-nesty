/** biome-ignore-all lint/style/useConst: <explanation> */

import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../../lib/cloudinary";
import { IHomeBanner } from "./homeBanner.interface";
import { tr } from "zod/v4/locales";

const homeBannerCreate = async (
    payload: IHomeBanner,
    buffer: Buffer,
    userId: string,
) => {
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
    const createHomeBanner = await prisma.homeBanner.create({
        data: {
            userId: userId,
            title: payload.title,
            description: payload.description,
            sortOrder:payload?.sortOrder,
            image:cloudinaryResult.secure_url,
            imagePublicId: cloudinaryResult.public_id,
        },
    });

    return createHomeBanner;
};

const getAllOwnHomeBanner = async (userId: string) => {
    const result = await prisma.homeBanner.findMany();
    return result;
};
const getSingleHomeBanner= async (userId: string) => {
    const result = await prisma.homeBanner.findMany({
        where: { id: userId },
    });
    return result;
};

// property update from db
const homeBannerUpdated = async (
    payload: IHomeBanner,
    buffer: Buffer,
    userId: string,
    homeBannerID: string,
) => {
    const currentHomeBanner = await prisma.homeBanner.findUnique({
        where: {
            id: homeBannerID,
        },
        select: {
            imagePublicId: true,
            imageUrl: true,
        },
    });

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
    const findUser = await prisma.homeBanner.findUnique({
        where: { id: homeBannerID },
    });
    if (!findUser) {
        throw new Error("Home Banner not found");
    }

    const updatedHomeBanner = await prisma.homeBanner.update({
        where: {
            id: findUser.id,
        },
        data: {
            title: payload.title,
            description: payload.description,
            imageUrl: cloudinaryResult.secure_url,
            imagePublicId: cloudinaryResult.public_id,

        },
    });
    if (currentHomeBanner?.imagePublicId && currentHomeBanner.imageUrl) {
        await cloudinary.uploader.destroy(currentHomeBanner.imagePublicId);
    }

    return updatedHomeBanner;
};

const deletedHomeBanner = async (homeBannerId: string, userId: string) => {
    const user = await prisma.homeBanner.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "Home Banner  Not Found");
    }

    const getHomeBanner = await prisma.homeBanner.findUnique({
        where: { id: homeBannerId },
    });

    if (!getHomeBanner) {
        throw new AppError(httpStatus.NOT_FOUND, "Home banner Not Found");
    }
    const deletedHomeBanner = await prisma.homeBanner.delete({
        where: { id: getHomeBanner.id },
        include:{
            user:true
        }
    });

    return deletedHomeBanner;
};

export const HomeBannerService = {
homeBannerCreate,
getAllOwnHomeBanner,
getSingleHomeBanner,
homeBannerUpdated,
deletedHomeBanner
};
