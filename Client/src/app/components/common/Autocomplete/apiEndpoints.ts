/**
 * Centralized API endpoints for entity autocomplete components
 * This file provides a single source of truth for API endpoints used in the admin UI
 */
import { apiEndpoints } from '@/lib/api';

export const entityEndpoints = {
  // Catalogue endpoints
  divisions: apiEndpoints.catalogue.divisions.list,
  categories: apiEndpoints.catalogue.categories.list,
  subcategories: apiEndpoints.catalogue.subcategories.list,
  unitOfMeasures: apiEndpoints.catalogue.unitOfMeasures.list,
  productStatuses: apiEndpoints.catalogue.productStatuses.list,
  
  // Pricing endpoints
  taxRateProfiles: apiEndpoints.pricing.taxRateProfiles.list,
  currencies: '/shared/currencies/',  // Using the direct path since it's in the shared module
  
  // Add more endpoints as needed
};

export default entityEndpoints;
