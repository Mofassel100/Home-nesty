import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { upload } from "../../lib/multer";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { ProviderController } from "./provider.controller";
import { ApplyAsProviderValidationZodSchema, UpdateProviderProfileValidationZodSchema } from "./provider.validation";


const router = Router();

router.post(
	"/apply-as-provider",
	upload.single("nidDoc"),
    validateRequest(ApplyAsProviderValidationZodSchema),
	ProviderController.applyAsProvider,
);
router.post(
	"/apply-as-provider/verify-email",
	ProviderController.verifyProviderEmail,
);
router.post(
	"/approve-provider",
	auth(Role.ADMIN, Role.SUPER_ADMIN),
	ProviderController.approveProvider,
);
router.get(
	"/all-provider",
	auth(Role.ADMIN, Role.SUPER_ADMIN),
	ProviderController.getAllProvider,
);

router.patch(
	"/update-my-profile",
	auth(Role.PROVIDER),
	validateRequest(UpdateProviderProfileValidationZodSchema),
	ProviderController.updateProviderProfile,
);

// Public doctor-discovery routes (no auth) — meant for patients browsing before login.
router.get(
	"/",
	ProviderController.getAllProvider,
);

router.get(
	"/provider",
	ProviderController.getAllProviders,
);

router.get(
	"/:providerId",
	ProviderController.getSingleProvider,
);

export const ProviderRoutes = router;