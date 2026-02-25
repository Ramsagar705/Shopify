## Shopify MERN E-Commerce

A production-ready **MERN e-commerce** stack with:

- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Razorpay
- **Frontend**: React, Vite, Tailwind CSS, React Router, Context API

### Project Structure

- `server` – Express API (`/controllers`, `/models`, `/routes`, `/middleware`, `/utils`)
- `client` – React + Vite SPA (`/components`, `/pages`, `/context`, `/api`)

### Environment Variables (server)

Create a `.env` file inside `server` with:

- **Core**
  - `PORT=5000`
  - `MONGO_URI=mongodb://127.0.0.1:27017/shopify`
  - `JWT_SECRET=your_jwt_secret_here`
  - `JWT_EXPIRES_IN=7d`
  - `CLIENT_URL=http://localhost:5173`
- **Cloudinary (for image hosting from frontend or backend)**
  - `CLOUDINARY_CLOUD_NAME=your_cloud_name`
  - `CLOUDINARY_API_KEY=your_api_key`
  - `CLOUDINARY_API_SECRET=your_api_secret`
- **Razorpay**
  - `RAZORPAY_KEY_ID=your_razorpay_key_id`
  - `RAZORPAY_KEY_SECRET=your_razorpay_key_secret`
- **Stripe (optional, not wired by default)**
  - `STRIPE_SECRET_KEY=your_stripe_secret_key_optional`
  - `STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_optional`

### Environment Variables (client)

Create `client/.env` (or `.env.local`) with:

- `VITE_API_URL=http://localhost:5000/api`

### Install & Run Locally

- **Backend**
  - `cd server`
  - `npm install`
  - `npm run dev` (or `npm start` for production mode)
- **Create an admin user (for admin pages)**
  - `cd server`
  - Optionally set env: `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
  - Run: `npm run seed:admin`
- **Frontend**
  - `cd client`
  - `npm install`
  - `npm run dev`

Visit `http://localhost:5173`.

### Core API Overview

Base URL: `/api`

- **Auth**
  - `POST /auth/register` – Register user (`name`, `email`, `password`)
  - `POST /auth/login` – Login, returns JWT
  - `GET /auth/profile` – Get current user (requires `Authorization: Bearer <token>`)
- **Products**
  - `GET /products` – List products (query: `keyword`, `category`, `minPrice`, `maxPrice`, `sortBy`, `sortOrder`)
  - `GET /products/:id` – Get product detail
  - `POST /products` – Create product (**admin**)
  - `PUT /products/:id` – Update product (**admin**)
  - `DELETE /products/:id` – Delete product (**admin**)
  - `POST /products/:productId/reviews` – Create/update review (**verified buyer only**)
- **Categories**
  - `GET /categories` – List categories
  - `POST /categories` – Create category (**admin**)
  - `PUT /categories/:id` – Update category (**admin**)
  - `DELETE /categories/:id` – Delete category (**admin**)
- **Cart** (tied to logged-in user)
  - `GET /cart` – Get cart
  - `POST /cart` – Add item (`productId`, `quantity`)
  - `PUT /cart` – Update item quantity
  - `DELETE /cart/item/:productId` – Remove item
  - `DELETE /cart` – Clear cart
- **Payments (Razorpay)**
  - `POST /payments/razorpay/order` – Create Razorpay order from current cart
  - `POST /payments/razorpay/verify` – Verify payment signature
  - `POST /payments/razorpay/webhook` – Basic webhook handler (log only)
- **Orders**
  - `POST /orders` – Create paid order after successful payment
  - `GET /orders/mine` – User order history
  - `GET /orders/:id` – Order detail (owner or admin)
  - `GET /orders` – All orders (**admin**)
  - `PUT /orders/:id/status` – Update status (**admin**)
- **Admin**
  - `GET /admin/dashboard` – Dashboard stats (users, orders, revenue, top products, monthly revenue, recent orders)
  - `GET /admin/users` – List users
  - `PUT /admin/users/:id/role` – Set user role

### Razorpay Test Setup (Sandbox)

- Create a Razorpay test account and get:
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`
- Put them in `server/.env`.
- If Razorpay keys are missing, the backend will still start, but payment endpoints will return a configuration error until keys are set.
- Frontend checkout (`/checkout`) will:
  - Call `POST /payments/razorpay/order` to get `orderId`, `amount`, and `keyId`.
  - Open Razorpay Checkout with these values.
  - On success, call `POST /payments/razorpay/verify` and then `POST /orders` to persist the order.

Use Razorpay sandbox test cards from their docs.

### Image Upload with Cloudinary

- Simplest approach: use **unsigned uploads from the frontend**:
  - Configure an unsigned upload preset in Cloudinary.
  - Use Cloudinary upload widget or direct REST upload from the admin product form to get image URLs.
  - Paste resulting URLs into the product form (`images` comma-separated field) in the admin Products page.
- Alternatively, you can add a small backend wrapper using the `cloudinary` SDK that accepts a base64 image and returns a hosted URL.

### Security & Best Practices Implemented

- JWT-based auth with bcrypt password hashing and role-based access (`user`, `admin`).
- Auth and admin middlewares, centralized error handling.
- Basic Joi validation on auth and product inputs.
- CORS restricted to `CLIENT_URL`, Helmet for common security headers.
- MongoDB aggregation for admin dashboard analytics (revenue, top products, monthly revenue).

