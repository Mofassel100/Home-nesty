import { z } from "zod";

export const QuestionCreateZodSchema = z.object({
 
    title: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long"),

    description: z
      .string("Invalid description address")
      .trim()
      .min(2, "Name must be at least 2 characters long"),

});

export const UpdateQuestionZodSchema = z.object({
  
    title: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long")
      .optional(),

    description: z
      .string("Invalid description address")
      .trim()
      .min(2, "Name must be at least 2 characters long")
      .optional(),
      status: z.enum(["ACTIVE", "BLOCKED", "DELETED"])
      .optional(),
      
  

});


