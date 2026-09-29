import httpStatus from "http-status";
import { Role } from "../../../generated/prisma/enums";
import { PaymentWhereInput } from "../../../generated/prisma/models";
import { IQuery } from "../../interfaces";
import { prisma } from "../../lib/prisma";
import { RequestUser } from "../../middleware/checkAuth";
import { AppError } from "../../utils/AppError";
import { tr } from "zod/locales";


const getMyPayments = async (query : IQuery, user : RequestUser) => {

    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder ? query.sortOrder : "desc"

    const customer = await prisma.user.findUnique({
        where: {id: user.userId },
    });

    if (!customer) {
        throw new AppError(httpStatus.NOT_FOUND, " Profile Not Found");
    }

    const andConditions : PaymentWhereInput[] = [
        {
            booking: { customerId:customer.id }
        }
    ]

    const payments = await prisma.payment.findMany({
        where: { AND : andConditions },
        take: limit,
        skip,
        orderBy: { [sortBy] : sortOrder },
        include: {
            booking: {
                include: {
                    property: { select: { id: true, title: true, city: true,address:true,area:true } }
                },
            },
        },
    });

    const total = await prisma.payment.count({
        where: { AND : andConditions },
    });

    return {
        data: payments,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };


}

const getAllPayments = async (query: IQuery) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder ? query.sortOrder : "desc"

    const andConditions: PaymentWhereInput[] = []

    if(query.patientEmail) {
        andConditions.push({
            booking : {
                customer : {
                    email : query.email
                }
            }
        })
    }

    const payments = await prisma.payment.findMany({
        where: { AND: andConditions },
        take: limit,
        skip,
        orderBy: { [sortBy]: sortOrder },
        include: {
            booking: {
                include: {
                    property: { select: { id: true, title: true, availableRooms: true,city:true,address:true,area:true } },
    
                },
            },
        },
    });

    const total = await prisma.payment.count({
        where: { AND: andConditions },
    });

    return {
        data: payments,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };

}

const getSinglePayment = async (paymentId: string, user: RequestUser) => {
    const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
            booking: {
                include: {
                    customer: {
                        select: { id: true, name: true, email: true, userId: true },
                    },
                    property: { select: { id: true, title: true, availableRooms: true,city:true,address:true,area:true  } },
                   
                },
            },
        },
    });

    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, "Payment Not Found");
    }

    if (user.role === Role.CUSTOMER) {
        if (payment.booking.customer.userId !== user.userId) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                "You Are Not Allowed To View This Payment",
            );
        }
    }

    return payment
}

export const PaymentServices = {
    getAllPayments,
    getMyPayments,
    getSinglePayment
}