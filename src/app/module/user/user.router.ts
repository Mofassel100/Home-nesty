import { Router } from "express";
// import { Role } from "../../../generated/prisma/enums";
import { upload } from "../../lib/multer";
import { auth } from "../../middleware/checkAuth";
// import { UserController } from "./user.controller";

const router = Router();

router.patch(
	"/profile-image",
	)
	


 export const  UserRoutes = router;