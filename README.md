# 🛒 ButMart - MERN E-Commerce Platform

A full-featured multi-vendor e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). Supports user roles (admin, vendor, customer), cart, authentication, product management, and more.

---

## 🔥 Features

### 👤 Authentication & Authorization
- JWT-based secure login & registration
- Role-based access: `admin`, `vendor`, `user`
- Logout and protected routes

### 🛍️ Products
- Add, update, and delete products (by vendors)
- Admin broadcast and product approvals (optional)
- View products per category
- Search products by name

### 📦 Cart Management
- Add products to cart (with quantity)
- Remove items from cart
- Increase/decrease quantity
- View total price in real-time
- Automatically remove deleted vendor products from user carts

### 🧾 Orders *(Upcoming/Planned)*
- Place order
- Track orders
- Order history (future feature)

### 🏪 Vendor System
- Vendors can:
  - Add products
  - Manage their listings
- Products linked to vendor ID
- Products automatically filtered by vendor

### 📚 Categories
- Create and view categories
- Filter products by selected category

### 👤 User Profile
- View and edit profile information
- Dummy user image placeholder
- Logout functionality

---

## 🧰 Tech Stack

| Layer     | Tech Used                  |
|-----------|----------------------------|
| Frontend  | React, Redux Toolkit, Axios, Tailwind CSS |
| Backend   | Node.js, Express.js, JWT, bcrypt |
| Database  | MongoDB Atlas              |
| Deployment | Vercel (frontend), Render (backend) |

---

## 📁 Folder Structure

📦 root  
┣ 📂 frontend — React Frontend  
┃ ┣ 📂 public — Static assets (favicon, index.html, images)  
┃ ┣ 📂 src  
┃ ┃ ┣ 📂 features — Redux slices (cart, products, auth, vendors)  
┃ ┃ ┣ 📂 pages — Pages like Home, Cart, Profile, ProductDetails, AdminDashboard  
┃ ┃ ┣ 📂 components — Navbar, Footer, ProductCard, VendorCard, Loader, ProtectedRoute  
┃ ┃ ┣ 📂 utils — Helper functions (API calls, formatters)  
┃ ┃ ┣ 📂 styles — CSS / SCSS files  
┃ ┃ ┣ 📜 App.js — Main App component  
┃ ┃ ┣ 📜 index.js — React DOM render entry  
┃ ┗ 📜 package.json — Frontend dependencies & scripts  

┣ 📂 backend — Express.js Backend  
┃ ┣ 📂 routes — Auth, Cart, Product, Vendor, Order, Admin routes  
┃ ┣ 📂 controllers — Logic for each route  
┃ ┣ 📂 models — Mongoose models (User, Product, Cart, Order, Vendor)  
┃ ┣ 📂 middleware — Auth middleware, error handling, validation  
┃ ┣ 📂 config — Database connection, environment configs  
┃ ┣ 📂 utils — JWT handling, email service, payment gateway integration  
┃ ┣ 📜 server.js — Entry point for backend  
┃ ┣ 📜 package.json — Backend dependencies & scripts  

┣ 📂 .env — Environment variables (Mongo URI, JWT secret, API keys)  
┣ 📂 .gitignore — Git ignore rules  
┣ 📂 README.md — Project documentation  

---

## 🌐 Deployment

### 🖥 Backend (Render)
- Hosted on Render
- MongoDB Atlas as remote DB
- Environment Variables:
  - `5000`
  - `mongodb+srv://praveenkumar5500u:KattaP123%23@cluster0.kfbcsgz.mongodb.net/buymart?retryWrites=true&w=majority&appName=Cluster0`
  - `shhhhh`

### 🌍 Frontend (Vercel)
- Hosted on Vercel
- Uses `VITE_API_URL` to call backend

---

## 🚀 Getting Started Locally

### 🔧 Backend

```bash
cd backend
npm install
npm run dev
```

📝 TODO (Optional Features)
 Payment integration (Razorpay/Stripe)

 Admin dashboard

 Order management system

 Wishlist and reviews

🤝 Contributing
Contributions are welcome! Submit a pull request or open an issue to discuss improvements.





