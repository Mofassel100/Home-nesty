import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";

import { UserValidation } from "./auth.validation";
import { AuthController } from "./auth.controller";

const router = Router();

router.post(
	"/register",
	validateRequest(UserValidation.UserRegistrationZodSchema),
	AuthController.registerPatient,
);
router.post(
	"/verify-email",
	validateRequest(UserValidation.UserEmailVerifyZodSchema),
	AuthController.verifyUserEmail,
);
router.post(
	"/login",
	validateRequest(UserValidation.LoginZodSchema),
	AuthController.loginUser,
);
// router.get(
// 	"/me",
// 	auth(Role.ADMIN, Role.DOCTOR, Role.PATIENT, Role.SUPER_ADMIN),
// 	// validateRequest
// 	AuthController.getMe,
// );
// router.post("/refresh-token", AuthController.refreshToken);
// router.post("/google", AuthController.googleLogin);
// router.post(
// 	"/forgot-password",
// 	validateRequest(UserValidation.ForgotPasswordZodSchema),
// 	AuthController.forgotPassword,
// );
// router.post(
// 	"/reset-password",
// 	validateRequest(UserValidation.ResetPasswordZodSchema),
// 	AuthController.resetPassword,
// );
export const AuthRoutes = router;