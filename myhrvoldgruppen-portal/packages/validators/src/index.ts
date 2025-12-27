import { z } from "zod";

// User schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  replitId: z.string().optional(),
  email: z.string().email().optional(),
  name: z.string().min(1),
  role: z.enum(["admin", "manager", "user", "technician", "partner"]),
  department: z.string().optional(),
  phone: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const createUserSchema = userSchema.omit({ id: true });
export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;

// Customer schemas
export const customerSchema = z.object({
  id: z.string().uuid(),
  vismaId: z.string().optional(),
  name: z.string().min(1),
  orgNumber: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  county: z.string().optional(),
  contactPerson: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const createCustomerSchema = customerSchema.omit({ id: true });
export type Customer = z.infer<typeof customerSchema>;
export type CreateCustomer = z.infer<typeof createCustomerSchema>;

// Claim schemas
export const claimPriority = z.enum(["low", "medium", "high", "critical"]);
export const claimStatus = z.enum([
  "new",
  "in_progress",
  "waiting",
  "resolved",
  "closed",
]);

export const claimSchema = z.object({
  id: z.string().uuid(),
  claimNumber: z.string(),
  customerId: z.string().uuid().optional(),
  status: claimStatus.default("new"),
  priority: claimPriority.default("medium"),
  title: z.string().min(1),
  description: z.string().optional(),
  productName: z.string().optional(),
  serialNumber: z.string().optional(),
  purchaseDate: z.date().optional(),
  reportedDate: z.date(),
  assignedTo: z.string().uuid().optional(),
  createdBy: z.string().uuid().optional(),
});

export const createClaimSchema = claimSchema.omit({
  id: true,
  claimNumber: true,
  reportedDate: true,
});

export type ClaimPriority = z.infer<typeof claimPriority>;
export type ClaimStatus = z.infer<typeof claimStatus>;
export type Claim = z.infer<typeof claimSchema>;
export type CreateClaim = z.infer<typeof createClaimSchema>;
