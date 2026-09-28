import { BookingStatus } from "../../../generated/prisma/enums";

export interface ICreateBooking {
  propertyId: string;
  
}

export interface IBookingUpdated {
  endDate?: string;
  startDate?: string;
  status?: BookingStatus;
  guests?: number;
  totalAmount?: number;
}