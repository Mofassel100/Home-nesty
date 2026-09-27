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

// router.get(
//     "/",
//     auth(Role.ADMIN, Role.PROVIDER, Role.SUPER_ADMIN),
//     // validateRequest
//     PropertyController.getAllOwnProperty,
// );
// router.get(
//     "/:id",
//     auth(Role.ADMIN, Role.PROVIDER, Role.SUPER_ADMIN),
//     // validateRequest
//     PropertyController.getSingleProperty,
// );
// router.patch(
//     "/:id",
//     auth(Role.ADMIN, Role.PROVIDER, Role.SUPER_ADMIN),
//     upload.single("propertyUpdate"),
//     validateRequest(updatedPropertyValidationZodSchema),
//     PropertyController.propertyUpdated,
// );
// router.delete(
//     "/:id",
//     auth(Role.ADMIN, Role.PROVIDER, Role.SUPER_ADMIN),
//     // validateRequest
//     PropertyController.deletedProperty,
// );

export const BookingRoutes = router;
