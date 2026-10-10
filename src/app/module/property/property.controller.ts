import type { Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PropertyService } from "./property.service";
import { IProperty } from "./property.interface";

const propertyCreate = catchAsync(async (req: Request, res: Response) => {
	if (!req.file) {
		throw new AppError(httpStatus.BAD_REQUEST, "No File Provided.");
	}

	// const payload = JSON.parse(req.body.data);
	  const payload: IProperty=
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;

    const userId = req.user?.userId;
console.log(req.user)
    if (!userId) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "Please log in first.",
      );
    }

	const result = await PropertyService.propertyCreate(
		payload,
		req.file?.buffer,
		userId as string,
	);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "property Create successfully!",
		data: result,
	});
});
const getAllOwnProperty = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user?.userId;

	const result = await PropertyService.getAllOwnProperty();
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Property Retrieved Successfully",
		data: result,
	});
});
const getSingleProperty = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	const result = await PropertyService.getSingleOwnProperty(id as string);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Property Retrieved Successfully",
		data: result,
	});
});
const propertyUpdated = catchAsync(async (req: Request, res: Response) => {
	// if (!req.file) {
	// 	throw new AppError(httpStatus.BAD_REQUEST, "No File Provided.");
	// }
 const payload =
    typeof req.body.data === "string"
      ? JSON.parse(req.body.data)
      : req.body.data ?? req.body;
    const files = req.file ?? null ;
	// const payload = JSON.parse(req.body.data);
	const { id: propertyId } = req.params;
	// const payload = req.body.data;
	const userId = req.user?.userId;
	console.log(payload)
	const result = await PropertyService.propertyUpdated(
		payload,
		files?.buffer,
		userId as string,
		propertyId as string,
	);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "property updated successfully!",
		data: result,
	});
});
const deletedProperty = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const userId = req.user?.userId;

	const result = await PropertyService.deleteProperty(
		id as string,
		userId as string,
	);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Property deleted s Successfully",
		data: result,
	});
});
export const PropertyController = {
	propertyCreate,
	getAllOwnProperty,
	getSingleProperty,
	deletedProperty,
	propertyUpdated,
};
