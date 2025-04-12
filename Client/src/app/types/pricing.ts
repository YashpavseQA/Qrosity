/**
 * Pricing TypeScript type definitions
 * 
 * This file exports types and interfaces for pricing and tax entities:
 * CustomerGroup, SellingChannel, TaxRegion, TaxRate, TaxRateProfile
 */

// User interface for audit fields
export interface User {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

// Base interface for common fields (following pattern from catalogue.ts)
export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
  created_by?: User;
  updated_by?: User;
}

// Customer Group entity
export interface CustomerGroup extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
}

// Selling Channel entity
export interface SellingChannel extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
}

// Country entity for use in TaxRegion
export interface Country {
  id: number;
  name: string;
  code: string;
}

// Tax Region entity
export interface TaxRegion extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  countries: Country[]; // Many-to-many relationship with countries
}

// Tax Rate entity
export interface TaxRate extends BaseEntity {
  name: string;
  code: string;
  rate: number; // Percentage value
  description?: string;
  is_active: boolean;
  // Additional fields used in the application
  tax_regions: number[]; // ManyToMany relationship with TaxRegion
  tax_type: string;
  tax_code: string;
  tax_percentage: number;
  price_from?: number;
  price_to?: number;
  category_id?: number | null;
}

// Tax Rate Profile entity
export interface TaxRateProfile extends BaseEntity {
  name: string;
  code: string | null;
  description?: string | null;
  is_active: boolean;
  tax_rates: number[] | TaxRate[]; // Can be either IDs (for API requests) or TaxRate objects (from API responses)
  is_default: boolean;
}

// API response types for pricing entities
export interface PricingListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Filter types for pricing entities
export interface PricingFilter {
  search?: string;
  is_active?: boolean;
}
