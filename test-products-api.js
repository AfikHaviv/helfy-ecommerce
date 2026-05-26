const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testProductsAPI() {
  console.log('Testing Products API...\n');
  
  try {
    // Test 1: GET /api/products
    console.log('TEST 1: GET /api/products');
    const productsResponse = await axios.get(`${BASE_URL}/products`);
    console.log('✓ PASSED - Products retrieved successfully');
    console.log(`  Found ${productsResponse.data.data.length} products`);
    console.log(`  Total: ${productsResponse.data.pagination.total}\n`);
  } catch (error) {
    console.log('✗ FAILED - GET /api/products');
    console.log(`  Error: ${error.response?.data?.message || error.message}\n`);
  }

  try {
    // Test 2: GET /api/products/featured
    console.log('TEST 2: GET /api/products/featured');
    const featuredResponse = await axios.get(`${BASE_URL}/products/featured`);
    console.log('✓ PASSED - Featured products retrieved successfully');
    console.log(`  Found ${featuredResponse.data.data.products.length} featured products\n`);
  } catch (error) {
    console.log('✗ FAILED - GET /api/products/featured');
    console.log(`  Error: ${error.response?.data?.message || error.message}\n`);
  }

  try {
    // Test 3: POST /api/auth/login
    console.log('TEST 3: POST /api/auth/login');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@helfy.com',
      password: 'Admin123!'
    });
    console.log('✓ PASSED - Login successful');
    console.log(`  User: ${loginResponse.data.data.user.email}\n`);
  } catch (error) {
    console.log('✗ FAILED - POST /api/auth/login');
    console.log(`  Error: ${error.response?.data?.message || error.message}\n`);
  }

  console.log('Tests completed!');
  process.exit(0);
}

// Wait a bit for server to start
setTimeout(testProductsAPI, 2000);
