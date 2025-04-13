// App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import ProductsPage from './components/ProductsPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Footer from './components/Footer';
import { getUserProfile, getCart, addToCart as addToCartApi } from './services/api';
import './styles.css';

function App() {
  const [cart, setCart] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      getUserProfile()
        .then(response => {
          setUser(response.data);
          // Fetch user's cart from backend
          return getCart();
        })
        .then(response => {
          if (response?.data?.items) {
            // Convert backend cart format to frontend format
            const backendCart = response.data.items.map(item => ({
              name: item.product.name,
              price: item.product.price,
              category: item.product.category_name,
              quantity: item.quantity,
              id: item.product.id
            }));
            setCart(backendCart);
          }
        })
        .catch(err => {
          console.error('Error fetching user data:', err);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // If no token, load cart from localStorage
      const savedCart = JSON.parse(localStorage.getItem('shopease-cart')) || [];
      setCart(savedCart);
      setIsLoading(false);
    }
  }, []);

  // Update localStorage when cart changes (for non-logged in users)
  useEffect(() => {
    if (!user) {
      localStorage.setItem('shopease-cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (product) => {
    if (user) {
      // If user is logged in, add to cart via API
      addToCartApi(product.id, 1)
        .then(response => {
          // Update local cart state based on server response
          if (response?.data?.items) {
            const backendCart = response.data.items.map(item => ({
              name: item.product.name,
              price: item.product.price,
              category: item.product.category_name,
              quantity: item.quantity,
              id: item.product.id
            }));
            setCart(backendCart);
          }
        })
        .catch(err => console.error('Error adding to cart:', err));
    } else {
      // If not logged in, update local cart
      const existingProduct = cart.find(item => item.name === product.name);
      if (existingProduct) {
        setCart(cart.map(item => 
          item.name === product.name 
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        ));
      } else {
        setCart([...cart, { ...product, quantity: 1 }]);
      }
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    // Fetch user's cart after login
    getCart()
      .then(response => {
        if (response?.data?.items) {
          const backendCart = response.data.items.map(item => ({
            name: item.product.name,
            price: item.product.price,
            category: item.product.category_name,
            quantity: item.quantity,
            id: item.product.id
          }));
          setCart(backendCart);
        }
      })
      .catch(err => console.error('Error fetching cart:', err));
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setCart([]);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductsPage cart={cart} addToCart={addToCart} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} setCurrentPage={setCurrentPage} />;
      case 'register':
        return <RegisterPage setCurrentPage={setCurrentPage} />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <Header 
        cartCount={cart.reduce((total, item) => total + (item.quantity || 1), 0)}
        toggleTheme={toggleTheme}
        darkMode={darkMode}
        setCurrentPage={setCurrentPage}
        user={user}
        onLogout={handleLogout}
      />
      {renderPage()}
      <Footer />
    </div>
  );
}

export default App;