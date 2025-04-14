import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getCart, addToCart, removeFromCart } from '../../services/api';

// Create a mock instance of axios
const mock = new MockAdapter(axios);

// Reset mock adapter after each test
afterEach(() => {
  mock.reset();
});

describe('Cart API Tests', () => {
  const baseURL = 'http://localhost:8000';
  
  beforeEach(() => {
    // Set up local storage with access token for authenticated requests
    localStorage.setItem('access_token', 'mock-access-token');
  });
  
  afterEach(() => {
    // Clean up after each test
    localStorage.removeItem('access_token');
  });
  
  test('getCart should fetch the user cart with items', async () => {
    // Sample cart data
    const mockCart = {
      id: 1,
      items: [
        {
          id: 1,
          product: {
            id: 1,
            name: 'Laptop',
            price: '999.99',
            category_name: 'Electronics'
          },
          quantity: 1
        },
        {
          id: 2,
          product: {
            id: 2,
            name: 'T-shirt',
            price: '19.99',
            category_name: 'Clothing'
          },
          quantity: 2
        }
      ],
      total: 1039.97,
      created_at: '2025-04-01T12:00:00Z',
      updated_at: '2025-04-01T12:30:00Z'
    };
    
    // Mock the GET request with authentication header
    mock.onGet(`${baseURL}/api/cart/`).reply(config => {
      // Verify the request has the proper Authorization header
      if (config.headers && config.headers.Authorization === 'Bearer mock-access-token') {
        return [200, mockCart];
      }
      return [401, { detail: 'Authentication credentials were not provided.' }];
    });
    
    // Execute the getCart function
    const response = await getCart();
    
    // Verify the response
    expect(response.data).toEqual(mockCart);
    expect(response.data.items.length).toBe(2);
    expect(response.data.total).toBe(1039.97);
  });
  
  test('addToCart should add a product to the cart', async () => {
    // Product ID to add to cart
    const productId = 3;
    const quantity = 1;
    
    // Expected response after adding to cart
    const mockUpdatedCart = {
      id: 1,
      items: [
        {
          id: 1,
          product: {
            id: 1,
            name: 'Laptop',
            price: '999.99',
            category_name: 'Electronics'
          },
          quantity: 1
        },
        {
          id: 2,
          product: {
            id: 2,
            name: 'T-shirt',
            price: '19.99',
            category_name: 'Clothing'
          },
          quantity: 2
        },
        {
          id: 3,
          product: {
            id: 3,
            name: 'Smartphone',
            price: '699.99',
            category_name: 'Electronics'
          },
          quantity: 1
        }
      ],
      total: 1739.96,
      created_at: '2025-04-01T12:00:00Z',
      updated_at: '2025-04-01T13:00:00Z'
    };
    
    // Mock the POST request with authentication header
    mock.onPost(`${baseURL}/api/cart/1/add_item/`).reply(config => {
      // Parse the request body
      const data = JSON.parse(config.data);
      
      // Verify request data and headers
      if (
        config.headers &&
        config.headers.Authorization === 'Bearer mock-access-token' &&
        data.product_id === productId &&
        data.quantity === quantity
      ) {
        return [200, mockUpdatedCart];
      }
      return [400, { error: 'Invalid request' }];
    });
    
    // Execute the addToCart function
    const response = await addToCart(productId, quantity);
    
    // Verify the response
    expect(response.data).toEqual(mockUpdatedCart);
    expect(response.data.items.length).toBe(3);
    expect(response.data.items[2].product.id).toBe(productId);
    expect(response.data.items[2].quantity).toBe(quantity);
  });
});