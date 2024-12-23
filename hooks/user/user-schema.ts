
import { z } from "zod";

// Role Schema
const RoleSchema = z.object({
  id: z.number().min(1, "ID must be a positive number"), // Positive ID
  name: z.string().nonempty("Role name is required"), // Non-empty string
  description: z.string().optional(), // Optional description
  createdAt: z.string().datetime({ message: "Invalid date-time format for createdAt" }), // ISO date-time string
  updatedAt: z.string().datetime({ message: "Invalid date-time format for updatedAt" }), // ISO date-time string
});

// User Schema
export const UserRetrieveSchema = z.object({
  id: z.number().min(1, "ID must be a positive number"), // Positive ID
  username: z.string().nonempty("Username is required"), // Non-empty string
  password: z.string().nonempty("Password is required"), // Non-empty string
  email: z.string().email("Invalid email address"), // Valid email address
  roles: z.array(RoleSchema), // Array of roles
  status: z.enum(["ACTIVE", "INACTIVE"]), // Enum for status
  createdAt: z.string().datetime({ message: "Invalid date-time format for createdAt" }), // ISO date-time string
  updatedAt: z.string().datetime({ message: "Invalid date-time format for updatedAt" }), // ISO date-time string
  updatedById: z.number().min(1, "UpdatedById must be a positive number"),
  createdById: z.number().min(1, "UpdatedById must be a positive number"),
});


// User Create/Update Schema
export const UserUpdateSchema = z.object({
  username: z.string().nonempty("Username is required"), // Non-empty string
  email: z.string().email("Invalid email address"), // Valid email address
  password: z.string().min(6, "Password must be at least 6 characters long"), // Minimum password length
  roleIds: z.array(z.number().int().positive("Role ID must be a positive integer")), // Array of positive integers
  status: z.enum(["ACTIVE", "INACTIVE"]), // Enum for status
  updatedById: z.number().min(1, "UpdatedById must be a positive number"), // Positive ID
});

export const UserCreateSchema = z.object({
  username: z.string().nonempty("Username is required"), // Non-empty string
  email: z.string().email("Invalid email address"), // Valid email address
  password: z.string().min(6, "Password must be at least 6 characters long"), // Minimum password length
  roleIds: z.array(z.number().int().positive("Role ID must be a positive integer")), // Array of positive integers
  status: z.enum(["ACTIVE", "INACTIVE"]), // Enum for status
  createdById: z.number().min(1, "UpdatedById must be a positive number"), // Positive ID
});


export type UserRetrieveDTO = z.infer<typeof UserRetrieveSchema>;
export type UserCreateDTO = z.infer<typeof UserCreateSchema>;
export type UserUpdateDTO = z.infer<typeof UserUpdateSchema>;
