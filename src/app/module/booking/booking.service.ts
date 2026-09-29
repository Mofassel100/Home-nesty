/** biome-ignore-all lint/style/useConst: <explanation> */

import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { generateBookingNumber } from "./booking.constant";
import { IBookingUpdated, IPayBookingPayload, IUpdateBookingStatusPayload } from "./booking.interface";
import { AppError } from "../../utils/AppError";
import { RequestUser } from "../../middleware/checkAuth";
import { getBkashIdToken } from "../../lib/bkash";
import config from "../../config";
import { BookedStatus, BookingStatus, PaymentStatus } from "../../../generated/prisma/enums";
import PDFDocument from "pdfkit";
import { transporter } from "../../lib/nodemailer";
const bookingCreate = async (
  payload: {
    propertyId: string;
   guests?:number
  },
  userId: string,
) => {

const transactionResult = await prisma.$transaction(async (tx) => {
		// business logic

		const customer = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!customer) {
			throw new AppError(httpStatus.NOT_FOUND, "Customer Profile Not Found");
		}
  // Find property
  const property = await prisma.property.findUnique({
    where: {
      id: payload.propertyId,
    },
  });
  if (!property) {
    throw new Error("Property not found");
  }
  const guests = payload.guests ?? 1;

  const totalAmount = Number(property.rent) * 1;
		const bookingNumber = generateBookingNumber();
const startDate = new Date();
  // Start date
  // Automatically generate end date
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 3);


		

		const existingBooking = await prisma.booking.findFirst({
			where : {
				customerId : customer.id,
				
			}
		})

		// if(existingBooking?.status === BookingStatus.PENDING){
		// 	throw new AppError(httpStatus.BAD_REQUEST, "You Already Have A Pending Booking. Please Pay For That")
		// }
		// if(existingBooking?.status === BookingStatus.CONFIRMED){
		// 	throw new AppError(httpStatus.BAD_REQUEST, "You Already Have A Confirmed Booking.")
		// }
	
		// if(existingBooking?.status === BookingStatus.COMPLETED){
		// 	throw new AppError(httpStatus.BAD_REQUEST, "You Already Have Completed An Booking On This Schedule. Please Try Again Another Day")
		// }


		const booking = await tx.booking.create({
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

		const bkashIdToken = await getBkashIdToken();

		if (!bkashIdToken) {
			throw new AppError(httpStatus.BAD_GATEWAY, "No Bkash Access Token Found!");
		}

		const bkashCreatePaymentResponse = await fetch(
			`${config.bkash_base_url}/tokenized/checkout/create`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: bkashIdToken,
					"X-App-Key": config.bkash_app_key,
				},
				body: JSON.stringify({
					mode: "0011",
					// payerReference: "0123456789", //user email or phone number
					payerReference: customer.email, //user email or phone number
					callbackURL: `${config.bkash_callback_url}/booking/payment/callback`,
					amount: totalAmount,
					currency: "BDT",
					intent: "sale",
					// merchantInvoiceNumber: "Inv4" // apppointment id
					merchantInvoiceNumber: booking.id, // apppointment id
				}),
			},
		);

		const bkashCreatePaymentResult = await bkashCreatePaymentResponse.json();

		//paymen model create

		await tx.payment.create({
			data: {
				merchantInvoiceNumber: bkashCreatePaymentResult.merchantInvoiceNumber,
				bookingId: booking.id,
				customerId:userId,
				amount: totalAmount,
				gatewayResponse: bkashCreatePaymentResult,
				bkashPaymentId: bkashCreatePaymentResult.paymentID,
				payerReference: customer.email,
			},
		});

		return {
			paymentUrl: bkashCreatePaymentResult.bkashURL,
		};
	});

	return transactionResult;

//   // Generate booking number
  

//   // Example: calculate total amount
  

//   // Create booking
//   const booking = await prisma.booking.create({
//     data: {
//       bookingNumber,
//       propertyId: payload.propertyId,
//       startDate,
//       endDate,
//       customerId:userId,
//       guests:guests,
//       totalAmount,
//     },
//     include:{
//         customer:true,
//         payments:true,
//         property:true
//     }
//   });

//   return booking;
};


