import type { Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PropertyService } from "./property.service";


const propertyCreate = catchAsync(async (req: Request, res: Response) => {
	if (!req.file) {
		throw new AppError(httpStatus.BAD_REQUEST, "No File Provided.");
	}

	// const payload = JSON.parse(req.body.data);
	const payload = req.body.data;
	console.log(req.file,"req.file", req,)
    const userId = req.user?.userId
	const result  = await  PropertyService.propertyCreate(payload,req.file?.buffer,userId as string);
    

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "property Create successfully!",
		data: result,
	});
});
const getAllOwnProperty = catchAsync(async (req: Request, res: Response) => {
const userId = req.user?.userId

	const result = await PropertyService.getAllOwnProperty(
		userId as string
	);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Property Retrieved Successfully",
		data:result,
	
	});
});

export const PropertyController = {
propertyCreate,
getAllOwnProperty
};