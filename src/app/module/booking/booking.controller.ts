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
// const getAllOwnProperty = catchAsync(async (req: Request, res: Response) => {
//     const userId = req.user?.userId;

//     const result = await PropertyService.getAllOwnProperty(userId as string);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Property Retrieved Successfully",
//         data: result,
//     });
// });
// const getSingleProperty = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params;

//     const result = await PropertyService.getSingleOwnProperty(id as string);
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Property Retrieved Successfully",
//         data: result,
//     });
// });
// const propertyUpdated = catchAsync(async (req: Request, res: Response) => {
//     if (!req.file) {
//         throw new AppError(httpStatus.BAD_REQUEST, "No File Provided.");
//     }

//     // const payload = JSON.parse(req.body.data);
//     const { id: propertyId } = req.params;
//     const payload = req.body.data;
//     const userId = req.user?.userId;
//     const result = await PropertyService.propertyUpdated(
//         payload,
//         req.file?.buffer,
//         userId as string,
//         propertyId as string,
//     );

//     sendResponse(res, {
//         statusCode: httpStatus.CREATED,
//         success: true,
//         message: "property updated successfully!",
//         data: result,
//     });
// });
// const deletedProperty = catchAsync(async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const userId = req.user?.userId;

//     const result = await PropertyService.deleteProperty(
//         id as string,
//         userId as string,
//     );
//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Property deleted s Successfully",
//         data: result,
//     });
// });
export const BookingController = {
    bookingCreate,
    // getAllOwnProperty,
    // getSingleProperty,
    // deletedProperty,
    // propertyUpdated,
};