// payment for bkash 
const payBooking = async (payload: IPayBookingPayload, user: RequestUser) => {
	const bookingId = payload.bookingId;

	const existingBooking = await prisma.booking.findUnique({
		where: {
			id: bookingId,
		},

	});

	if (!existingBooking) {
		throw new AppError(httpStatus.NOT_FOUND, "booking Does Not Exists");
	}

	if (existingBooking.status !== "PENDING") {
		throw new AppError(httpStatus.BAD_REQUEST, "booking Is Not Pending!");
	}

	



	const amount = existingBooking.totalAmount.toString();
	const bkashIdToken = await getBkashIdToken();

	if (!bkashIdToken) {
		throw new AppError(httpStatus.BAD_GATEWAY, "No Bkash Access Token Found!");
	}

	const bkashCreatePaymentResponse = await fetch(
		`${config.bkash_base_url}/tokenized/checkout/create`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: bkashIdToken,
				"X-App-Key": config.bkash_app_key,
			},
			body: JSON.stringify({
				mode: "0011",
				// payerReference: "0123456789", //user email or phone number
				payerReference: user.email, //user email or phone number
				callbackURL: `${config.bkash_callback_url}/booking/payment/callback`,
				amount: amount,
				currency: "BDT",
				intent: "sale",
				// merchantInvoiceNumber: "Inv4" // apppointment id
				merchantInvoiceNumber: existingBooking.id, // apppointment id
			}),
		},
	);
  console.log(bkashCreatePaymentResponse)
	const bkashCreatePaymentResult = await bkashCreatePaymentResponse.json();

	// await prisma.payment.update({
	// 	where: {
  //     bookingId:existingBooking.id
	// 		// appointmentId: existingAppointment.id,
	// 	},

	// 	data: {
	// 		merchantInvoiceNumber: bkashCreatePaymentResult.merchantInvoiceNumber,
	// 		gatewayResponse: bkashCreatePaymentResult,
	// 		bkashPaymentId: bkashCreatePaymentResult.paymentID,
	// 	},
	// });

	return {
		paymentUrl: bkashCreatePaymentResult.bkashURL,
	};
};




const bookingCallback = async (query: Record<string, any>) => {
	const transactionResult = await prisma.$transaction(async (tx) => {
		const paymentId = query.paymentID;

		if (!paymentId) {
			throw new AppError(httpStatus.BAD_REQUEST, "Payment Id Missing");
		}

		const status = query.status;

		if (!status) {
			throw new AppError(httpStatus.BAD_REQUEST, "Payment Status is Missing");
		}

		const bkashIdToken = await getBkashIdToken();

		if (!bkashIdToken) {
			throw new AppError(httpStatus.BAD_GATEWAY, "No Bkash Access Token Found!");
		}

		const executedPaymentResponse = await fetch(
			`${config.bkash_base_url}/tokenized/checkout/execute`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: bkashIdToken,
					"X-App-Key": config.bkash_app_key,
				},

				body: JSON.stringify({
					paymentID: paymentId,
				}),
			},
		);

		const executedPaymentResult = await executedPaymentResponse.json();
console.log(executedPaymentResponse)
		if (status === "success") {
console.log(executedPaymentResponse)
			const booking = await prisma.booking.findUnique({
				where : {
					id: executedPaymentResult.merchantInvoiceNumber
				},
        include:{
          customer:true
        }
			});

			if(!booking){
				throw new AppError(httpStatus.NOT_FOUND, "booking Not Found!")
			}



			



			await tx.booking.update({
				where: {
					id: executedPaymentResult.merchantInvoiceNumber,
					
				},
				data: {
					status:"COMPLETED",
				
				},
			});

		
			await tx.payment.update({
				where: {
					bkashPaymentId: paymentId,
				},
				data: {
					status: PaymentStatus.PAID,
					bkashTrxId: executedPaymentResult.trxID,
					paidAt: new Date(),
					gatewayResponse: executedPaymentResult,
				},
			});

			const pdfDocument = new PDFDocument({ margin : 50});

			const pdfChunks : Buffer[] = []

			pdfDocument.on("data", (chunk : Buffer) => {
				pdfChunks.push(chunk)
			})

			const pdfReadyPromise = new Promise<Buffer>((resolve)=>{
				pdfDocument.on("end", () => {
					resolve(Buffer.concat(pdfChunks))
				})
			})

			pdfDocument.fontSize(20).text("Home Nesty System", {align : "center"});
			pdfDocument.fontSize(14).text("Booking Invoice", { align: "center" });
			pdfDocument.moveDown(2)

			pdfDocument.fontSize(12).text(`Customer Name: ${booking.customer?.name}`);
			pdfDocument.text(`Patient Email: ${booking.customer?.email}`);
			pdfDocument.moveDown();


	
			pdfDocument.moveDown();

			pdfDocument.text(`Amount Paid: ${executedPaymentResult.amount} BDT`);
			pdfDocument.text(`Payment Method: bKash`);
			pdfDocument.text(`Transaction Id: ${executedPaymentResult.trxID}`);
			pdfDocument.text(`Paid At: ${executedPaymentResult.paymentExecuteTime}`);

			pdfDocument.end()

			const pdfBuffer = await pdfReadyPromise;

			await transporter.sendMail({
				from: config.email_sender,
				to: booking.customer.email,
				subject: "Your Appointment Invoice - Home nesty System",
				text: "Thank you for booking an rome. Please find your invoice attached.",
				attachments : [
					{
						filename: "invoice.pdf",
						content : pdfBuffer
					}
				]
			})
console.log(booking.id)
			return {
				redirectUrl: `${config.bkash_callback_url}/booking/update-status/${booking?.id}?status=success`,
			};
		} else if (status === "failure") {
			await tx.payment.update({
				where: {
					bkashPaymentId: paymentId,
				},
				data: {
					status: PaymentStatus.FAILED,
					gatewayResponse: executedPaymentResult,
				},
			});
			return {
				redirectUrl: `${config.frontend_url}/dashboard/booking?status=failue`,
			};
		} else if (status === "cancel") {
			await tx.payment.update({
				where: {
					bkashPaymentId: paymentId,
				},
				data: {
					status: PaymentStatus.CANCELLED,
					gatewayResponse: executedPaymentResult,
				},
			});
			return {
				executedPaymentResult,
				redirectUrl: `${config.frontend_url}/dashboard/booking?status=cancel`,
			};
		} else {
			return {
				executedPaymentResult,
				redirectUrl: `${config.frontend_url}/dashboard/booking?error=payment-failed`,
			};
		}
	}, {
		maxWait: 10000, // default: 2000
		timeout: 30000, // default: 5000
	});

	return transactionResult;
};

