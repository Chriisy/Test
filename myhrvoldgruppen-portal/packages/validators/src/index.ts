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

// Service Agreement schemas
export const serviceAgreementType = z.enum(["storkjokken", "dagligvare"]);
export const agreementStatus = z.enum(["active", "pending_renewal", "expired", "cancelled"]);

export const serviceAgreementSchema = z.object({
  id: z.string().uuid(),
  agreementNumber: z.string(),
  customerId: z.string().uuid(),
  type: serviceAgreementType,
  status: agreementStatus.default("active"),
  startDate: z.date(),
  endDate: z.date(),
  annualValue: z.number().positive().optional(),
  notes: z.string().optional(),
});

export const createServiceAgreementSchema = serviceAgreementSchema.omit({
  id: true,
  agreementNumber: true,
});

export type ServiceAgreementType = z.infer<typeof serviceAgreementType>;
export type AgreementStatus = z.infer<typeof agreementStatus>;
export type ServiceAgreement = z.infer<typeof serviceAgreementSchema>;
export type CreateServiceAgreement = z.infer<typeof createServiceAgreementSchema>;

// Service Visit schemas
export const visitStatus = z.enum(["scheduled", "in_progress", "completed", "cancelled"]);
export const visitType = z.enum(["quarterly", "annual", "emergency", "installation"]);

export const serviceVisitSchema = z.object({
  id: z.string().uuid(),
  agreementId: z.string().uuid(),
  scheduledDate: z.date(),
  scheduledTime: z.string().optional(),
  technicianId: z.string().uuid().optional(),
  status: visitStatus.default("scheduled"),
  type: visitType,
  notes: z.string().optional(),
  completedAt: z.date().optional(),
});

export const createServiceVisitSchema = serviceVisitSchema.omit({
  id: true,
  completedAt: true,
});

export type VisitStatus = z.infer<typeof visitStatus>;
export type VisitType = z.infer<typeof visitType>;
export type ServiceVisit = z.infer<typeof serviceVisitSchema>;
export type CreateServiceVisit = z.infer<typeof createServiceVisitSchema>;

// Common validation helpers
export const norwegianPhoneSchema = z.string().regex(
  /^(\+47)?[2-9]\d{7}$/,
  "Ugyldig telefonnummer"
);

export const norwegianOrgNumberSchema = z.string().regex(
  /^\d{9}$/,
  "Organisasjonsnummer må være 9 siffer"
);

export const norwegianPostalCodeSchema = z.string().regex(
  /^\d{4}$/,
  "Postnummer må være 4 siffer"
);

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export type Pagination = z.infer<typeof paginationSchema>;
