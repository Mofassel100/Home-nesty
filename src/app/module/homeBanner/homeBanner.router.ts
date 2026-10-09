import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { upload } from "../../lib/multer";
import { validateRequest } from "../../middleware/validateRequest";
import { CreateHomeBannerValidation, UpdatedHomeBannerValidation } from "./homeBanner.validation";
import { HomeBannerController } from "./homeBanner.controller";


const router = Router();

router.post(
    "/create",

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
    validateRequest(UpdatedHomeBannerValidation),
    HomeBannerController.homeBannerUpdated,
);
router.delete(
    "/:id",
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    // validateRequest
    HomeBannerController.deletedHomeBanner,
);

export const HomeBannerRoutes = router;
