Below is a **clean, concise, developer-handover document** you can directly share with another engineer or keep as internal documentation.

---

# 📦 UniTrade — Developer Handover Document

## 1. Project Overview

**Project Name:** UniTrade
**Goal:**
UniTrade is a **college-exclusive marketplace** where students can buy, sell, rent, and wishlist items **within their own university only**.
The platform enforces college-based isolation so users only see listings from their selected/current college.

---

## 2. Tech Stack

### Frontend

* **React (Vite)**
* **Redux Toolkit** – global state management
* **React Router v6** – routing
* **Axios** – API communication
* **Tailwind CSS** – styling
* **GSAP / Framer Motion** – animations
* **Lenis** – smooth scrolling
* **Lucide Icons**
* **React Hot Toast** – notifications

### Backend

* **Node.js + Express**
* **MongoDB + Mongoose**
* **JWT (cookie-based auth)**
* **Multer** – file uploads
* **Cloudinary** – image storage (URL-only, no public_id stored)

### Environment Variables

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_CURRENCY=Rs.
JWT_SECRET=...
CLOUDINARY_...
```

---

## 3. High-Level Folder Structure

### Frontend (`/src`)

```
src/
├─ api/
│  └─ http.js              # Axios instance (withCredentials)
├─ assets/
├─ components/
│  ├─ Navbar.jsx
│  ├─ ItemCard.jsx
│  ├─ NewArrivals.jsx
│  └─ ...
├─ pages/
│  ├─ Home.jsx
│  ├─ Landing.jsx
│  ├─ Login.jsx
│  ├─ AddItem.jsx
│  ├─ Wishlist.jsx
│  ├─ ProfileLayout.jsx
│  └─ ...
├─ redux/
│  ├─ store.js
│  └─ features/
│     ├─ auth/
│     │  └─ authSlice.js
│     ├─ items/
│     ├─ wishlist/
│     │  └─ wishlistSlice.js
│     └─ colleges/
├─ App.jsx
└─ main.jsx
```

### Backend (`/server`)

```
server/
├─ controllers/
│  ├─ userController.js
│  ├─ collegeController.js
│  ├─ itemController.js
│  └─ wishlistController.js
├─ models/
│  ├─ User.js
│  ├─ College.js
│  ├─ Item.js
│  └─ Wishlist.js
├─ routes/
│  ├─ userRoutes.js
│  ├─ collegeRoutes.js
│  ├─ itemRoutes.js
│  └─ wishlistRoutes.js
├─ middlewares/
│  └─ authUser.js
├─ configs/
│  ├─ multer.js
│  └─ cloudinary.js
└─ app.js
```

---

## 4. Key Features Implemented

### Authentication & User

* Register / Login (JWT in cookies)
* `is-auth` bootstrapping on app load
* Profile update (including current college)
* Admin role support

### Colleges

* Admin-managed colleges
* Logo + campus image stored in Cloudinary
* College selection tied to user profile
* College data used to **scope item feeds**

### Items

* Sell & Rent listings
* Cloudinary image uploads (max 5)
* Soft delete (`isActive`)
* Status (`available`, `sold`)
* View count
* College-scoped listing feed

### Wishlist

* Add / remove wishlist items
* Wishlist fetch via Redux
* Wishlist state normalized in frontend
* Heart toggle on `ItemCard`

### Frontend UX

* Auth-based routing
* Navbar shows **current college logo**
* University-specific feed
* Profile dashboard layout (sidebar + outlet)
* New arrivals (latest 4 items by college)

---

## 5. Important Decisions & Assumptions

* **College isolation is strict**: items are always filtered by `user.currentCollege`
* **Images**: only Cloudinary `secure_url` stored (no `public_id`)
* **Soft delete for items** (never hard delete)
* **Wishlist** refetch approach chosen for consistency over optimistic updates
* **Redux is the single source of truth** (no local duplication)
* Auth is **cookie-based**, not token in localStorage

---

## 6. Pending / TODO Items

* 🔲 Item details page (`/item/:id`)
* 🔲 Wishlist remove/clear buttons
* 🔲 My Items page (manage listings)
* 🔲 Profile → change current college UX
* 🔲 Admin dashboard UI
* 🔲 Pagination / infinite scroll on feed
* 🔲 Image removal from Cloudinary (optional)
* 🔲 Notifications / chat between buyer & seller
* 🔲 Payment integration (UPI / COD / campus meet-up)

---

## 7. Known Bugs / Issues

* ⚠️ Wishlist API response shape varies (`items`, `wishlist`, `{ item }`)
  → handled via normalization but backend should standardize
* ⚠️ Some endpoints return 404 if double slash in URL (`//api/...`)
* ⚠️ NewArrivals fails if `currentCollege` is not populated
* ⚠️ No optimistic UI for wishlist yet
* ⚠️ No error boundary in React tree

---

## 8. Coding Style & Conventions

### Frontend

* Functional components only
* Tailwind utility-first styling
* Redux Toolkit with `createAsyncThunk`
* No inline API calls inside components (use slices)
* Environment variables via `import.meta.env`

### Backend

* REST-style routes
* Controller/service separation
* Mongoose schemas with validation
* Auth middleware required for protected routes
* Consistent JSON response shape:

```js
{ success: boolean, message?: string, data?: any }
```

---

## 9. Handover Notes

* Always run backend with cookies enabled (`withCredentials: true`)
* Ensure Cloudinary + JWT env vars are set
* College must exist before user registration
* User **must set currentCollege** to see feed
* Redux `auth.checkAuth()` must run on app boot

---

If you want, next I can:

* Generate **README.md**
* Draw **architecture diagram**
* Create **API response contracts**
* Or prep a **deployment checklist**
