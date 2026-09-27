import { Router } from "express";
import { PropertyController } from "./property.controller";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { upload } from "../../lib/multer";
import { validateRequest } from "../../middleware/validateRequest";
import {
	CreatePropertyValidationZodSchema,
	updatedPropertyValidationZodSchema,
} from "./property.validation";

const router = Router();

router.post(
	"/create",
	// validateRequest(UserValidation.UserRegistrationZodSchema),
	auth(Role.ADMIN, Role.PROVIDER, Role.SUPER_ADMIN),
	upload.single("property"),
	validateRequest(CreatePropertyValidationZodSchema),
	PropertyController.propertyCreate,
);

router.get(
	"/",
	auth(Role.ADMIN, Role.PROVIDER, Role.SUPER_ADMIN),
	// validateRequest
	PropertyController.getAllOwnProperty,
);
router.get(
	"/:id",
	auth(Role.ADMIN, Role.PROVIDER, Role.SUPER_ADMIN),
	// validateRequest
	PropertyController.getSingleProperty,
);
router.patch(
	"/:id",
	auth(Role.ADMIN, Role.PROVIDER, Role.SUPER_ADMIN),
	upload.single("propertyUpdate"),
	validateRequest(updatedPropertyValidationZodSchema),
	PropertyController.propertyUpdated,
);
router.delete(
	"/:id",
	auth(Role.ADMIN, Role.PROVIDER, Role.SUPER_ADMIN),
	// validateRequest
	PropertyController.deletedProperty,
);

export const PropertyRoutes = router;
