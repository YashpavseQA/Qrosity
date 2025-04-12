/**
 * Catalogue TypeScript type definitions
 * 
 * This file exports types and interfaces for catalogue entities:
 * Division, Category, Subcategory, UnitOfMeasure, and ProductStatus
 */

// Base interface for common fields
export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

// User interface for audit fields
export interface User {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

// Division entity
export interface Division extends BaseEntity {
  company_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  image: string | null;
  image_alt_text: string | null;
  created_by: User | null;
  updated_by: User | null;
}

// Category entity
export interface Category extends BaseEntity {
  name: string;
  description?: string;
  is_active: boolean;
  division: number; // Foreign key to Division
  division_name?: string; // For display purposes
  image?: string; // For backend model compatibility
  image_alt_text?: string;
  company_id?: string;
  default_tax_rate?: number;
  tax_inclusive?: boolean;
  sort_order?: number;
  created_by?: User | null;
  updated_by?: User | null;
}

// Subcategory entity
export interface Subcategory extends BaseEntity {
  name: string;
  description?: string;
  is_active: boolean;
  category: number; // Foreign key to Category
  category_name?: string; // For display purposes
  image?: string; // For backend model compatibility
  // image_url?: string;
  image_alt_text?: string;
  company_id?: string; // Hardcoded as "1"
  sort_order?: number; // Added sort order field
  created_by?: User | null;
  updated_by?: User | null;
}

// Unit of Measure entity
export interface UnitOfMeasure extends BaseEntity {
  company_id: string;
  name: string;
  symbol: string;
  description?: string;
  is_active: boolean;
  unit_type: 'COUNTABLE' | 'MEASURABLE';
  type_display: string;
  associated_value: number | null;
  created_by: User | null;
  updated_by: User | null;
}

// Product Status entity
export interface ProductStatus extends BaseEntity {
  name: string;
  description?: string;
  is_active: boolean;
  is_orderable: boolean; // Can products with this status be ordered?
  company_id?: string;
  created_by?: User | null;
  updated_by?: User | null;
}

// API response types for catalogue entities
export interface CatalogueListResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Filter types for catalogue entities
export interface CatalogueFilter {
  search?: string;
  is_active?: boolean;
  division?: number; // For Category filtering
  category?: number; // For Subcategory filtering
}
