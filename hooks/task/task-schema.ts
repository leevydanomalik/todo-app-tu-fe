import { z } from "zod";

// Role Schema
const RoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// AssignedTo Schema (User)
const AssignedToSchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  roles: z.array(RoleSchema),
  status: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Schema for assignedTo, createdBy, and updatedBy
const UserSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format"),
});

// Schema for the main task object
export const TaskRetrieveSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  deadline: z.string().datetime("Invalid date format"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  assignedTo: UserSchema,
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "TERMINATE"]),
  createdAt: z.string().datetime("Invalid date format"),
  updatedAt: z.string().datetime("Invalid date format"),
  createdBy: UserSchema,
  updatedBy: UserSchema,
});



// Define the Zod schema for the task input
export const TaskCreateSchema = z.object({
  title: z.string().min(1, "Title is required"), // Ensures title is not empty
  description: z.string().min(1, "Description is required"), // Ensures description is not empty
  deadline: z.string().datetime("Invalid date format"), // Ensures ISO8601 datetime format
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]), // Restricts priority to specific values
  assignedToId: z.number().int().positive("AssignedToId must be a positive integer"), // Positive long number
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "TERMINATE"]), // Restricts status values
  createdById: z.number().int().positive("CreatedById must be a positive integer"), // Positive long number
});

// Define the Zod schema for the task input
export const TaskUpdateSchema = z.object({
  title: z.string().min(1, "Title is required"), // Ensures title is not empty
  description: z.string().min(1, "Description is required"), // Ensures description is not empty
  deadline: z.string().datetime("Invalid date format"), // Ensures ISO8601 datetime format
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]), // Restricts priority to specific values
  assignedToId: z.number().int().positive("AssignedToId must be a positive integer"), // Positive long number
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "TERMINATE"]), // Restricts status values
  updatedById: z.number().int().positive("CreatedById must be a positive integer"), // Positive long number
});


export type TaskRetrieveDTO = z.infer<typeof TaskRetrieveSchema>;
export type TaskCreateDTO = z.infer<typeof TaskCreateSchema>;
export type TaskUpdateDTO = z.infer<typeof TaskUpdateSchema>;

