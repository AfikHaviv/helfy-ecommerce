const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  const results = {
    passed: [],
    failed: []
  };

  console.log('='.repeat(60));
  console.log('BACKEND API TESTING');
  console.log('='.repeat(60));
  console.log('');

  // Test 1: Get Categories
  try {
    console.log('TEST 1: GET /api/categories');
    const response = await axios.get(`${API_URL}/categories`);
    if (response.data.success && response.data.data.categories.length > 0) {
      console.log('✓ PASSED - Categories retrieved successfully');
      console.log(`  Found ${response.data.data.categories.length} categories`);
      results.passed.push('GET /api/categories');
    } else {
      console.log('✗ FAILED - No categories found');
      results.failed.push('GET /api/categories');
    }
  } catch (error) {
    console.log('✗ FAILED - ' + error.message);
    results.failed.push('GET /api/categories');
  }
  console.log('');

  // Test 2: Get Products
  try {
    console.log('TEST 2: GET /api/products');
    const response = await axios.get(`${API_URL}/products`);
    if (response.data.success) {
      console.log('✓ PASSED - Products endpoint responded');
      console.log(`  Found ${response.data.data.products.length} products`);
      console.log(`  Total: ${response.data.pagination.total}`);
      results.passed.push('GET /api/products');
    } else {
      console.log('✗ FAILED - Products endpoint returned error');
      results.failed.push('GET /api/products');
    }
  } catch (error) {
    console.log('✗ FAILED - ' + error.message);
    if (error.response) {
      console.log('  Error details:', error.response.data.error.message);
    }
    results.failed.push('GET /api/products');
  }
  console.log('');

  // Test 3: Get Featured Products
  try {
    console.log('TEST 3: GET /api/products/featured');
    const response = await axios.get(`${API_URL}/products/featured`);
    if (response.data.success) {
      console.log('✓ PASSED - Featured products retrieved');
      console.log(`  Found ${response.data.data.products.length} featured products`);
      results.passed.push('GET /api/products/featured');
    } else {
      console.log('✗ FAILED - Featured products endpoint error');
      results.failed.push('GET /api/products/featured');
    }
  } catch (error) {
    console.log('✗ FAILED - ' + error.message);
    if (error.response) {
      console.log('  Error details:', error.response.data.error.message);
    }
    results.failed.push('GET /api/products/featured');
  }
  console.log('');

  // Test 4: Login with admin credentials
  try {
    console.log('TEST 4: POST /api/auth/login (Admin)');
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: '[EMAIL]',
      password: 'Admin123!'
    });
    if (response.data.success && response.data.data.token) {
      console.log('✓ PASSED - Admin login successful');
      console.log(`  User: ${response.data.data.user.firstName} ${response.data.data.user.lastName}`);
      console.log(`  Role: ${response.data.data.user.role}`);
      results.passed.push('POST /api/auth/login');
      
      // Save token for authenticated tests
      global.adminToken = response.data.data.token;
    } else {
      console.log('✗ FAILED - Login did not return token');
      results.failed.push('POST /api/auth/login');
    }
  } catch (error) {
    console.log('✗ FAILED - ' + error.message);
    if (error.response) {
      console.log('  Error details:', error.response.data.error.message);
    }
    results.failed.push('POST /api/auth/login');
  }
  console.log('');

  // Test 5: Get User Profile (requires auth)
  if (global.adminToken) {
    try {
      console.log('TEST 5: GET /api/users/profile (Authenticated)');
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${global.adminToken}`
        }
      });
      if (response.data.success) {
        console.log('✓ PASSED - Profile retrieved successfully');
        console.log(`  Email: ${response.data.data.user.email}`);
        results.passed.push('GET /api/users/profile');
      } else {
        console.log('✗ FAILED - Profile endpoint error');
        results.failed.push('GET /api/users/profile');
      }
    } catch (error) {
      console.log('✗ FAILED - ' + error.message);
      if (error.response) {
        console.log('  Error details:', error.response.data.error.message);
      }
      results.failed.push('GET /api/users/profile');
    }
    console.log('');
  }

  // Test 6: Get Cart (unauthenticated)
  try {
    console.log('TEST 6: GET /api/cart (Unauthenticated)');
    const response = await axios.get(`${API_URL}/cart`);
    console.log('✗ FAILED - Should require authentication');
    results.failed.push('GET /api/cart (auth check)');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✓ PASSED - Correctly requires authentication');
      results.passed.push('GET /api/cart (auth check)');
    } else {
      console.log('✗ FAILED - Unexpected error: ' + error.message);
      results.failed.push('GET /api/cart (auth check)');
    }
  }
  console.log('');

  // Test 7: Get Product by ID
  try {
    console.log('TEST 7: GET /api/products/1');
    const response = await axios.get(`${API_URL}/products/1`);
    if (response.data.success && response.data.data.product) {
      console.log('✓ PASSED - Product retrieved by ID');
      console.log(`  Product: ${response.data.data.product.name}`);
      console.log(`  Price: $${response.data.data.product.price}`);
      results.passed.push('GET /api/products/:id');
    } else {
      console.log('✗ FAILED - Product not found');
      results.failed.push('GET /api/products/:id');
    }
  } catch (error) {
    console.log('✗ FAILED - ' + error.message);
    if (error.response) {
      console.log('  Error details:', error.response.data.error.message);
    }
    results.failed.push('GET /api/products/:id');
  }
  console.log('');

  // Test 8: Invalid endpoint
  try {
    console.log('TEST 8: GET /api/invalid-endpoint');
    const response = await axios.get(`${API_URL}/invalid-endpoint`);
    console.log('✗ FAILED - Should return 404');
    results.failed.push('404 handling');
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('✓ PASSED - Correctly returns 404 for invalid endpoint');
      results.passed.push('404 handling');
    } else {
      console.log('✗ FAILED - Unexpected error: ' + error.message);
      results.failed.push('404 handling');
    }
  }
  console.log('');

  // Summary
  console.log('='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${results.passed.length + results.failed.length}`);
  console.log(`Passed: ${results.passed.length}`);
  console.log(`Failed: ${results.failed.length}`);
  console.log('');

  if (results.failed.length > 0) {
    console.log('Failed Tests:');
    results.failed.forEach(test => console.log(`  - ${test}`));
  }

  console.log('');
  console.log('='.repeat(60));
}

testAPI().catch(console.error);
