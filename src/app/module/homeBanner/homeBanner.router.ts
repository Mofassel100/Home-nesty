import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { upload } from "../../lib/multer";
import { validateRequest } from "../../middleware/validateRequest";
import { CreateHomeBannerValidation } from "./homeBanner.validation";
import { HomeBannerController } from "./homeBanner.controller";


const router = Router();

router.post(
    "/create",
    // validateRequest(UserValidation.UserRegistrationZodSchema),
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    upload.single("homeBanner"),
    validateRequest(CreateHomeBannerValidation),
    HomeBannerController.homeBannerCreate,
);

router.get(
    "/",
    HomeBannerController.getAllOwnHomeBanner,
);
router.get(
    "/:id",
    auth(Role.ADMIN, Role.PROVIDER, Role.CUSTOMER,Role.SUPER_ADMIN),
    // validateRequest
    HomeBannerController.getSingleHomeBanner,
);
router.patch(
    "/:id",
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    upload.single("homeBanner"),
    // validateRequest(updatedPropertyValidationZodSchema),
    HomeBannerController.homeBannerUpdated,
);
router.delete(
    "/:id",
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    // validateRequest
    HomeBannerController.deletedHomeBanner,
);

export const HomeBannerRoutes = router;
