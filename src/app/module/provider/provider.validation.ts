// import { z } from "zod";

// export const ApplyAsProviderValidationZodSchema = z.object({
// 	user: z.object({
// 		name: z.string().trim().min(2, "Name must be at least 2 characters long"),

// 		email: z.email("Invalid email address").trim().toLowerCase(),
// 	}),

// 	doctor: z.object({
// 		address: z
// 			.string()
// 			.trim()
// 			.min(5, "Address must be at least 5 characters long")
// 			.optional(),

// 		specialization: z.string().trim().min(2, "Specialization is required"),

// 		licenseNumber: z.string().trim().min(3, "License number is required"),

// 		qualifications: z.string().trim().min(2, "Qualifications are required"),

// 		// Handles converting incoming FormData strings like "12" into an integer number
// 		experienceYears: z
// 			.number()
// 			.int("Experience years must be an integer")
// 			.min(0, "Experience years cannot be negative"),

// 		bio: z
// 			.string()
// 			.trim()
// 			.max(1000, "Bio cannot exceed 1000 characters")
// 			.optional(),

// 		// Handles converting incoming FormData strings like "150.00" into a float number
// 		consultationFee: z
// 			.number()
// 			.min(0, "Consultation fee cannot be negative")
// 			.optional(),
// 		contactNumber: z
// 			.string()
// 			.trim()
// 			.min(5, "Contact number is invalid")
// 			.optional(),
// 	}),
// });

// export const UpdateDoctorProfileValidationZodSchema = z.object({
// 	address: z
// 		.string()
// 		.trim()
// 		.min(5, "Address must be at least 5 characters long")
// 		.optional(),

// 	bio: z
// 		.string()
// 		.trim()
// 		.max(1000, "Bio cannot exceed 1000 characters")
// 		.optional(),

// 	consultationFee: z
// 		.number()
// 		.min(0, "Consultation fee cannot be negative")
// 		.optional(),

// 	contactNumber: z
// 		.string()
// 		.trim()
// 		.min(5, "Contact number is invalid")
// 		.optional(),
// });

import { z } from "zod";


export const ApplyAsProviderValidationZodSchemaCon = z.object({
  user: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long"),

    email: z
      .email("Invalid email address")
      .trim()
      .toLowerCase(),
    password: z
		.string()
		.min(8, "Password Must Minimum 8 Characters Long.")
		.regex(/[a-z]/, "Password must contain atleast 1 Lowercase Letter")
		.regex(/[A-Z]/, "Password must contain atleast 1 Uppercase Letter")

		.regex(/[0-9]/, "Password must contain atleast 1 Number")
		.regex(/[^A-Za-z0-9]/, "Password must contain atleast 1 Special Character"),
  }),

  provider: z.object({
    businessName: z
      .string()
      .trim()
      .min(2, "Business name must be at least 2 characters long")
      .optional(),

    fullName: z
      .string()
      .trim()
      .min(2, "Full name must be at least 2 characters long")
      .optional(),

    phone: z
      .string()
      .trim()
      .min(10, "Phone number must be at least 10 characters long")
      .max(20, "Phone number is too long"),

    address: z
      .string()
      .trim()
      .min(5, "Address must be at least 5 characters long")
       .optional(),
    city: z
      .string()
      .trim()
      .min(2, "City must be at least 2 characters long")
      .optional(),

    nidNumber: z
      .string()
      .trim()
      .min(5, "NID number is invalid")
      .optional(),


    tradeLicense: z
      .string()
      .trim()
      .min(3, "Trade license number is invalid")
      .optional(),

    experience: z
      .number()
      .int("Experience must be an integer")
      .min(0, "Experience cannot be negative")
      .optional(),

    description: z
      .string()
      .trim()
      .max(2000, "Description cannot exceed 2000 characters")
      .optional(),

  

  }),
});
export const ApplyAsProviderValidationZodSchema  = z.object({
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
        .pipe(ApplyAsProviderValidationZodSchemaCon ),
});

export const UpdateProviderProfileValidationZodSchema = z.object({
  businessName: z
    .string()
    .trim()
    .min(2, "Business name must be at least 2 characters long")
    .optional(),

  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters long")
    .optional(),

  phone: z
    .string()
    .trim()
    .min(10, "Phone number must be at least 10 characters long")
    .max(20, "Phone number is too long")
    .optional(),

  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters long")
    .optional(),

  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters long")
    .optional(),

  experience: z
    .number()
    .int("Experience must be an integer")
    .min(0, "Experience cannot be negative")
    .optional(),

  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),

  profileImage: z
    .string()
    .trim()
    .optional(),
});

export const UpdateProviderProfileValidationZod  = z.object({
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
        .pipe(UpdateProviderProfileValidationZodSchema ),
});

export const RejectProviderValidationZodSchema = z.object({
  rejectionReason: z
    .string()
    .trim()
    .min(5, "Rejection reason must be at least 5 characters long")
    .max(500, "Rejection reason cannot exceed 500 characters"),
});

