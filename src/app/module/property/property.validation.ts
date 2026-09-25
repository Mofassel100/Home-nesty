import { z } from "zod";

const PropertyDataSchema = z.object({
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

	propertyType: z.enum([
		"APARTMENT",
		"HOUSE",
		"SUBLET",
		"ROOM",
		"BACHELOR_ROOM",
		"FAMILY_APARTMENT",
		"SHARED_APARTMENT",
		"HOSTEL",
	]),

	address: z
		.string()
		.trim()
		.min(5, "Address must be at least 5 characters long"),

	city: z
		.string()
		.trim()
		.min(2, "City must be at least 2 characters long"),

	area: z
		.string()
		.trim()
		.min(2, "Area must be at least 2 characters long")
		.optional(),

	rent: z
		.number()
		.min(0, "Rent cannot be negative"),

	securityDeposit: z
		.number()
		.min(0, "Security deposit cannot be negative")
		.optional(),

	bedrooms: z
		.number()
		.int("Bedrooms must be an integer")
		.min(0, "Bedrooms cannot be negative"),

	bathrooms: z
		.number()
		.int("Bathrooms must be an integer")
		.min(0, "Bathrooms cannot be negative"),

	availableRooms: z
		.number()
		.int("Available rooms must be an integer")
		.min(0, "Available rooms cannot be negative"),

	furnished: z.enum([
		"FURNISHED",
		"SEMI_FURNISHED",
		"UNFURNISHED",
	]),

	contactName: z
		.string()
		.trim()
		.min(2, "Contact name must be at least 2 characters long")
		.optional(),

	contactPhone: z
		.string()
		.trim()
		.min(5, "Contact phone is invalid")
		.optional(),

	contactEmail: z
		.email("Invalid contact email address")
		.trim()
		.toLowerCase()
		.optional(),

	status: z.enum([
		"PENDING",
		"APPROVED",
		"REJECTED",
	]),
});

export const CreatePropertyValidationZodSchema = z.object({
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
		.pipe(PropertyDataSchema),
});