import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { upload } from "../../lib/multer";
import { validateRequest } from "../../middleware/validateRequest";
import { BookingController } from "./booking.controller";


const router = Router();

router.post(
    "/create",
    // validateRequest(UserValidation.UserRegistrationZodSchema),
    auth(Role.CUSTOMER),
    BookingController.bookingCreate
);

router.get(
    "/",
    auth(Role.ADMIN, Role.PROVIDER,Role.CUSTOMER, Role.SUPER_ADMIN),
    // validateRequest
    BookingController.getAllOwnBooking,
);
router.get(
    "/:id",
    auth(Role.ADMIN, Role.PROVIDER,Role.CUSTOMER, Role.SUPER_ADMIN),
    // validateRequest
    BookingController.getSingleBooking,
);
router.patch(
    "/:id",
    auth(Role.ADMIN, Role.PROVIDER,Role.CUSTOMER, Role.SUPER_ADMIN),
    // validateRequest(updatedBValidationZodSchema),
    BookingController.bookingUpdated,
);
router.delete(
    "/:id",
    auth(Role.ADMIN, Role.PROVIDER,Role.CUSTOMER, Role.SUPER_ADMIN),
    // validateRequest
    BookingController.deletedBooking,
);

export const BookingRoutes = router;
