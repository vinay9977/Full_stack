// src/components/Header.jsx
import React from 'react';

const Header = ({ cartCount, toggleTheme, darkMode, setCurrentPage, user, onLogout }) => {
  return (
    <header>
      <h1>Welcome to ShopEase</h1>
      <nav>
        <ul>
          <li><a href="#" onClick={() => setCurrentPage('home')}>Home</a></li>
          <li><a href="#" onClick={() => setCurrentPage('products')}>Products</a></li>
          {user ? (
            <li><a href="#" onClick={onLogout}>Logout</a></li>
          ) : (
            <li><a href="#" onClick={() => setCurrentPage('login')}>Login</a></li>
          )}
        </ul>
      </nav>
      <button id="theme-toggle" onClick={toggleTheme}>
        {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>
      <div id="cart-icon">🛒 <span>{cartCount}</span></div>
      {user && <div className="user-greeting">Welcome, {user.first_name}!</div>}
    </header>
  );
};

export default Header;