import type { Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { HomeBannerService } from "./homeBanner.service";


const homeBannerCreate = catchAsync(async (req: Request, res: Response) => {
	if (!req.file) {
		throw new AppError(httpStatus.BAD_REQUEST, "No File Provided.");
	}

	// const payload = JSON.parse(req.body.data);
	const payload = req.body.data;
	const userId = req.user?.userId;
	const result = await HomeBannerService.homeBannerCreate(
		payload,
		req.file?.buffer,
		userId as string,
	);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Home Banner Create successfully!",
		data: result,
	});
});
const getAllOwnHomeBanner = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user?.userId;

	const result = await HomeBannerService.getAllOwnHomeBanner(userId as string);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Home Banner Retrieved Successfully",
		data: result,
	});
});
const getSingleHomeBanner = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	const result = await HomeBannerService.getSingleHomeBanner(id as string);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Home Banner Retrieved Successfully",
		data: result,
	});
});
const homeBannerUpdated = catchAsync(async (req: Request, res: Response) => {
	if (!req.file) {
		throw new AppError(httpStatus.BAD_REQUEST, "No File Provided.");
	}

	// const payload = JSON.parse(req.body.data);
	const { id: propertyId } = req.params;
	const payload = req.body.data;
	const userId = req.user?.userId;
	const result = await HomeBannerService.homeBannerUpdated(
		payload,
		req.file?.buffer,
		userId as string,
		propertyId as string,
	);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Home Banner updated successfully!",
		data: result,
	});
});
const deletedHomeBanner = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const userId = req.user?.userId;

	const result = await HomeBannerService.deletedHomeBanner(
		id as string,
		userId as string,
	);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Home Banner deleted s Successfully",
		data: result,
	});
});
export const HomeBannerController = {
homeBannerCreate,
homeBannerUpdated,
getAllOwnHomeBanner,
getSingleHomeBanner,
deletedHomeBanner
};
