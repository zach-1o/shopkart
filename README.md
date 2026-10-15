# 🛒 ShopKart — Modern Full-Stack E-Commerce Platform

A production-grade, end-to-end MERN stack e-commerce web application built strictly according to the curriculum guidelines across **Labs 01 to 06**.

---

## 🌟 Overview & Key Features

ShopKart covers the entire shopping journey from user authentication to product discovery, persistent wishlist, cart management, checkout with Razorpay test payment, and historical order management.

### 🔐 1. Customer Authentication (Lab 01 & Lab 02)
- **MVC Architecture**: Clean separation into models, controllers, routes, and middleware.
- **Security First**: Passwords securely hashed with `bcryptjs` and never exposed in API responses.
- **JWT & HttpOnly Cookies**: Tokens stored in secure, `HttpOnly` cookies to protect against XSS attacks.
- **Protected Routes**: Middleware verifies authentication for protected profile, cart, wishlist, and order APIs.
- **Client-Server Auth UI**: Controlled React registration and login forms with error handling and automatic redirection to `/home`.

### 📦 2. Product Catalog & Discovery (Lab 03)
- **MongoDB Data Model**: Products stored with name, description, price, category, image, and stock.
- **Dynamic Search & Filtering**: Case-insensitive partial name search, category dropdown filter, and price sorting.
- **Single Product Details**: Dynamic route `/products/:id` with large visuals, detailed descriptions, and stock status.
- **Resilient UI States**: Dedicated screens for **Loading**, **Empty Results**, and **API Errors**.

### ❤️ 3. Wishlist System (Lab 04)
- **Database Relationships**: Uses Mongoose `ObjectId` references (`ref: "Product"`) rather than duplicating product data.
- **Data Population**: Leverages `populate()` to load fresh product information dynamically.
- **Duplicate Prevention**: Rejects duplicate saves with an HTTP `409 Conflict` status code.
- **Interactive UI**: Micro-state transitions on product cards (`♡ Add to Wishlist` → `⏳ Saving...` → `♥ Added to Wishlist`) and dedicated `/wishlist` view.

### 🛍️ 4. Shopping Cart & State Management (Lab 05)
- **Quantity-Based Model**: Nested cart schema storing product references and quantities.
- **Global Cart State**: Implemented via React Context (`CartContext`) to synchronize Navbar count, product buttons, cart view, and summary in real time.
- **Derived State**: Subtotal (`Σ price * quantity`) and total unit count calculated on the fly without storing stale computed values in the database.
- **Stock Validation**: Prevents adding or incrementing items beyond currently available stock.

### 💳 5. Checkout, Razorpay Payments & Orders (Lab 06)
- **Order Snapshots**: Purchases preserve snapshot values of product name, purchase-time price, quantity, and image so historical records remain accurate if product details change later.
- **Server-Side Revalidation**: The backend recalculates totals and revalidates stock immediately prior to order creation (ignoring any untrusted client calculations).
- **Razorpay Test Mode Integration**: Server-side Razorpay Order creation in paise with key secrecy.
- **Mandatory Signature Verification**: Validates HMAC SHA256 signatures (`razorpay_order_id + "|" + razorpay_payment_id`) using `crypto`.
- **Post-Payment Cart Clearing**: Cart is cleared **only after** signature verification succeeds.
- **Order History & Details**: `/orders` page listing past purchases with order ID, date, status badges, and payment identifiers.

---

## 🛠️ Technology Stack

| Component | Technologies Used |
| :--- | :--- |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, `cookie-parser` |
| **Payments** | Razorpay Node.js SDK (`razorpay`), Node.js built-in `crypto` |
| **Frontend** | React 18, React Router DOM v6, Axios, Vite |
| **Styling** | Vanilla CSS Design System (Custom tokens, glassmorphism, responsive grid) |

---

## 📁 Project Directory Structure

