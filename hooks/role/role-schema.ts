import { z } from "zod";


// Role Retrieve Schema
export const RoleRetrieveSchema = z.object({
  id: z.number().min(1, "ID must be a positive number"), // Positive ID
  name: z.string().nonempty("Name is required"), // Non-empty string
  description: z.string().optional(), // Optional description
  createdAt: z.string().datetime({ message: "Invalid date-time format for createdAt" }), // ISO date-time string
  updatedAt: z.string().datetime({ message: "Invalid date-time format for updatedAt" }), // ISO date-time string
});

// Role Create Schema
export const RoleCreateSchema = z.object({
  name: z.string().nonempty("Name is required"), // Name must be provided
  description: z.string().optional(), // Optional description
  createdById: z.number().min(1, "CreatedById must be a positive number"), // Positive ID
});

// Role Update Schema
export const RoleUpdateSchema = z.object({
  id: z.number().min(1, "ID must be a positive number"), // ID is required and must be positive
  name: z.string().nonempty("Name is required"), // Name must be provided
  description: z.string().optional(), // Optional description
  updatedById: z.number().min(1, "UpdatedById must be a positive number"), // Positive ID
});


export type RoleRetrieveDTO = z.infer<typeof RoleRetrieveSchema>;
export type RoleCreateDTO = z.infer<typeof RoleCreateSchema>;
export type RoleUpdateDTO = z.infer<typeof RoleUpdateSchema>;
