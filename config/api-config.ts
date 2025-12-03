/**
 * API Configuration for Website Preview
 * This file contains hardcoded values for API calls in the website preview
 */

export const API_CONFIG = {
  // Authentication token for API requests
  authenticationToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjhlMDQ3ZGEtMzgyOC00ZGNmLWE4ODItYmE0OWUzYzUzOTM3IiwidGVuYW50X2lkIjoiZjA1MjE1NDYtYmIxOC00OTdlLWFlYTEtNjFjZGFiNTM5OWU2Iiwib3JnYW5pemF0aW9uX2lkIjoiY2UyMDZiYTgtM2NjMS00ZTY2LWI5NzctYTNhY2NhMzhkODllIiwiZXhwIjoxNzY3Mjg3NjM2fQ.aSW5OatWJnIhlQ5IFdD7Ksj-5O2UBUhGAIweNJWLWgQ',

  // Tenant ID
  tenantId: 'f0521546-bb18-497e-aea1-61cdab5399e6',

  // Buyer ID / Buyer Tenant ID
  buyerId: '78d8dd86-db15-45e3-b3c6-30ffbbcaded4',

  // Catalog ID / Pricelist ID
  catalogId: '1da021a7-7e91-4063-9e1f-b387c87d1ad4',

  // Base API URL
  baseUrl: 'https://ultronapi-worker-g-p.sourcerer.tech',
};

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Category endpoints
  getCategories: (catalogId?: string) => 
    catalogId 
      ? `/entity/v3/category?catalog_id=${catalogId}`
      : '/entity/v3/category',
  
  // Collection endpoints
  getCollections: (catalogId?: string) =>
    catalogId
      ? `/entity/v3/collection/search?catalog_id=${catalogId}`
      : '/entity/v3/collection/search',
  
  // Product search endpoint
  searchProducts: '/entity/v2/product/search',
  
  // Recommended products
  getRecommendedProducts: (buyerId: string, productId?: string, catalogId?: string) => {
    let url = `/recommended/v2/buyer_tenant/${buyerId}/product/`;
    if (productId) {
      url += productId;
    }
    if (catalogId) {
      url += `?catalog_ids=${encodeURIComponent(catalogId)}`;
    }
    return url;
  },
};

/**
 * Helper function to create API request headers
 */
export const getApiHeaders = () => ({
  'Authorization': API_CONFIG.authenticationToken,
  'Content-Type': 'application/json',
  'x-client-id': 'WEB',
  'x-client-version': '0.0.1',
  'x-client-env': 'DEV',
  'tenant-id': API_CONFIG.tenantId,
  'channel': 'wizshop',
});

