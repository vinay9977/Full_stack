// src/components/ProductsPage.jsx
import React, { useState, useEffect } from 'react';
import { getProducts, submitContactForm } from '../services/api';

const ProductsPage = ({ cart, addToCart }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formMessage, setFormMessage] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch products from API
    getProducts()
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;
    
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
      setFormMessage({ type: 'error', text: 'Please fix the form errors' });
      return;
    }

    // Submit contact form to API
    submitContactForm(formData)
      .then(() => {
        setFormMessage({ type: 'success', text: 'Thanks for your message!' });
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setFormMessage(null), 5000);
      })
      .catch(err => {
        console.error('Error submitting form:', err);
        setFormMessage({ type: 'error', text: 'Failed to submit. Please try again.' });
      });
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <main>
      <section>
        <h2>Product List</h2>
        <table border="1">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} draggable onDragStart={(e) => e.dataTransfer.setData('product', JSON.stringify(product))}>
                <td>{product.name}</td>
                <td>${parseFloat(product.price).toFixed(2)}</td>
                <td>{product.category_name}</td>
                <td><button onClick={() => addToCart(product)}>Add to Cart</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h2>Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input 
            type="text" 
            id="name" 
            value={formData.name} 
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required 
          />
          <br/><br/>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required 
          />
          <br/><br/>
          <label htmlFor="message">Message:</label>
          <textarea 
            id="message" 
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            rows="5" 
            required 
          />
          <br/><br/>
          <button type="submit">Submit</button>
          {formMessage && (
            <div className={`form-message ${formMessage.type}`}>
              {formMessage.text}
            </div>
          )}
        </form>
      </section>
    </main>
  );
};

export default ProductsPage;