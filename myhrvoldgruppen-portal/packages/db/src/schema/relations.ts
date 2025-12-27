import { relations } from "drizzle-orm";

import { users } from "./users";
import { customers } from "./customers";
import { suppliers } from "./suppliers";
import { products } from "./products";
import { claims } from "./claims";
import { claimParts } from "./claim-parts";
import { installations } from "./installations";
import { storkjokkenAgreements, dagligvareAgreements } from "./service-agreements";
import { serviceVisits } from "./service-visits";
import { transportDamages } from "./transport-damages";
import { servicePartners } from "./service-partners";
import { apiTokens } from "./api-tokens";

// ========== USERS RELATIONS ==========
export const usersRelations = relations(users, ({ many }) => ({
  assignedClaims: many(claims),
  createdClaims: many(claims),
  createdInstallations: many(installations),
  serviceVisits: many(serviceVisits),
  reportedDamages: many(transportDamages),
  apiTokens: many(apiTokens),
}));

// ========== CUSTOMERS RELATIONS ==========
export const customersRelations = relations(customers, ({ many }) => ({
  claims: many(claims),
  installations: many(installations),
  storkjokkenAgreements: many(storkjokkenAgreements),
  dagligvareAgreements: many(dagligvareAgreements),
  serviceVisits: many(serviceVisits),
  transportDamages: many(transportDamages),
}));

// ========== SUPPLIERS RELATIONS ==========
export const suppliersRelations = relations(suppliers, ({ many }) => ({
  products: many(products),
  claims: many(claims),
  transportDamages: many(transportDamages),
}));

// ========== PRODUCTS RELATIONS ==========
export const productsRelations = relations(products, ({ one, many }) => ({
  supplier: one(suppliers, {
    fields: [products.supplierId],
    references: [suppliers.id],
  }),
  claims: many(claims),
  transportDamages: many(transportDamages),
}));

// ========== CLAIMS RELATIONS ==========
export const claimsRelations = relations(claims, ({ one, many }) => ({
  customer: one(customers, {
    fields: [claims.customerId],
    references: [customers.id],
  }),
  product: one(products, {
    fields: [claims.productId],
    references: [products.id],
  }),
  supplier: one(suppliers, {
    fields: [claims.supplierId],
    references: [suppliers.id],
  }),
  assignedUser: one(users, {
    fields: [claims.assignedUserId],
    references: [users.id],
  }),
  createdByUser: one(users, {
    fields: [claims.createdBy],
    references: [users.id],
  }),
  parts: many(claimParts),
}));

// ========== CLAIM_PARTS RELATIONS ==========
export const claimPartsRelations = relations(claimParts, ({ one }) => ({
  claim: one(claims, {
    fields: [claimParts.claimId],
    references: [claims.id],
  }),
}));

// ========== INSTALLATIONS RELATIONS ==========
export const installationsRelations = relations(installations, ({ one, many }) => ({
  customer: one(customers, {
    fields: [installations.customerId],
    references: [customers.id],
  }),
  leadInstaller: one(users, {
    fields: [installations.leadInstallerId],
    references: [users.id],
  }),
  projectManager: one(users, {
    fields: [installations.projectManagerId],
    references: [users.id],
  }),
  transportDamages: many(transportDamages),
}));

// ========== STORKJOKKEN_AGREEMENTS RELATIONS ==========
export const storkjokkenAgreementsRelations = relations(storkjokkenAgreements, ({ one, many }) => ({
  customer: one(customers, {
    fields: [storkjokkenAgreements.customerId],
    references: [customers.id],
  }),
  createdBy: one(users, {
    fields: [storkjokkenAgreements.createdById],
    references: [users.id],
  }),
  serviceVisits: many(serviceVisits),
}));

// ========== DAGLIGVARE_AGREEMENTS RELATIONS ==========
export const dagligvareAgreementsRelations = relations(dagligvareAgreements, ({ one }) => ({
  customer: one(customers, {
    fields: [dagligvareAgreements.customerId],
    references: [customers.id],
  }),
  createdBy: one(users, {
    fields: [dagligvareAgreements.createdById],
    references: [users.id],
  }),
}));

// ========== SERVICE_VISITS RELATIONS ==========
export const serviceVisitsRelations = relations(serviceVisits, ({ one }) => ({
  agreement: one(storkjokkenAgreements, {
    fields: [serviceVisits.agreementId],
    references: [storkjokkenAgreements.id],
  }),
  customer: one(customers, {
    fields: [serviceVisits.customerId],
    references: [customers.id],
  }),
  technician: one(users, {
    fields: [serviceVisits.technicianId],
    references: [users.id],
  }),
}));

// ========== TRANSPORT_DAMAGES RELATIONS ==========
export const transportDamagesRelations = relations(transportDamages, ({ one }) => ({
  reportedByUser: one(users, {
    fields: [transportDamages.reportedBy],
    references: [users.id],
  }),
  customer: one(customers, {
    fields: [transportDamages.customerId],
    references: [customers.id],
  }),
  supplier: one(suppliers, {
    fields: [transportDamages.supplierId],
    references: [suppliers.id],
  }),
  product: one(products, {
    fields: [transportDamages.productId],
    references: [products.id],
  }),
  installation: one(installations, {
    fields: [transportDamages.installationId],
    references: [installations.id],
  }),
}));

// ========== SERVICE_PARTNERS RELATIONS ==========
export const servicePartnersRelations = relations(servicePartners, ({ one }) => ({
  serviceCoordinator: one(users, {
    fields: [servicePartners.serviceCoordinatorId],
    references: [users.id],
  }),
}));

// ========== API_TOKENS RELATIONS ==========
export const apiTokensRelations = relations(apiTokens, ({ one }) => ({
  user: one(users, {
    fields: [apiTokens.userId],
    references: [users.id],
  }),
}));
