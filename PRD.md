# UniTrade — College-Exclusive Marketplace

Version 1.0
Status: MVP → Scale
( prd.md -> product requirements document )

---

## 1. 📌 Executive Summary

**Product Name:** UniTrade

**Product Type:** College-Exclusive Marketplace

**Platform:** Web (React + Node + MongoDB)

## Vision

To build a **clean, verified, college-only marketplace** where students and faculty can safely buy, sell, and rent items **within their own university ecosystem**.

No random sellers.
No spam.
No cross-campus noise.

Just a trusted campus commerce network.

---

## 2. 🎯 Problem Statement

Students face multiple problems when trading items:

- Unsafe transactions on public marketplaces
- Fake listings / scams
- Irrelevant listings from other cities
- No college-based trust filtering
- No campus-specific marketplace

There is **no structured, secure, verified marketplace exclusively for university communities in India**.

---

## 3. 💡 Solution Overview

UniTrade solves this by:

- Enforcing **college-based isolation**
- Allowing only **verified users**
- Showing listings only from the user's selected college
- Supporting both **sell & rent**
- Adding wishlist, moderation, and admin control

---

## 4. 👥 Target Users

## Primary Users

- Students
- Faculty

## Secondary Users

- College Admins (platform moderators)

---

## 5. 🔐 User Roles

| Role    | Description             |
| ------- | ----------------------- |
| Student | Can buy/sell/rent       |
| Faculty | Can buy/sell/rent       |
| Admin   | Full moderation control |

---

## 6. 🧩 Core Features (MVP)

---

## 6.1 Authentication & User Management

### Features

- Register (student/faculty only)
- Login (JWT cookie-based)
- Update profile
- Change password
- Upload avatar
- Set current college
- Logout
- Check auth on app load

### Admin-only

- View all users
- Block/unblock users
- Delete users
- Update user details

---

## 6.2 College Isolation System (Core Architecture)

Every listing is scoped by:

```
user.currentCollege
```

Users only see:

- Items from their selected college

Strict isolation:

- No cross-college feed
- No global browsing

---

## 6.3 Item Management

### Add Item

- Title
- Description
- Category
- Condition
- Sell or Rent
- Price / Rent price + unit
- Security deposit (rent only)
- Up to 5 images
- Tags
- College auto-attached

### View Items

- Feed (college scoped)
- Browse page
- Item details page

### Manage Items (User)

- View own listings
- Edit listing
- Delete listing
- Toggle active/inactive

---

## 6.4 Wishlist

- Add to wishlist
- Remove from wishlist
- View wishlist
- Heart toggle UI
- Redux normalized state

---

## 6.5 Admin Dashboard

### Admin Overview

- Basic metrics (future scalable)

### User Management

- List users
- Search users
- Block user
- Delete user
- View user info

### Item Management

- View all listings
- Activate / deactivate item
- Delete item
- Filter by:
  - Type
  - Status
  - Search
  - Posted by

---

## 7. 🖥️ Frontend Architecture

## Tech Stack

- React (Vite)
- Redux Toolkit
- Axios
- Tailwind CSS
- React Router v6
- React Icons
- React Hot Toast

## Folder Structure

```
src/
├── api/
├── components/
├── pages/
├── layouts/
├── redux/
│   ├── auth
│   ├── items
│   ├── wishlist
│   └── colleges
```

---

## 8. 🧠 Backend Architecture

### Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- JWT (httpOnly cookies)
- Multer
- Cloudinary

## Core Models

### User

```
{
  username,
  name,
  email,
  mobile,
  password,
  role,
  avatarUrl,
  permanentCollege,
  currentCollege,
  isBlocked
}
```

### Item

```
{
  title,
  description,
  category,
  condition,
  listingType,
  price,
  rentPrice,
  rentUnit,
  securityDeposit,
  imageUrls[],
  college,
  user,
  isActive,
  status,
  viewCount
}
```

### College

```
{
  name,
  shortName,
  code,
  logoUrl
}
```

### Wishlist

```
{
  user,
  item
}
```

---

## 9. 🔐 Security Design

- JWT stored in httpOnly cookie
- `withCredentials: true`
- Role-based route protection
- `requireAdmin` middleware
- Strict college-based filtering
- Max 5 images per listing
- File validation (size + type)

---

## 10. 📊 Functional Requirements

---

## Authentication

- System must prevent unauthorized access
- Blocked users cannot log in
- Admin routes must require admin role

---

## Item System

- Users cannot list without selecting college
- Images must upload to Cloudinary
- Listings must belong to one college
- Users can only edit their own listings

---

## Admin Controls

- Admin can delete any item
- Admin can block any user
- Admin can view all data
- Admin cannot be blocked by another admin (future safeguard)

---

## 11. 🚀 Non-Functional Requirements

| Category        | Requirement              |
| --------------- | ------------------------ |
| Performance     | Page loads < 2 seconds   |
| Security        | No token in localStorage |
| Scalability     | College-based indexing   |
| UX              | Clean minimal UI         |
| Maintainability | Modular folder structure |

---

## 12. 🧱 Database Index Strategy

Recommended:

```
Item:
- college (indexed)
- user (indexed)
- listingType
- isActive

User:
- email (unique)
- username (unique)
- mobile (unique)
```

---

## 13. 📱 UX Principles

- Minimal
- Clean typography
- Glass effects where needed
- No clutter
- Clear hierarchy
- Fast interactions
- Mobile responsive

---

## 14. 🛣️ Future Roadmap (Phase 2+)

- Chat system (buyer ↔ seller)
- Notifications
- Item reporting
- Payment gateway integration
- Analytics dashboard
- College verification system
- Rating system
- Review system
- Image public_id deletion support
- Pagination & infinite scroll
- Search API optimization
- Real-time updates
- Saved filters
- Dark mode toggle
- Mobile app version

---

## 15. 🧪 Edge Cases

- User without college → block listing
- Blocked user trying to act
- Image upload failure
- Double slash API routes
- Wishlist inconsistent shape
- Expired cookie

---

## 16. 🏗️ Deployment Plan

Frontend:

- Vercel

Backend:

- Render / Railway / VPS

Database:

- MongoDB Atlas

Environment Variables:

- JWT_SECRET
- CLOUDINARY credentials
- MONGO_URI
- FRONTEND_URL

---

## 17. 📈 Success Metrics

- Daily Active Users
- Listings per college
- Wishlist engagement rate
- Successful transactions (future)
- Retention after 7 days

---

## 18. ⚠️ Known Risks

- Need strong moderation
- College adoption challenge
- Need critical mass per campus
- Handling disputes (future)

---

## 19. 🏁 MVP Definition

MVP is complete when:

- Users can register/login
- Users can select college
- Users can add items
- Users can view college feed
- Wishlist works
- Admin can moderate users/items
- College isolation is enforced

---

## 20. 🎯 Product Positioning

UniTrade is:

> “The trusted campus marketplace — built exclusively for your university.”
