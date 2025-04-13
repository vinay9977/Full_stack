# ShopEase Backend Features

## 1. Serve Files to the Client
- Django serves static files for the frontend application
- API endpoints provide dynamic content like product data

## 2. Create and Use Django ORM Models
- Implemented models for Categories, Products, Cart, CartItems, and ContactMessages
- Models include relationships (ForeignKey, OneToOneField) between entities
- Django admin interface set up for managing database entries

## 3. Authenticate a Request to Login and Maintain a Persistent User Session
- JWT-based authentication system implemented for secure login
- Token refresh mechanism for maintaining persistent sessions
- User registration and profile management functionality

## 4. Authorize Users to Do Certain Actions Using Model Permissions
- Role-based authorization with different permissions for:
  - Anonymous users (view products only)
  - Authenticated users 
  - Admin users 
- Custom permission classes for API viewsets