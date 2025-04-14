import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getProducts, getProductsByCategory } from '../../services/api';

// Create a mock instance of axios
const mock = new MockAdapter(axios);

// Reset mock adapter after each test
afterEach(() => {
  mock.reset();
});

describe('Products API Tests', () => {
  const baseURL = 'http://localhost:8000';
  
  test('getProducts should fetch all products', async () => {
    // Sample product data
    const mockProducts = [
      {
        id: 1,
        name: 'Laptop',
        price: '999.99',
        category: 1,
        category_name: 'Electronics',
        description: 'Powerful laptop for work and gaming',
        in_stock: true
      },
      {
        id: 2,
        name: 'T-shirt',
        price: '19.99',
        category: 2,
        category_name: 'Clothing',
        description: 'Comfortable cotton t-shirt',
        in_stock: true
      }
    ];
    
    // Mock the GET request
    mock.onGet(`${baseURL}/api/products/`).reply(200, mockProducts);
    
    // Execute the getProducts function
    const response = await getProducts();
    
    // Verify the response
    expect(response.data).toEqual(mockProducts);
    expect(response.data.length).toBe(2);
  });
  
  test('getProductsByCategory should filter products by category', async () => {
    // Sample filtered product data
    const mockFilteredProducts = [
      {
        id: 1,
        name: 'Laptop',
        price: '999.99',
        category: 1,
        category_name: 'Electronics',
        description: 'Powerful laptop for work and gaming',
        in_stock: true
      },
      {
        id: 3,
        name: 'Smartphone',
        price: '699.99',
        category: 1,
        category_name: 'Electronics',
        description: 'Latest smartphone with advanced features',
        in_stock: true
      }
    ];
    
    // Mock the GET request with query parameter
    mock.onGet(`${baseURL}/api/products/?category=Electronics`).reply(200, mockFilteredProducts);
    
    // Execute the getProductsByCategory function
    const response = await getProductsByCategory('Electronics');
    
    // Verify the response
    expect(response.data).toEqual(mockFilteredProducts);
    expect(response.data.length).toBe(2);
    expect(response.data[0].category_name).toBe('Electronics');
    expect(response.data[1].category_name).toBe('Electronics');
  });
});