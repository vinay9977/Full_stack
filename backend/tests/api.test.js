const request = require('supertest');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const API_URL = 'http://localhost:8000';
let accessToken;
let refreshToken;

// Helper function to start the Django server
async function startServer() {
  try {
    // Start Django server in the background
    await execAsync('python manage.py runserver --noreload &');
    console.log('Django server started');
    
    // Wait for server to fully start
    await new Promise(resolve => setTimeout(resolve, 3000));
  } catch (error) {
    console.error('Failed to start Django server:', error);
    throw error;
  }
}

// Helper function to stop the Django server
async function stopServer() {
  try {
    // Find and kill the Django server process
    await execAsync("pkill -f 'python manage.py runserver'");
    console.log('Django server stopped');
  } catch (error) {
    console.error('Failed to stop Django server:', error);
  }
}

// Setup before all tests
beforeAll(async () => {
  await startServer();
});

// Clean up after all tests
afterAll(async () => {
  await stopServer();
});

// Test user authentication
describe('User Authentication API', () => {
  const testUser = {
    username: `testuser_${Date.now()}`,
    email: `testuser_${Date.now()}@example.com`,
    password: 'SecurePassword123!',
    password2: 'SecurePassword123!',
    first_name: 'Test',
    last_name: 'User'
  };
  
  // Test user registration
  test('should register a new user', async () => {
    const response = await request(API_URL)
      .post('/auth/register/')
      .send(testUser);
      
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('username', testUser.username);
    expect(response.body).toHaveProperty('email', testUser.email);
    expect(response.body).toHaveProperty('first_name', testUser.first_name);
    expect(response.body).toHaveProperty('last_name', testUser.last_name);
    expect(response.body).not.toHaveProperty('password'); // Password should not be returned
  });
  
  // Test user login
  test('should login and return access token', async () => {
    const response = await request(API_URL)
      .post('/auth/token/')
      .send({
        username: testUser.username,
        password: testUser.password
      });
      
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('access');
    expect(response.body).toHaveProperty('refresh');
    
    // Save tokens for later tests
    accessToken = response.body.access;
    refreshToken = response.body.refresh;
  });
  
  // Test profile access with token
  test('should access user profile with token', async () => {
    const response = await request(API_URL)
      .get('/auth/profile/')
      .set('Authorization', `Bearer ${accessToken}`);
      
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('username', testUser.username);
    expect(response.body).toHaveProperty('email', testUser.email);
  });
  
  // Test token refresh
  test('should refresh access token', async () => {
    const response = await request(API_URL)
      .post('/auth/token/refresh/')
      .send({ refresh: refreshToken });
      
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('access');
    
    // Update access token
    accessToken = response.body.access;
  });
  
  // Test profile access denied without token
  test('should deny profile access without token', async () => {
    const response = await request(API_URL)
      .get('/auth/profile/');
      
    expect(response.statusCode).toBe(401);
  });
});

// Test product API
describe('Products API', () => {
  // Test get all products (public access)
  test('should retrieve all products without authentication', async () => {
    const response = await request(API_URL)
      .get('/api/products/');
      
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
  
  // Test filtering products by category
  test('should filter products by category', async () => {
    // Assuming there are products with category "Electronics"
    const response = await request(API_URL)
      .get('/api/products/?category=Electronics');
      
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    // If there are products, verify they all belong to Electronics category
    if (response.body.length > 0) {
      response.body.forEach(product => {
        expect(product.category_name).toBe('Electronics');
      });
    }
  });
  
  // Test product creation (admin only)
  test('should deny product creation without admin rights', async () => {
    const newProduct = {
      name: 'Test Product',
      price: '99.99',
      category: 1,  // Assuming category ID 1 exists
      description: 'A test product'
    };
    
    const response = await request(API_URL)
      .post('/api/products/')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newProduct);
      
    // Should be denied as regular user doesn't have admin rights
    expect(response.statusCode).toBe(403);
  });
});

// Test cart API
describe('Cart API', () => {
  let cartId;
  let productId = 1;  // Assuming product ID 1 exists
  
  // Test cart creation for authenticated user
  test('should get or create cart for authenticated user', async () => {
    const response = await request(API_URL)
      .get('/api/cart/')
      .set('Authorization', `Bearer ${accessToken}`);
      
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('items');
    
    cartId = response.body.id;
  });
  
  // Test adding item to cart
  test('should add item to cart', async () => {
    const response = await request(API_URL)
      .post(`/api/cart/${cartId}/add_item/`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        product_id: productId,
        quantity: 2
      });
      
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('items');
    expect(response.body.items.length).toBeGreaterThan(0);
    
    // Find the added item
    const addedItem = response.body.items.find(item => item.product.id === productId);
    expect(addedItem).toBeDefined();
    expect(addedItem.quantity).toBe(2);
  });
  
  // Test removing item from cart
  test('should remove item from cart', async () => {
    // First, get cart to find item ID
    const getCartResponse = await request(API_URL)
      .get('/api/cart/')
      .set('Authorization', `Bearer ${accessToken}`);
      
    expect(getCartResponse.statusCode).toBe(200);
    
    // Find the item to remove
    const itemToRemove = getCartResponse.body.items.find(item => item.product.id === productId);
    expect(itemToRemove).toBeDefined();
    
    // Remove the item
    const removeResponse = await request(API_URL)
      .post(`/api/cart/${cartId}/remove_item/`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        item_id: itemToRemove.id
      });
      
    expect(removeResponse.statusCode).toBe(200);
    
    // Verify item was removed
    const updatedCart = removeResponse.body;
    const removedItem = updatedCart.items.find(item => item.id === itemToRemove.id);
    expect(removedItem).toBeUndefined();
  });
  
  // Test cart access denied for unauthenticated user
  test('should deny cart access for unauthenticated user', async () => {
    const response = await request(API_URL)
      .get('/api/cart/');
      
    expect(response.statusCode).toBe(401);
  });
});

// Test contact message API
describe('Contact Message API', () => {
  // Test contact form submission (public access)
  test('should submit contact form without authentication', async () => {
    const contactMessage = {
      name: 'Test Contact',
      email: 'testcontact@example.com',
      message: 'This is a test message from automated testing.'
    };
    
    const response = await request(API_URL)
      .post('/api/contact/')
      .send(contactMessage);
      
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', contactMessage.name);
    expect(response.body).toHaveProperty('email', contactMessage.email);
    expect(response.body).toHaveProperty('message', contactMessage.message);
  });
  
  // Test contact message listing (admin only)
  test('should deny contact message listing without admin rights', async () => {
    const response = await request(API_URL)
      .get('/api/contact/')
      .set('Authorization', `Bearer ${accessToken}`);
      
    // Should be denied as regular user doesn't have admin rights
    expect(response.statusCode).toBe(403);
  });
});