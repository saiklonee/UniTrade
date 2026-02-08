# UniTrade Server API Documentation

This document provides a comprehensive list of available API endpoints for the UniTrade server.

**Base URL**: `http://localhost:4000` (or your deployed URL)

## Authentication & User (`/api/user`)

### 1. Register User
Create a new user account.
- **Method**: `POST`
- **Endpoint**: `/api/user/register`
- **Content-Type**: `multipart/form-data`
- **Body Parameters**:
    - `username` (required): Unique username.
    - `name` (required): Full name.
    - `email` (required): Valid email address.
    -   `password` (required): Min 6 characters.
    -   `mobile` (required): Mobile number.
    -   `role` (optional): Default is "student".
    -   `permanentCollege` (required): ID of the college.
    -   `avatar` (optional): Image file.

### 2. Login
Authenticate a user and receive a cookie token.
- **Method**: `POST`
- **Endpoint**: `/api/user/login`
- **Content-Type**: `application/json`
- **Body Parameters**:
    -   `email` (required)
    -   `password` (required)

### 3. Check Auth Status
Get current authenticated user details.
- **Method**: `GET`
- **Endpoint**: `/api/user/is-auth`
- **Headers**: Cookie `token` required.

### 4. Logout
Clear authentication cookie.
- **Method**: `POST`
- **Endpoint**: `/api/user/logout`

### 5. Update Profile
Update current user's profile details.
- **Method**: `PATCH`
- **Endpoint**: `/api/user/me`
- **Content-Type**: `multipart/form-data`
- **Body Parameters**:
    -   `name` (optional)
    -   `mobile` (optional)
    -   `currentCollege` (optional)
    -   `avatar` (optional): Image file.

### 6. Change Password
- **Method**: `PATCH`
- **Endpoint**: `/api/user/me/password`
- **Content-Type**: `application/json`
- **Body Parameters**:
    -   `oldPassword` (required)
    -   `newPassword` (required, min 6 chars)

### 7. Admin Routes
Requires `role: "admin"`.
- **Get All Users**: `GET /api/user` (Query: `page`, `limit`, `q`, `role`, `currentCollege`, `isBlocked`)
- **Get User by ID**: `GET /api/user/:id`
- **Block/Unblock User**: `PATCH /api/user/:id/block` (Body: `{ "blocked": true/false }`)
- **Update User (Admin)**: `PATCH /api/user/:id` (Multipart, similar fields to register)
- **Delete User**: `DELETE /api/user/:id`

---

## College (`/api/college`)

### 1. Add College
- **Method**: `POST`
- **Endpoint**: `/api/college/add`
- **Content-Type**: `multipart/form-data`
- **Body Parameters**:
    -   `code` (required): Unique college code (e.g., "IITB").
    -   `name` (required)
    -   `slug` (required): Unique URL-friendly slug.
    -   `shortName` (optional)
    -   `city`, `state`, `country` (optional)
    -   `logo` (optional): Image file.
    -   `image` (optional): Image file (campus photo).

### 2. Get All Colleges
- **Method**: `GET`
- **Endpoint**: `/api/college/list`

### 3. Get College by ID
- **Method**: `GET`
- **Endpoint**: `/api/college/get/:id`

### 4. Update College
- **Method**: `PUT`
- **Endpoint**: `/api/college/update/:id`
- **Content-Type**: `multipart/form-data`
- **Body Parameters**: Same as Add College, plus `isActive` (boolean).

### 5. Remove College
- **Method**: `DELETE`
- **Endpoint**: `/api/college/remove/:id`

---

## Items (`/api/item`)

### 1. Add Item
List a new item for sale or rent.
- **Method**: `POST`
- **Endpoint**: `/api/item/add`
- **Content-Type**: `multipart/form-data`
- **Auth**: Required.
- **Body Parameters**:
    -   `title` (required)
    -   `description`
    -   `category` (required)
    -   `condition` (optional): Default "good".
    -   `listingType` (required): "sell" or "rent".
    -   `tags` (optional): Comma-separated string or array.
    -   **If Selling**: `price` (required).
    -   **If Renting**: `rentPrice` (required), `rentUnit` ("day"/"week"/"month"), `securityDeposit` (optional).
    -   `images`: Array of image files (Max 5).

### 2. List Items
Get items with filtering and pagination.
- **Method**: `GET`
- **Endpoint**: `/api/item/list`
- **Query Parameters**:
    -   `page`, `limit`
    -   `q`: Search query (text search in title/desc/tags).
    -   `category`, `condition`, `listingType`
    -   `minPrice`, `maxPrice`
    -   `college`: Filter by college ID.
    -   `status`: Default "available".

### 3. Get Item Details
- **Method**: `GET`
- **Endpoint**: `/api/item/get/:id`

### 4. Get My Items
Get items posted by the logged-in user.
- **Method**: `GET`
- **Endpoint**: `/api/item/my-items`
- **Auth**: Required.
- **Query Parameters**: `status`, `isActive`.

### 5. Update Item
- **Method**: `PUT`
- **Endpoint**: `/api/item/update/:id`
- **Content-Type**: `multipart/form-data`
- **Auth**: Required (Owner or Admin).
- **Body Parameters**: Same as Add Item.
    -   `status`: Update status (e.g., "sold").
    -   `removeImages`: Array of existing image URLs to remove.

### 6. Delete Item
Soft delete item (sets `isActive` to false).
- **Method**: `DELETE`
- **Endpoint**: `/api/item/remove/:id`
- **Auth**: Required.

### 7. Toggle Item Visibility
- **Method**: `PATCH`
- **Endpoint**: `/api/item/toggle-active/:id`
- **Auth**: Required.
- **Body Parameters**:
    -   `isActive` (boolean): true/false.

---

## Wishlist (`/api/wishlist`)

**Note**: All wishlist routes require authentication.

### 1. Get Wishlist
- **Method**: `GET`
- **Endpoint**: `/api/wishlist`

### 2. Add to Wishlist
- **Method**: `POST`
- **Endpoint**: `/api/wishlist/add/:itemId`

### 3. Remove from Wishlist
- **Method**: `DELETE`
- **Endpoint**: `/api/wishlist/remove/:itemId`

### 4. Clear Wishlist
- **Method**: `DELETE`
- **Endpoint**: `/api/wishlist/clear`

### 5. Check Item in Wishlist
- **Method**: `GET`
- **Endpoint**: `/api/wishlist/check/:itemId`
- **Response**: `{ "isInWishlist": true/false }`

### 6. Get Wishlist Count
- **Method**: `GET`
- **Endpoint**: `/api/wishlist/count`
