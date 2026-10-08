import type { Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { QuestionService } from "./question.service";


const QuestionCreate = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body
	const userId = req.user?.userId;
	const result = await QuestionService.questionCreate(
		payload,
		userId as string,
	);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Question Create successfully!",
		data: result,
	});
});
const getAllOwnQuestion = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user?.userId;

	const result = await QuestionService.getAllQuestion(userId as string);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Question Retrieved Successfully",
		data: result,
	});
});
const getSingleQuestion = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	const result = await QuestionService.getSingleQuestion(id as string);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Question Retrieved Successfully",
		data: result,
	});
});
const QuestionUpdated = catchAsync(async (req: Request, res: Response) => {
	const { id: QuestionId } = req.params;
	const payload = req.body;
	const userId = req.user?.userId;
	const result = await QuestionService.questionUpdated(
		payload,
		userId as string,
        QuestionId as string,
	);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Question updated successfully!",
		data: result,
	});
});
const deletedQuestion = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const userId = req.user?.userId;

	const result = await QuestionService.deletequestion(
		id as string,
		userId as string,
	);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Question deleted s Successfully",
		data: result,
	});
});
export const QuestionController = {
	QuestionCreate,
	getAllOwnQuestion,
	getSingleQuestion,
	deletedQuestion,
	QuestionUpdated,
};