const updateBookingStatus = async (
	bookingId : string,
	payload : IUpdateBookingStatusPayload,
	user : RequestUser
) => {
  console.log(bookingId,payload,user)
	const customer = await prisma.user.findUnique({
		where: { id: user.userId },
	});

	if (!customer) {
		throw new AppError(httpStatus.NOT_FOUND, "Customer Profile Not Found");
	}

	const booking = await prisma.booking.findUnique({
		where: { id: bookingId, customerId:user.userId },
	});

	if (!booking) {
		throw new AppError(httpStatus.NOT_FOUND, "booking Not Found");
	}

	if(booking.status === BookedStatus.COMPLETED){
		throw new AppError(httpStatus.FORBIDDEN, "booking is already completed")
	}

	if(booking.status === BookedStatus.CANCELLED){
		throw new AppError(httpStatus.FORBIDDEN, "booking is already cancelled")
	}
	if(booking.status === BookedStatus.PENDING){
		throw new AppError(httpStatus.FORBIDDEN, "Booking is Pending. You can change the status after appointment is confirmed")
	}

	if(booking.status === BookedStatus.CONFIRMED){

		if(payload.status !== "ONGOING"){
			throw new AppError(httpStatus.BAD_REQUEST, "Confirmed booking Must Be Ongoing At First")
		}

		await prisma.booking.update({
			where : {
				id : booking.id
			},
			data : {
				status : BookedStatus.COMPLETED
			}
		})


	}


	const updatedBooking = await prisma.booking.findUnique({
		where : {
			id : booking.id
		}
	})

	return updatedBooking
}


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

	if (!user) {
		throw new AppError(httpStatus.NOT_FOUND, "User Profile Not Found");
	}

	const getBooking= await prisma.booking.findUnique({
		where: { id: bookingId },
	});	if (!getBooking) {
		throw new AppError(httpStatus.NOT_FOUND, "Booking Not Found");
	}


	const deletedBooking = await prisma.property.delete({
		where: { id: getBooking.id },
	
	});

	return deletedBooking;
};

export const BookingService = {
    bookingCreate,
    getAllOwnBooking,
    getSingleOwnBooking,
    deleteBooking,
      updatedBooking,
      payBooking,
      bookingCallback,
      updateBookingStatus
};
