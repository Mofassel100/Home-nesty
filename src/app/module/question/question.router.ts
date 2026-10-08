import { Router } from "express";

import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { QuestionCreateZodSchema, UpdateQuestionZodSchema } from "./question.validation";
import { QuestionController } from "./question.controller";


const router = Router();

router.post(
    "/create",
    auth(Role.ADMIN,Role.SUPER_ADMIN),
    validateRequest(QuestionCreateZodSchema),
    QuestionController.QuestionCreate,
);

router.get(
    "/",
    QuestionController.getAllOwnQuestion,
);
router.get(
    "/:id",
    auth(Role.ADMIN,Role.SUPER_ADMIN),
    QuestionController.getSingleQuestion,
);
router.patch(
    "/:id",
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(UpdateQuestionZodSchema),
    QuestionController.QuestionUpdated,
);
router.delete(
    "/:id",
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    QuestionController.deletedQuestion,
);

export const QuestionRoutes = router;