```text
shop_cart/
├── backend/
│   ├── config/
│   │   └── razorpay.js              # Razorpay instance configuration
│   ├── controllers/
│   │   ├── customer.controller.js   # Register, Login, Profile, Logout
│   │   ├── product.controller.js    # Create, List, Filter, Single Product
│   │   ├── wishlist.controller.js   # Add, Get, Remove, Toggle
│   │   ├── cart.controller.js       # Add, Get, Update Quantity, Remove
│   │   └── order.controller.js      # Checkout, Razorpay order, Verify signature, Orders
│   ├── models/
│   │   ├── customer.model.js        # Customer schema (with wishlist & cart)
│   │   ├── product.model.js         # Product schema
│   │   └── order.model.js           # Order snapshot schema
│   ├── routes/
│   │   ├── customer.routes.js
│   │   ├── product.routes.js
│   │   ├── wishlist.routes.js
│   │   ├── cart.routes.js
│   │   └── order.routes.js
│   ├── middlewares/
│   │   └── auth.middleware.js       # JWT cookie & Bearer token verification
│   ├── utils/
│   │   └── generateToken.js         # JWT cookie utility
│   ├── index.js                     # Main server entry & MongoDB connection
│   ├── test-api.js                  # Automated 15-point test script
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Authentication session state
│   │   │   └── CartContext.jsx      # Global cart state & derived totals
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Responsive navigation with dynamic badges
│   │   │   ├── ProductCard.jsx      # Product card with cart & wishlist actions
│   │   │   ├── SearchBar.jsx        # Search, category filter & sorting
│   │   │   ├── WishlistCard.jsx     # Saved product card with move-to-cart
│   │   │   ├── CartItem.jsx         # Cart item with quantity selector
│   │   │   ├── CheckoutForm.jsx     # Shipping address form with validation
│   │   │   ├── OrderSummary.jsx     # Dynamic price breakdown & total
│   │   │   └── OrderCard.jsx        # Order history card
│   │   ├── pages/
│   │   │   ├── Register.jsx         # /register
│   │   │   ├── Login.jsx            # /login
│   │   │   ├── Home.jsx             # /home (Protected customer profile)
│   │   │   ├── Products.jsx         # /products (Catalog discovery)
│   │   │   ├── ProductDetails.jsx   # /products/:id
│   │   │   ├── Wishlist.jsx         # /wishlist
│   │   │   ├── Cart.jsx             # /cart
│   │   │   ├── Checkout.jsx         # /checkout
│   │   │   ├── OrderSuccess.jsx     # /order-success/:id
│   │   │   ├── Orders.jsx           # /orders
│   │   │   └── OrderDetails.jsx     # /orders/:id
│   │   ├── services/
│   │   │   └── api.js               # Centralized Axios client (withCredentials: true)
│   │   ├── App.jsx                  # React Router routes setup
│   │   ├── main.jsx                 # React root render
│   │   └── index.css                # Custom CSS Design System
│   ├── index.html                   # Entry HTML with fonts and Razorpay script
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [MongoDB](https://www.mongodb.com/) (Local instance running at `mongodb://localhost:27017` or MongoDB Atlas URI. *Note: includes automatic in-memory fallback for immediate zero-config development*).

---

### 1. Setup & Run the Backend

```bash
cd backend
npm install
```

Configure your environment file:
```bash
cp .env.example .env
```

Start the backend server:
```bash
node index.js
```
> The server will start on **`http://localhost:5000`** and automatically seed initial sample products if the database is empty.

To run the automated 15-step API verification test suite:
```bash
node test-api.js
```

---

### 2. Setup & Run the Frontend

In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
> The client will start on **`http://localhost:5173`**.

---

## 🔌 API Reference

### Customers (`/customers`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/customers/register` | ❌ | Create new customer account |
| `POST` | `/customers/login` | ❌ | Authenticate and issue HttpOnly cookie |
| `GET` | `/customers/me` | ✅ | Get currently logged-in customer profile |
| `POST` | `/customers/logout` | ✅ | Clear authentication cookie |
| `PATCH` | `/customers/change-password` | ✅ | Update password |

### Products (`/products`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/products` | ❌ | Create product (price & stock validated) |
| `GET` | `/products` | ❌ | List products (supports `search`, `category`, `sort`) |
| `GET` | `/products/:id` | ❌ | Fetch single product by ID |

### Wishlist (`/wishlist`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/wishlist/:productId` | ✅ | Add product (prevents duplicates with 409) |
| `GET` | `/wishlist` | ✅ | Get user's populated wishlist |
| `DELETE`| `/wishlist/:productId` | ✅ | Remove product from wishlist |
| `PATCH` | `/wishlist/:productId/toggle`| ✅ | Toggle saved status |

### Cart (`/cart`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/cart/:productId` | ✅ | Add or increment quantity (validates stock) |
| `GET` | `/cart` | ✅ | Get user's populated cart |
| `PATCH` | `/cart/:productId` | ✅ | Update quantity (`{ quantity }`) |
| `DELETE`| `/cart/:productId` | ✅ | Remove product from cart |

### Orders (`/orders`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/orders/create-payment-order` | ✅ | Validate address/stock, create order & Razorpay order |
| `POST` | `/orders/verify-payment` | ✅ | Verify HMAC SHA256 signature, mark PAID, clear cart |
| `GET` | `/orders` | ✅ | Retrieve authenticated user's order history |
| `GET` | `/orders/:id` | ✅ | Fetch single order with ownership enforcement |
| `PATCH` | `/orders/:id/status` | ✅ | Update order status progression |

---

## 🛡️ Security Features
- **No Passwords in Responses**: Customer password hashes are excluded from all query projections.
- **Server-Side Pricing**: Frontend cart prices and totals are never trusted; the backend recalculates totals directly from current database records.
- **Secret Protection**: `RAZORPAY_KEY_SECRET` is kept strictly on the backend and never exposed to the frontend.
- **Cart Protection**: Cart items remain intact if checkout or signature verification fails.
