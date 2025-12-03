# API Connection Documentation for Website Builder

This document provides comprehensive information about how to connect and use the APIs for product and category listing in the website builder.

## Table of Contents
1. [API Configuration](#api-configuration)
2. [Category Listing API](#category-listing-api)
3. [Product Listing API](#product-listing-api)
4. [Category-Based Product Filtering](#category-based-product-filtering)
5. [Product Details API](#product-details-api)
6. [Interactive Features](#interactive-features)
7. [Implementation Examples](#implementation-examples)

---

## API Configuration

All API calls MUST use the `API_CONFIG` from `src/config/api-config.js`. Never hardcode any values.

### Required Config File Structure

```javascript
// src/config/api-config.js
export const API_CONFIG = {
  authenticationToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  tenantId: 'f0521546-bb18-497e-aea1-61cdab5399e6',
  buyerId: '78d8dd86-db15-45e3-b3c6-30ffbbcaded4',
  catalogId: '1da021a7-7e91-4063-9e1f-b387c87d1ad4',
  baseUrl: 'https://ultronapi-worker-g-p.sourcerer.tech',
};

export const getApiHeaders = () => ({
  'Authorization': API_CONFIG.authenticationToken,
  'Content-Type': 'application/json',
  'x-client-id': 'WEB',
  'x-client-version': '0.0.1',
  'x-client-env': 'DEV',
  'tenant-id': API_CONFIG.tenantId,
  'channel': 'wizshop',
});
```

---

## Category Listing API

### Endpoint
- **URL**: `GET /entity/v3/category?catalog_id={catalogId}`
- **Method**: `GET`
- **Query Parameters**:
  - `catalog_id` (required): Use `API_CONFIG.catalogId`

### Request Example

```javascript
import { API_CONFIG, getApiHeaders } from '../config/api-config';

const fetchCategories = async () => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/entity/v3/category?catalog_id=${API_CONFIG.catalogId}`,
    {
      method: 'GET',
      headers: getApiHeaders()
    }
  );
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  const result = await response.json();
  // Response can be array directly or wrapped in data property
  const categories = Array.isArray(result) ? result : (result.data || []);
  return categories;
};
```

### Response Structure

The API returns an array of category objects. Each category object contains:

```javascript
{
  id: "category-id-string",        // REQUIRED: Use this ID for filtering products
  name: "Category Name",
  description: "Category description",
  image: "image-url",
  product_count: 10,               // Number of products in this category
  level: 1,                         // Category hierarchy level
  parent_id: "parent-category-id", // If nested category
  // ... other fields
}
```

### Important Notes

1. **Category ID Extraction**: Each category object has an `id` field - this is the category ID you need to use for filtering products
2. **Response Format**: The response might be directly an array or wrapped in a `data` property
3. **Always Use API_CONFIG**: Never hardcode the base URL or catalog ID

---

## Product Listing API

### Endpoint
- **URL**: `POST /entity/v2/product/search`
- **Method**: `POST`
- **Request Body**: JSON object with filters and pagination

### Request Body Structure

```javascript
{
  catalog_ids: [API_CONFIG.catalogId],  // REQUIRED: Array of catalog IDs
  filters: {
    category: ["category-id-1", "category-id-2"],  // OPTIONAL: Filter by category IDs (use "category" key, not "category_ids")
    // ... other filters
  },
  page_number: 1,                      // Page number (1-indexed)
  page_size: 20,                        // Number of products per page
  sort: [],                             // Sorting options (optional)
  search: "",                           // Search query (optional)
  // ... other optional parameters
}
```

### Request Example (All Products)

```javascript
import { API_CONFIG, getApiHeaders } from '../config/api-config';

const fetchAllProducts = async (page = 1, pageSize = 20) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/entity/v2/product/search`,
    {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        catalog_ids: [API_CONFIG.catalogId],
        page_number: page,
        page_size: pageSize
      })
    }
  );
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  const result = await response.json();
  const productData = result.data || result;
  const products = productData.hits || {};
  
  // Convert hits to array (can be object or array)
  const productsArray = Array.isArray(products) 
    ? products 
    : Object.values(products);
  
  return {
    products: productsArray,
    totalHits: productData.nbHits || 0,
    currentPage: productData.page || 1,
    totalPages: productData.nbPages || 1
  };
};
```

### Response Structure

```javascript
{
  data: {
    hits: {
      // Object with product IDs as keys, OR array of products
      "product-id-1": { ...product1... },
      "product-id-2": { ...product2... },
      // OR
      // [{ ...product1... }, { ...product2... }]
    },
    nbHits: 100,        // Total number of products
    page: 1,            // Current page number
    nbPages: 5,         // Total number of pages
    facets: {}          // Filter facets (optional)
  }
}
```

### Product Object Structure

Each product in the `hits` array/object contains:

```javascript
{
  id: "product-id",
  entity_id: "product-entity-id",
  name: "Product Name",
  sku_id: "SKU-123",
  pricing: {
    final_price: 99.99,           // Single price
    final_range: "$99.99 - $149.99", // Price range string
    min_price: 99.99,              // Minimum price
    max_price: 149.99              // Maximum price
  },
  media: [
    { url: "https://image-url.com/product.jpg" }
  ],
  product_images: ["image-url-1", "image-url-2"],
  inventory: {
    stock: 100,                   // Stock quantity
    min_order_quantity: 1,
    max_order_quantity: 100
  },
  category: [
    { id: "category-id", name: "Category Name" }
  ],
  // ... other fields
}
```

---

## Category-Based Product Filtering

### Overview

The category listing API returns category objects with `id` fields. These category IDs can be used to filter products in the product listing API.

### Workflow

1. **Fetch Categories**: Call the category listing API to get all categories
2. **Extract Category IDs**: Get the `id` field from each category object
3. **Filter Products**: Pass selected category IDs in the `filters.category` parameter (array) of the product listing API

**IMPORTANT**: Use `filters.category` (not `filters.category_ids`) as the key for category filtering.

### Implementation Example

```javascript
import { API_CONFIG, getApiHeaders } from '../config/api-config';
import { useState, useEffect } from 'react';

function CategoryProductListing() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Step 1: Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${API_CONFIG.baseUrl}/entity/v3/category?catalog_id=${API_CONFIG.catalogId}`,
          {
            method: 'GET',
            headers: getApiHeaders()
          }
        );
        
        const result = await response.json();
        const categoriesList = Array.isArray(result) ? result : (result.data || []);
        setCategories(categoriesList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  // Step 2: Fetch products filtered by selected category IDs
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const requestBody = {
          catalog_ids: [API_CONFIG.catalogId],
          page_number: 1,
          page_size: 20
        };
        
        // Step 3: Add category filter if category IDs are selected
        if (selectedCategoryIds.length > 0) {
          requestBody.filters = {
            category: selectedCategoryIds  // Array of category IDs (use "category" key, not "category_ids")
          };
        }
        
        const response = await fetch(
          `${API_CONFIG.baseUrl}/entity/v2/product/search`,
          {
            method: 'POST',
            headers: getApiHeaders(),
            body: JSON.stringify(requestBody)
          }
        );
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const result = await response.json();
        const productData = result.data || result;
        const productHits = productData.hits || {};
        
        // Convert hits to array
        const productsArray = Array.isArray(productHits) 
          ? productHits 
          : Object.values(productHits);
        
        setProducts(productsArray);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [selectedCategoryIds]); // Re-fetch when category selection changes

  // Handle category selection
  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryIds([categoryId]); // Single category selection
    // OR for multiple selection:
    // setSelectedCategoryIds(prev => 
    //   prev.includes(categoryId) 
    //     ? prev.filter(id => id !== categoryId)
    //     : [...prev, categoryId]
    // );
  };

  return (
    <div className="container mx-auto p-4">
      {/* Category List */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`px-4 py-2 rounded-lg border ${
                selectedCategoryIds.includes(category.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name} ({category.product_count || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          {selectedCategoryIds.length > 0 
            ? `Products in Selected Categories` 
            : 'All Products'}
        </h2>
        
        {loading ? (
          <div className="text-center p-8">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => {
              const productId = product.id || product.entity_id || `product-${index}`;
              const productName = product.name || 'Unnamed Product';
              const productImage = product.media?.[0]?.url || product.product_images?.[0] || '';
              
              let price = 'Price not available';
              if (product.pricing) {
                if (product.pricing.final_price) {
                  price = `$${product.pricing.final_price}`;
                } else if (product.pricing.final_range) {
                  price = product.pricing.final_range;
                } else if (product.pricing.min_price && product.pricing.max_price) {
                  price = `$${product.pricing.min_price} - $${product.pricing.max_price}`;
                }
              }
              
              return (
                <div key={productId} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {productImage && (
                    <img 
                      src={productImage} 
                      alt={productName}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{productName}</h3>
                    <p className="text-blue-600 font-bold text-xl mb-2">{price}</p>
                    {product.inventory?.stock !== undefined && (
                      <p className="text-sm text-gray-600">
                        {product.inventory.stock > 0 
                          ? <span className="text-green-600">In Stock ({product.inventory.stock})</span>
                          : <span className="text-red-600">Out of Stock</span>
                        }
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryProductListing;
```

---

## Product Details API

### Endpoint
- **URL**: `POST /entity/v2/product/detail`
- **Method**: `POST`
- **Request Body**: JSON object with product ID and buyer information

### Request Body Structure

```javascript
{
  product_id: "product-id-string",        // REQUIRED: Product ID from product listing
  buyer_tenant_id: "buyer-id-string",    // REQUIRED: Use API_CONFIG.buyerId
  catalog_ids: ["catalog-id-string"]      // REQUIRED: Use [API_CONFIG.catalogId]
}
```

### Request Example

```javascript
import { API_CONFIG, getApiHeaders } from '../config/api-config';

const fetchProductDetails = async (productId) => {
  const response = await fetch(
    `${API_CONFIG.baseUrl}/entity/v2/product/detail`,
    {
      method: 'POST',
      headers: getApiHeaders(),
      body: JSON.stringify({
        product_id: productId,
        buyer_tenant_id: API_CONFIG.buyerId,
        catalog_ids: [API_CONFIG.catalogId]
      })
    }
  );
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  const result = await response.json();
  const productData = result.data || result;
  return productData;
};
```

### Response Structure

The API returns a detailed product object:

```javascript
{
  id: "product-id",
  entity_id: "product-entity-id",
  name: "Product Name",
  sku_id: "SKU-123",
  type: "product" | "variant",
  is_active: true,
  pricing: {
    final_price: 99.99,
    final_range: "$99.99 - $149.99",
    min_price: 99.99,
    max_price: 149.99
  },
  media: [
    { url: "https://image-url.com/product.jpg" }
  ],
  product_images: ["image-url-1", "image-url-2"],
  inventory: {
    stock: 100,
    min_order_quantity: 1,
    max_order_quantity: 100
  },
  custom_attributes: {
    // Custom product attributes
  },
  variants_meta: {
    // Variant information if product has variants
    variant_data_map: {},
    hinge_attributes: []
  },
  category: [
    { id: "category-id", name: "Category Name" }
  ],
  // ... other detailed fields
}
```

### Important Notes

1. **Product ID**: Use the `id` or `entity_id` from the product listing response
2. **Buyer Tenant ID**: Always use `API_CONFIG.buyerId`
3. **Catalog IDs**: Always pass as array: `[API_CONFIG.catalogId]`
4. **Response Format**: Response might be wrapped in `data` property
5. **Reference Implementation**: See `source_code/store-front-poc/src/utils/api_requests/productDetails.ts` for complete implementation

---

## Interactive Features

### 1. Clickable Category Cards

**Requirement**: Each category card in the category listing page MUST be clickable. On click, it should:
1. Extract the category `id` from the clicked category
2. Call the product listing API with `filters.category: [categoryId]`
3. Display the filtered products

**Implementation Example**:

```javascript
function CategoryListing() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch categories
  useEffect(() => {
    // ... fetch categories code ...
  }, []);

  // Handle category click
  const handleCategoryClick = async (categoryId) => {
    setSelectedCategoryId(categoryId);
    setLoading(true);
    
    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}/entity/v2/product/search`,
        {
          method: 'POST',
          headers: getApiHeaders(),
          body: JSON.stringify({
            catalog_ids: [API_CONFIG.catalogId],
            filters: {
              category: [categoryId]  // Filter by clicked category
            },
            page_number: 1,
            page_size: 20
          })
        }
      );
      
      const result = await response.json();
      const productData = result.data || result;
      const productHits = productData.hits || {};
      const productsArray = Array.isArray(productHits) 
        ? productHits 
        : Object.values(productHits);
      
      setFilteredProducts(productsArray);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {categories.map(category => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow"
          >
            {category.image && (
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-32 object-cover rounded mb-2"
              />
            )}
            <h3 className="font-semibold text-lg">{category.name}</h3>
            <p className="text-sm text-gray-600">
              {category.product_count || 0} products
            </p>
          </div>
        ))}
      </div>
      
      {/* Display filtered products when category is selected */}
      {selectedCategoryId && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Products in Selected Category</h2>
          {loading ? (
            <div>Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                // Render product cards
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### 2. Clickable Product Cards

**Requirement**: Each product card in the product listing page MUST be clickable. On click, it should:
1. Extract the product `id` or `entity_id` from the clicked product
2. Navigate to a product details page (using React Router or state-based navigation)
3. Pass the product ID to the product details page

**Implementation Example**:

```javascript
import { useNavigate } from 'react-router-dom';
// OR use state-based navigation if not using React Router

function ProductListing() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // If using React Router
  // OR: const [currentView, setCurrentView] = useState('list');
  // OR: const [selectedProductId, setSelectedProductId] = useState(null);

  // Handle product card click
  const handleProductClick = (product) => {
    const productId = product.id || product.entity_id;
    
    // Option 1: Using React Router
    navigate(`/product/${productId}`);
    
    // Option 2: Using state-based navigation
    // setSelectedProductId(productId);
    // setCurrentView('details');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => {
          const productId = product.id || product.entity_id || `product-${index}`;
          const productName = product.name || 'Unnamed Product';
          const productImage = product.media?.[0]?.url || product.product_images?.[0] || '';
          
          return (
            <div
              key={productId}
              onClick={() => handleProductClick(product)}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              {productImage && (
                <img 
                  src={productImage} 
                  alt={productName}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{productName}</h3>
                {/* Other product details */}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### 3. Product Details Page

**Requirement**: The product details page MUST:
1. Receive the product ID from navigation/URL
2. Call the product details API using the product ID
3. Display all product information including images, pricing, inventory, attributes, etc.
4. Reference the implementation in `source_code/store-front-poc/src/utils/api_requests/productDetails.ts`

**Implementation Example**:

```javascript
import { API_CONFIG, getApiHeaders } from '../config/api-config';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// OR get productId from props/state if using state-based navigation

function ProductDetails() {
  const { productId } = useParams(); // If using React Router
  // OR: const { productId } = props; // If passed as prop
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        const response = await fetch(
          `${API_CONFIG.baseUrl}/entity/v2/product/detail`,
          {
            method: 'POST',
            headers: getApiHeaders(),
            body: JSON.stringify({
              product_id: productId,
              buyer_tenant_id: API_CONFIG.buyerId,
              catalog_ids: [API_CONFIG.catalogId]
            })
          }
        );
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const result = await response.json();
        const productData = result.data || result;
        setProduct(productData);
        setError(null);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError('Failed to load product details');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return <div className="container mx-auto p-8 text-center">Loading product details...</div>;
  }

  if (error || !product) {
    return <div className="container mx-auto p-8 text-center text-red-600">{error || 'Product not found'}</div>;
  }

  // Extract product fields
  const productName = product.name || 'Unnamed Product';
  const productImages = product.media || product.product_images || [];
  const mainImage = productImages[0]?.url || '';
  
  let price = 'Price not available';
  if (product.pricing) {
    if (product.pricing.final_price) {
      price = `$${product.pricing.final_price}`;
    } else if (product.pricing.final_range) {
      price = product.pricing.final_range;
    } else if (product.pricing.min_price && product.pricing.max_price) {
      price = `$${product.pricing.min_price} - $${product.pricing.max_price}`;
    }
  }

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          {mainImage && (
            <img 
              src={mainImage} 
              alt={productName}
              className="w-full rounded-lg"
            />
          )}
          {productImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-4">
              {productImages.slice(1).map((img, idx) => (
                <img 
                  key={idx}
                  src={img.url || img} 
                  alt={`${productName} ${idx + 2}`}
                  className="w-full h-20 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Product Information */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{productName}</h1>
          <p className="text-3xl font-bold text-blue-600 mb-4">{price}</p>
          
          {product.sku_id && (
            <p className="text-gray-600 mb-4">SKU: {product.sku_id}</p>
          )}
          
          {product.inventory && (
            <div className="mb-4">
              <p className="text-lg font-semibold mb-2">Availability</p>
              {product.inventory.stock > 0 ? (
                <p className="text-green-600">
                  In Stock ({product.inventory.stock} available)
                </p>
              ) : (
                <p className="text-red-600">Out of Stock</p>
              )}
              {product.inventory.min_order_quantity && (
                <p className="text-sm text-gray-600">
                  Minimum order: {product.inventory.min_order_quantity}
                </p>
              )}
            </div>
          )}
          
          {/* Custom Attributes */}
          {product.custom_attributes && (
            <div className="mb-4">
              <p className="text-lg font-semibold mb-2">Product Details</p>
              {Object.values(product.custom_attributes).map((attr: any, idx) => (
                <div key={idx} className="mb-2">
                  <span className="font-semibold">{attr.name}:</span>{' '}
                  <span>{attr.value || 'N/A'}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Description */}
          {product.custom_attributes && 
           Object.values(product.custom_attributes).find((attr: any) => attr.name === 'Description') && (
            <div className="mb-4">
              <p className="text-lg font-semibold mb-2">Description</p>
              <p className="text-gray-700">
                {Object.values(product.custom_attributes).find((attr: any) => attr.name === 'Description')?.value}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
```

### Navigation Setup

If using React Router, set up routes:

```javascript
// App.jsx or router setup
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductListing from './ProductListing';
import ProductDetails from './ProductDetails';
import CategoryListing from './CategoryListing';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/categories" element={<CategoryListing />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Key Points for Implementation

### 1. Category Listing
- ✅ Always use `API_CONFIG.baseUrl` and `API_CONFIG.catalogId`
- ✅ Extract `id` field from each category object
- ✅ Handle both array and object response formats

### 2. Product Listing
- ✅ Always use `API_CONFIG.baseUrl` and `API_CONFIG.catalogId`
- ✅ Always use `getApiHeaders()` for request headers
- ✅ Convert `hits` object to array if needed using `Object.values()`

### 3. Category-Based Filtering
- ✅ Pass selected category IDs in `filters.category` array (use "category" key, not "category_ids")
- ✅ The `catalog_ids` parameter is still required (use `API_CONFIG.catalogId`)
- ✅ Multiple category IDs can be passed for products in any of those categories
- ✅ If no category IDs are provided, all products are returned

### 4. Response Handling
- ✅ Always check if response is wrapped in `data` property
- ✅ Handle both object and array formats for `hits`
- ✅ Extract product fields safely with fallbacks (e.g., `product.name || 'Unnamed Product'`)

### 5. Error Handling
- ✅ Always check `response.ok` before parsing JSON
- ✅ Handle network errors and API errors separately
- ✅ Show appropriate loading and error states to users

### 6. Interactive Features
- ✅ Category cards MUST be clickable and trigger product listing API with category filter
- ✅ Product cards MUST be clickable and navigate to product details page
- ✅ Product details page MUST call product details API using product ID
- ✅ Use React Router for navigation OR state-based view switching
- ✅ Always extract correct IDs (category.id, product.id or product.entity_id)

### 7. Product Details API
- ✅ Endpoint: POST /entity/v2/product/detail
- ✅ Request body: { product_id, buyer_tenant_id, catalog_ids }
- ✅ Always use API_CONFIG.buyerId for buyer_tenant_id
- ✅ Always use [API_CONFIG.catalogId] for catalog_ids array
- ✅ Reference source_code/store-front-poc/src/utils/api_requests/productDetails.ts for implementation

---

## Common Patterns

### Pattern 1: Show All Products Initially, Then Filter by Category

```javascript
// Initial state: no category selected
const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

// When category is clicked, add to selection
const handleCategorySelect = (categoryId) => {
  setSelectedCategoryIds([categoryId]);
};

// API call includes category filter only if selected
const requestBody = {
  catalog_ids: [API_CONFIG.catalogId],
  page_number: 1,
  page_size: 20,
  ...(selectedCategoryIds.length > 0 && {
    filters: {
      category: selectedCategoryIds  // Use "category" key, not "category_ids"
    }
  })
};
```

### Pattern 2: Multiple Category Selection

```javascript
// Allow selecting multiple categories
const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

const toggleCategory = (categoryId) => {
  setSelectedCategoryIds(prev => 
    prev.includes(categoryId)
      ? prev.filter(id => id !== categoryId)  // Deselect
      : [...prev, categoryId]                 // Select
  );
};

// Products will show items from ANY of the selected categories
```

### Pattern 3: Category Navigation Flow

```javascript
// User clicks category → Navigate to product listing with category filter
const navigateToCategoryProducts = (categoryId) => {
  // Option 1: Update state to trigger product fetch
  setSelectedCategoryIds([categoryId]);
  
  // Option 2: Navigate to product page with category in URL/state
  // navigate(`/products?category=${categoryId}`);
};
```

---

## Important Reminders

1. **NEVER hardcode** API URLs, tokens, or IDs - always use `API_CONFIG`
2. **ALWAYS use** `getApiHeaders()` for request headers
3. **ALWAYS handle** both array and object response formats
4. **ALWAYS extract** category IDs from the `id` field of category objects
5. **ALWAYS pass** `catalog_ids` parameter in product listing API (even when filtering by category)
6. **ALWAYS validate** API responses before using the data
7. **ALWAYS show** loading and error states to users

---

## Troubleshooting

### Issue: Products not filtering by category
- **Check**: Are category IDs being passed correctly in `filters.category`? (use "category" key, not "category_ids")
- **Check**: Is `catalog_ids` still included in the request body?
- **Check**: Are the category IDs valid (match the IDs from category listing API)?

### Issue: API returns empty products
- **Check**: Is `catalog_ids` parameter correct?
- **Check**: Are headers being sent correctly?
- **Check**: Is the request body properly stringified?

### Issue: Category IDs not available
- **Check**: Is the category listing API response being parsed correctly?
- **Check**: Are you extracting the `id` field from category objects?
- **Check**: Is the response format handled correctly (array vs object)?

---

This documentation should be used as a reference when implementing product and category listing features in the website builder.

