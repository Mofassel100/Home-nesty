import { z } from "zod";

const HomeBannerCreateSchema = z.object({
    title: z
        .string()
        .trim()
        .min(5, "Title must be at least 5 characters long")
        .max(200, "Title cannot exceed 200 characters"),

    description: z
        .string()
        .trim()
        .min(20, "Description must be at least 20 characters long")
        .max(2000, "Description cannot exceed 2000 characters"),
    
});
export const CreateHomeBannerValidation= z.object({
    data: z
        .string()
        .transform((value, ctx) => {
            try {
                return JSON.parse(value);
            } catch {
                ctx.addIssue({
                    code: "custom",
                    message: "Invalid JSON format in data",
                });

                return z.NEVER;
            }
        })
        .pipe(HomeBannerCreateSchema),
});

const HomeBannerUpdatedSchema = z.object({
    title: z
        .string()
        .trim()
        .min(5, "Title must be at least 5 characters long")
        .max(200, "Title cannot exceed 200 characters")
        .optional(),

    description: z
        .string()
        .trim()
        .min(20, "Description must be at least 20 characters long")
        .max(2000, "Description cannot exceed 2000 characters")
        .optional(),
    
});
export const UpdatedHomeBannerValidation= z.object({
    data: z
        .string()
        .transform((value, ctx) => {
            try {
                return JSON.parse(value);
            } catch {
                ctx.addIssue({
                    code: "custom",
                    message: "Invalid JSON format in data",
                });

                return z.NEVER;
            }
        })
        .pipe(HomeBannerUpdatedSchema),
});