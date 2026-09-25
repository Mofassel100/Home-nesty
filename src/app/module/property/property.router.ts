import { Router } from "express";
import { PropertyController } from "./property.controller";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { upload } from "../../lib/multer";
import { validateRequest } from "../../middleware/validateRequest";
import { CreatePropertyValidationZodSchema } from "./property.validation";

const router = Router();

router.post(
    "/create",
    // validateRequest(UserValidation.UserRegistrationZodSchema),
     auth(Role.ADMIN, Role.PROVIDER, Role.SUPER_ADMIN),
     upload.single("property"),
     validateRequest(CreatePropertyValidationZodSchema),
   PropertyController.propertyCreate
);
// router.post(
//     "/verify-email",
//     validateRequest(UserValidation.UserEmailVerifyZodSchema),
//     AuthController.verifyUserEmail,
// );
// router.post(
//     "/login",
//     validateRequest(UserValidation.LoginZodSchema),
//     AuthController.loginUser,
// );
router.get(
    "/",
    auth(Role.ADMIN, Role.PROVIDER, Role.SUPER_ADMIN),
    // validateRequest
    PropertyController.getAllOwnProperty,
);
// router.post("/refresh-token", AuthController.refreshToken);
// // router.post("/google", AuthController.googleLogin);
// router.post(
//     "/forgot-password",
//     validateRequest(UserValidation.ForgotPasswordZodSchema),
//     AuthController.forgotPassword,
// );
// router.post(
//     "/reset-password",
//     validateRequest(UserValidation.ResetPasswordZodSchema),
//     AuthController.resetPassword,
// );
export const PropertyRoutes = router;