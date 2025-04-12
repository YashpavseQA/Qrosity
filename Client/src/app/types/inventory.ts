'use client';

/**
 * Inventory TypeScript type definitions
 * 
 * This file exports types and interfaces for inventory entities:
 * AdjustmentReason, StockAdjustment, etc.
 */

// Base interface for common fields
export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
  created_by?: User;
  updated_by?: User;
}

// User interface for audit fields
export interface User {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

// Adjustment Reason entity
export interface AdjustmentReason extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  adjustment_type: 'INCREASE' | 'DECREASE';
}

// Paginated response interface for API responses
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Filter types for inventory entities
export interface InventoryFilter {
  search?: string;
  is_active?: boolean;
  adjustment_type?: string;
  page?: number;
  page_size?: number;
}

// Inventory Item entity
export interface InventoryItem extends BaseEntity {
  id: number;
  product: {
    id: number;
    name: string;
    sku: string;
  };
  location: {
    id: number;
    name: string;
    code: string;
  };
  quantity: number;
  reserved_quantity: number;
  available_quantity: number;
  is_active: boolean;
}

// Inventory Adjustment entity
export interface InventoryAdjustment extends BaseEntity {
  id: number;
  inventory: number;
  adjustment_type: string;
  reason: number;
  quantity: number;
  lot_number?: string;
  expiry_date?: string;
  notes?: string;
}
