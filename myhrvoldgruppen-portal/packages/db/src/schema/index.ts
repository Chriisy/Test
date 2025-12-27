// Myhrvoldgruppen Service Portal - Database Schema
// Komplett schema med 13 tabeller, ~350+ felt

// ========== ENUMS ==========
export { userRoleEnum } from "./users";
export { claimStatusEnum, claimPriorityEnum, warrantyStatusEnum } from "./claims";
export { claimPartStatusEnum } from "./claim-parts";
export { agreementStatusEnum } from "./service-agreements";
export { visitStatusEnum, visitTypeEnum } from "./service-visits";
export { installationStatusEnum, installationPriorityEnum } from "./installations";
export { damageTypeEnum, damageSeverityEnum, damageStatusEnum } from "./transport-damages";
export { partnerTypeEnum, partnerStatusEnum, tradeAreaEnum } from "./service-partners";

// ========== KJERNE-TABELLER (Fase 6) ==========
export { users, type User, type NewUser } from "./users";
export { customers, type Customer, type NewCustomer } from "./customers";
export { suppliers, type Supplier, type NewSupplier } from "./suppliers";
export { products, type Product, type NewProduct } from "./products";

// ========== REKLAMASJONS-TABELLER (Fase 7) ==========
export { claims, type Claim, type NewClaim } from "./claims";
export { claimParts, type ClaimPart, type NewClaimPart } from "./claim-parts";

// ========== SERVICE-TABELLER (Fase 8) ==========
export {
  storkjokkenAgreements,
  dagligvareAgreements,
  type StorkjokkenAgreement,
  type NewStorkjokkenAgreement,
  type DagligvareAgreement,
  type NewDagligvareAgreement,
} from "./service-agreements";
export { serviceVisits, type ServiceVisit, type NewServiceVisit } from "./service-visits";

// ========== ØVRIGE TABELLER (Fase 9) ==========
export { installations, type Installation, type NewInstallation } from "./installations";
export { transportDamages, type TransportDamage, type NewTransportDamage } from "./transport-damages";
export { servicePartners, type ServicePartner, type NewServicePartner } from "./service-partners";

// ========== AUTH-TABELLER ==========
export { apiTokens, type ApiToken, type NewApiToken } from "./api-tokens";

// ========== RELASJONER (Fase 10) ==========
export * from "./relations";
