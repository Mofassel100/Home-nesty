/** biome-ignore-all lint/style/useConst: <explanation> */

import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { generateBookingNumber } from "./booking.constant";

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


export const BookingService = {
    bookingCreate,
    // getAllOwnProperty,
    // getSingleOwnProperty,
    // deleteProperty,
    // propertyUpdated,
};
