---

## `TECHSTACK.md`

```md
# Tech Stack — UniTrade

This document defines the official technology stack for UniTrade, including libraries, tools, conventions, and environment configuration.

---

## 1) Overview

**UniTrade** is a **college-exclusive marketplace** built with the MERN stack:

- **MongoDB** (database)
- **Express.js** (backend framework)
- **React (Vite)** (frontend)
- **Node.js** (runtime)

Primary goals:

- Secure auth (cookie-based JWT)
- College-based data isolation
- Fast listing + image uploads
- Admin moderation features

---

## 2) Frontend Stack

### Core

- **React (Vite)**
- **React Router v6**
- **Redux Toolkit**
- **Axios**
- **Tailwind CSS**

### UI / UX

- **React Hot Toast** (notifications)
- **Lucide-react** (icons) + **react-icons** (dashboard/nav icons)
- Optional animations:
  - **Framer Motion** / **GSAP** (used where needed)

### Patterns

- `http` axios instance with:
  - `baseURL`
  - `withCredentials: true`
- Redux slices using `createAsyncThunk`
- Tailwind utility-first styling
- Reusable UI components (inputs, cards, layouts)

---

## 3) Backend Stack

### Core

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**

### Auth & Security

- **JWT** stored in **httpOnly cookies**
- Middleware:
  - `authUser` (protect routes)
  - `requireAdmin` (admin-only routes)

### Files & Media

- **Multer**
- **Cloudinary**
  - Store only `secure_url`
  - (optional future) store `public_id` for deletion

### API Style

- REST endpoints
- Standard response recommended:

```json
{ "success": true, "message": "optional", "data": {} }
```
