import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { upload } from "../../lib/multer";
import { auth } from "../../middleware/checkAuth";
import { UserController } from "./user.controller";

const router = Router();

router.patch(
	"/me",
	auth(Role.SUPER_ADMIN, Role.ADMIN, Role.PROVIDER,Role.CUSTOMER),
	upload.single("house-backend"),
	UserController.uploadProfileImage,
);

export const UserRoutes = router;