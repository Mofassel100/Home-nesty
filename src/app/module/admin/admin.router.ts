import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { AdminController } from "./admin.controller";



const router = Router();

router.get(
    "/user-all",
    auth( Role.ADMIN),
    AdminController.getMyUser,
);

export const AdminRoutes = router;
