import type { Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BookingService } from "./booking.service";

const bookingCreate = catchAsync(async (req: Request, res: Response) => {
    // const payload = JSON.parse(req.body.data);
    const payload = req.body
    const userId = req.user?.userId;
    console.log(payload,userId)
    const result = await BookingService.bookingCreate(
        payload,
        userId as string,
    );

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "property Create successfully!",
        data: result,
    });
});

const payBooking = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;
	const user = req.user!;

	const result = await BookingService.payBooking(payload, user);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Booking Payment Initiated Successfully",
		data: result,
	});
});
const bookingCallback = catchAsync(
	async (req: Request, res: Response) => {
		const { redirectUrl } = await BookingService.bookingCallback(
			req.query,
		);

		res.redirect(redirectUrl);
		// sendResponse(res, {
		//     statusCode: httpStatus.OK,
		//     success: true,
		//     message: "User profile fetched successfully",
		//     data: result,
		// });
	},
);
const updateBookingStatus = catchAsync(
	async (req: Request, res: Response) => {
		const bookingId = req.params.bookingId as string;
		const payload = req.body;
		const user = req.user!;

		const result = await BookingService.updateBookingStatus(
			bookingId,
			payload,
			user,
		);
		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: "Booking Status Updated Successfully",
			data: result,
		});
	},
);

const getAllOwnBooking = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
console.log(userId)
    const result = await BookingService.getAllOwnBooking(userId as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking Retrieved Successfully",
        data: result,
    });
});
const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await BookingService.getSingleOwnBooking(id as string);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking Retrieved Successfully",
        data: result,
    });
});
const bookingUpdated = catchAsync(async (req: Request, res: Response) => {


    // const payload = JSON.parse(req.body.data);
    const { id: bookingId } = req.params;
    const payload = req.body
    const userId = req.user?.userId;
    const result = await BookingService.updatedBooking(
        payload,
        userId as string,
        bookingId as string,
    );

    sendResponse(res, {
        statusCode: httpStatus.UPGRADE_REQUIRED,
        success: true,
        message: "Booking updated successfully!",
        data: result,
    });
});
const deletedBooking = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;

    const result = await BookingService.deleteBooking(
        id as string,
        userId as string,
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking deleted s Successfully",
        data: result,
    });
});
export const BookingController = {
    bookingCreate,
    getAllOwnBooking,
    getSingleBooking,
    deletedBooking,
    bookingUpdated,
    payBooking,
    updateBookingStatus,
    bookingCallback

};
