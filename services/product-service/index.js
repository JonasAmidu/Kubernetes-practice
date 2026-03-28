const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// In-memory product store (use database in production)
const products = [];

// Sample data
products.push(
  { id: uuidv4(), name: 'Laptop', description: 'High-performance laptop', price: 999.99, stock: 10, category: 'Electronics', createdAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Smartphone', description: 'Latest smartphone', price: 699.99, stock: 25, category: 'Electronics', createdAt: new Date().toISOString() },
  { id: uuidv4(), name: 'Headphones', description: 'Noise-canceling headphones', price: 199.99, stock: 50, category: 'Electronics', createdAt: new Date().toISOString() }
);

// Validation middleware
const validateProduct = (req, res, next) => {
  const { name, price } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
  }
  
  if (price === undefined || typeof price !== 'number' || price < 0) {
    return res.status(400).json({ error: 'Price is required and must be a non-negative number' });
  }
  
  next();
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    service: 'product-service',
    timestamp: new Date().toISOString(),
    products: products.length
  });
});

// Create product
app.post('/', validateProduct, (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    
    const newProduct = {
      id: uuidv4(),
      name: name.trim(),
      description: description || '',
      price: parseFloat(price),
      stock: stock !== undefined ? parseInt(stock, 10) : 0,
      category: category || 'Uncategorized',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    
    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Get all products with filtering and pagination
app.get('/', (req, res) => {
  try {
    const { 
      category, 
      minPrice, 
      maxPrice, 
      search,
      page = 1, 
      limit = 10 
    } = req.query;
    
    let result = [...products];
    
    // Filter by category
    if (category) {
      result = result.filter(p => 
        p.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by price range
    if (minPrice !== undefined) {
      result = result.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice !== undefined) {
      result = result.filter(p => p.price <= parseFloat(maxPrice));
    }
    
    // Search by name or description
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedResults = result.slice(startIndex, endIndex);
    
    res.json({
      products: paginatedResults,
      pagination: {
        total: result.length,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(result.length / limitNum)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// Get product by ID
app.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json(product);
});

// Update product
app.put('/:id', (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const { name, description, price, stock, category } = req.body;
    
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: 'Name must be a non-empty string' });
      }
      products[productIndex].name = name.trim();
    }
    
    if (price !== undefined) {
      if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ error: 'Price must be a non-negative number' });
      }
      products[productIndex].price = parseFloat(price);
    }
    
    if (description !== undefined) {
      products[productIndex].description = description;
    }
    
    if (stock !== undefined) {
      products[productIndex].stock = parseInt(stock, 10);
    }
    
    if (category !== undefined) {
      products[productIndex].category = category;
    }
    
    products[productIndex].updatedAt = new Date().toISOString();
    
    res.json({
      message: 'Product updated successfully',
      product: products[productIndex]
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
app.delete('/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === req.params.id);
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const deletedProduct = products.splice(productIndex, 1)[0];
  
  res.json({
    message: 'Product deleted successfully',
    product: deletedProduct
  });
});

// Get product categories
app.get('/meta/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json({ categories });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Graceful shutdown
const server = app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Product service closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Product service closed');
    process.exit(0);
  });
});
