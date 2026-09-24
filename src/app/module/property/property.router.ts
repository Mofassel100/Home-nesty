import { Router } from "express";
import { PropertyController } from "./property.controller";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
    "/property",
    // validateRequest(UserValidation.UserRegistrationZodSchema),
     auth(Role.ADMIN, Role.PROVIDER, Role.SUPER_ADMIN),
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
// router.get(
//     "/me",
//     auth(Role.ADMIN, Role.PROVIDER, Role.CUSTOMER, Role.SUPER_ADMIN),
//     // validateRequest
//     AuthController.getMe,
// );
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