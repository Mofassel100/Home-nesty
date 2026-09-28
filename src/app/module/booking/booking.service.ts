/** biome-ignore-all lint/style/useConst: <explanation> */

import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { generateBookingNumber } from "./booking.constant";
import { IBookingUpdated } from "./booking.interface";
import { AppError } from "../../utils/AppError";

const bookingCreate = async (
  payload: {
    propertyId: string;
   guests?:number
  },
  userId: string,
) => {
  // Generate booking number
  const bookingNumber = generateBookingNumber();
const startDate = new Date();
  // Start date
  // Automatically generate end date
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 3);
  // Find property
  const property = await prisma.property.findUnique({
    where: {
      id: payload.propertyId,
    },
  });
  if (!property) {
    throw new Error("Property not found");
  }
  // Example: calculate total amount
  const guests = payload.guests ?? 1;

  const totalAmount = Number(property.rent) * 1;

  // Create booking
  const booking = await prisma.booking.create({
    data: {
      bookingNumber,
      propertyId: payload.propertyId,
      startDate,
      endDate,
      customerId:userId,
      guests:guests,
      totalAmount,
    },
    include:{
        customer:true,
        payments:true,
        property:true
    }
  });

  return booking;
};

const getAllOwnBooking = async (userId: string) => {
	const result = await prisma.booking.findMany({
		where: { customerId: userId },
	});
	return result;
};
const getSingleOwnBooking = async (bookingId: string) => {
	const result = await prisma.booking.findUnique({
		where: { id: bookingId },
	});
	return result;
};

// property update from db
const updatedBooking = async (
	payload:IBookingUpdated ,
	userId: string,
	bookingId: string,
) => {
	const ifExisBooking = await prisma.booking.findUnique({
		where: {
			id: bookingId,
		},
	
	});
if(!ifExisBooking){
  throw new Error("Booking not found")
}

	const updatedBooking = await prisma.booking.update({
		where: {
			id: ifExisBooking.id,
		},
		data: {
			endDate:payload.endDate,
      startDate:payload.startDate,
      status: payload.status,
      guests:payload.guests,
      totalAmount:payload.totalAmount
		},
	});
	return updatedBooking;
};

const deleteBooking = async (bookingId: string, userId: string) => {
	const user = await prisma.user.findUnique({
		where: { id: userId },
	});

	// if (!user) {
	// 	throw new AppError(httpStatus.NOT_FOUND, "User Profile Not Found");
	// }

	// const getBooking= await prisma.booking.findUnique({
	// 	where: { id: bookingId },
	// });	if (!getBooking) {
	// 	throw new AppError(httpStatus.NOT_FOUND, "Booking Not Found");
	// }


	// const deletedBooking = await prisma.property.delete({
	// 	where: { id: getBooking.id },
	
	// });

	// return deletedBooking;
};

export const BookingService = {
    bookingCreate,
    getAllOwnBooking,
    getSingleOwnBooking,
    deleteBooking,
      updatedBooking,
};
