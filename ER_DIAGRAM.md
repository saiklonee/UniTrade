# ER Diagram — UniTrade

This document describes the core entities, relationships, and key fields used in UniTrade.

---

## 1) Entities & Relationships (High Level)

### Relationships

- **College 1 ── \* Users**
  - A college can have many users.
- **College 1 ── \* Items**
  - A college can have many items/listings.
- **User 1 ── \* Items**
  - A user can post many items.
- **User 1 ── \* Wishlist**
  - A user can wishlist many items (via join table).
- **Item 1 ── \* Wishlist**
  - An item can appear in many users’ wishlists (via join table).

So the wishlist is a **many-to-many** between User and Item.

---

## 2) ER Diagram (Mermaid)

> Paste this into any Mermaid-compatible viewer (GitHub markdown supports Mermaid).

```mermaid
erDiagram
  COLLEGE ||--o{ USER : has
  COLLEGE ||--o{ ITEM : scopes
  USER ||--o{ ITEM : posts
  USER ||--o{ WISHLIST : saves
  ITEM ||--o{ WISHLIST : appears_in

  COLLEGE {
    string _id PK
    string name
    string shortName
    string code
    string logoUrl
    string campusImageUrl
    date createdAt
    date updatedAt
  }

  USER {
    string _id PK
    string username UNIQUE
    string name
    string email UNIQUE
    string mobile UNIQUE
    string passwordHash
    string role "student|faculty|admin"
    string avatarUrl
    string permanentCollege FK
    string currentCollege FK
    boolean isBlocked
    date createdAt
    date updatedAt
  }

  ITEM {
    string _id PK
    string title
    string description
    string category
    string condition
    string listingType "sell|rent"
    number price
    number rentPrice
    string rentUnit "day|week|month"
    number securityDeposit
    string[] imageUrls
    string[] tags
    string status "available|sold"
    boolean isActive
    number viewCount
    string college FK
    string user FK
    date createdAt
    date updatedAt
  }

  WISHLIST {
    string _id PK
    string user FK
    string item FK
    date createdAt
  }
```
