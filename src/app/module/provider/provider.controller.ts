import type { Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ApplyAsProviderValidationZodSchema } from "./provider.validation";
import { ProviderServices } from "./provider.service";
import { ICreateProvider } from "./provider.interface";

const applyAsProvider = catchAsync(async (req: Request, res: Response) => {
		if (!req.file) {
		throw new AppError(httpStatus.BAD_REQUEST, "No File Provided.");
	}
	// const files = req.files;
	// console.log({ files });
	const resume = req.file?.buffer

	const payload = req.body.data;

	const result = await ProviderServices.applyAsProvider(
		payload   as ICreateProvider ,
		resume
	);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Applied As Provider Successfuly",
		data: result,
	});
});
const verifyProviderEmail = catchAsync(async (req: Request, res: Response) => {
	
	const payload = req.body;

	const result = await ProviderServices.verifyProviderEmail(payload)
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "provider Email Verified Successfully",
		data: result,
	});
});
const approveProvider = catchAsync(async (req: Request, res: Response) => {
	
	const payload = req.body;
	const user = req.user!

	const result = await ProviderServices.approveProvider(payload, user)
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "provider Email Verified Successfully",
		data: result,
	});
});
const getAllProviders = catchAsync(async (req: Request, res: Response) => {
	

	// const {data, meta} = await DoctorServices.getAllDoctors(req.query)
	// sendResponse(res, {
	// 	statusCode: httpStatus.OK,
	// 	success: true,
	// 	message: "provider Retrieved Successfully",
	// 	data: data,
	// 	meta : meta,
	// });
});
const updateProviderProfile = catchAsync(
	async (req: Request, res: Response) => {
		// const payload = req.body;
		// const user = req.user!;

		// const result = await DoctorServices.updateDoctorProfile(payload, user);
		// sendResponse(res, {
		// 	statusCode: httpStatus.OK,
		// 	success: true,
		// 	message: "Provider Profile Updated Successfully",
		// 	data: result,
		// });
	},
);



const getAvailableProvider = catchAsync(
	async (req: Request, res: Response) => {
	

		// const { data, meta } = await DoctorServices.getAvailableDoctorByTodaysSchedule(
		// 	req.query
		// );
		// sendResponse(res, {
		// 	statusCode: httpStatus.OK,
		// 	success: true,
		// 	message: "Provider retrieved Successfully",
		// 	data,
		// 	meta,
		// });
	},
);

const getAllProvider = catchAsync(async (req: Request, res: Response) => {


	// const { data, meta } = await DoctorServices.getAllDoctorsListPublic(
	// 	req.query
	// );
	// sendResponse(res, {
	// 	statusCode: httpStatus.OK,
	// 	success: true,
	// 	message: "Provider Retrieved Successfully",
	// 	data,
	// 	meta,
	// });
});

const getSingleProvider = catchAsync(
	async (req: Request, res: Response) => {

		// const providerId = req.params.doctorId as string
		
		// const result = await DoctorServices.getSingleDoctorPublicProfile(
		// 	providerId
		// );
		// sendResponse(res, {
		// 	statusCode: httpStatus.OK,
		// 	success: true,
		// 	message: "provider Profile Retrieved Successfully",
		// 	data: result,
		// });
	},
);

export const ProviderController = {
	applyAsProvider,
	verifyProviderEmail,
	approveProvider,
	getAllProviders,
	updateProviderProfile,
	getAvailableProvider,
	getAllProvider,
	getSingleProvider,
};