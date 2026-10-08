/** biome-ignore-all lint/style/useConst: <explanation> */
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { ICreateQuestion, IUpdateQuestion } from "./question.interface";

const questionCreate = async (
	payload: ICreateQuestion,
	userId: string,
) => {

	const createQuestion = await prisma.question.create({
		data: {
			title: payload.title,
            description:payload.description,
            userId : userId
		},
	});

	return createQuestion;
};

const getAllQuestion = async (userId: string) => {
	const result = await prisma.question.findMany({

	});
	return result;
};
const getSingleQuestion = async (QuestionId: string) => {
	const result = await prisma.question.findMany({
		where: { id: QuestionId },
	});
	return result;
};

// Question update from db
const questionUpdated = async (
	payload: IUpdateQuestion,
    userId : string,
	questionId: string,
) => {


	const updatedQuestion = await prisma.question.update({
		where: {
			id: questionId,
		},
		data: {
			title: payload.title,
			description: payload.description,
            status:payload.status

		},
	});

	return updatedQuestion;
};

const deletequestion = async (questionId: string, userId: string) => {
	const user = await prisma.user.findUnique({
		where: { id: userId },
	});

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User Profile Not Found");
	}

	const getQuestion = await prisma.question.findUnique({
		where: { id: questionId },
	});

	if (!getQuestion || getQuestion.isDeleted) {
		throw new AppError(httpStatus.NOT_FOUND, "Question Not Found");
	}
	const DeletedQuestion = await prisma.question.update({
		where: { id: getQuestion.id },
		data: { isDeleted: true, deletedAt: new Date() },
	});

	return DeletedQuestion;
};

export const QuestionService = {
	questionCreate,
	getAllQuestion,
	getSingleQuestion,
	deletequestion,
	questionUpdated,
};
