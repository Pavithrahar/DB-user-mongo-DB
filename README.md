# DB-user-mongo-DB

**🔹 Full-featured User Management & Wallet System (Task 1 + Task 2) using Node.js & MongoDB**

This repository contains a user management system built with Node.js and MongoDB, implementing **authentication, user data CRUD, refresh tokens, role-based access control (RBAC), and a wallet/deposit management system**.  

**Task 1:** User Authentication & CRUD APIs  
- Register and login users with JWT authentication.  
- Create, read, update, and delete user-specific data with proper authorization.  

**Task 2:** Advanced Features  
- Refresh token system to renew expired access tokens and secure logout.  
- RBAC to enforce user/admin permissions.  
- Wallet and deposit flow: users submit deposits, admins approve/reject, wallet balances update automatically, with pagination, filtering, and proper business rules enforced.  

---

## Branch Overview

- `main` → contains **all completed tasks** (Task 1 + Task 2)  
- `feature/task-2-backup` → backup of Task 2 before merging into main (safe copy)  

---

## Task 1: User Authentication & Data Management APIs

**Implemented APIs:**

1. **User Authentication**
   - User Registration (`POST /auth/register`)  
   - User Login (`POST /auth/login`)  
   - Password encryption and validation  
   - JWT-based authentication  

2. **User Data Management (CRUD)**
   - Create Data (`POST /data`)  
   - Read Data (list & detail) (`GET /data`)  
   - Update Data (PATCH) (`PATCH /data/:id`)  
   - Delete Data (`DELETE /data/:id`)  
   - Authorization enforced via middleware  

---

## Task 2: Advanced Features

### 1. Refresh Token System
- Access token expiry: 15 minutes  
- Refresh token expiry: 7 days  
- Endpoints:  
  - `POST /auth/refresh-token`  
  - `POST /auth/logout`  
- Flow:
  1. User logs in → receives access & refresh tokens  
  2. Access token expires → client calls `/auth/refresh-token`  
  3. Server verifies refresh token → issues new access token  
  4. Logout → refresh token removed from database  
- Handles expired, invalid, or mismatched tokens  

### 2. Role-Based Access Control (RBAC)
- Roles: `user`, `admin`  
- Normal User Can:
  - View own profile  
  - Update own profile  
  - Create deposit request  
  - View own deposits  
  - Check wallet balance  
- Admin Can:
  - View all users  
  - Delete any user  
  - View all deposits  
  - Approve/reject deposits  
- Middleware Enforcement:
  - `protect` → verifies authentication  
  - `admin` → verifies role  

### 3. Wallet & Deposit Management
**Users:**  
- Create deposit request (pending state)  
- View own deposits with pagination/filtering  
- Check wallet balance  

**Admins:**  
- View all deposits with filters (pagination, status, user, date, amount)  
- Approve pending deposits → wallet balance updates automatically  
- Reject pending deposits → wallet balance unchanged  
- Only pending deposits can be approved/rejected  

**Business Rules:**  
- Deposit status transitions:
  - pending → approved  
  - pending → rejected  
  - Approved deposits cannot be modified again  
- Wallet balance integrity maintained  
- Proper authorization and error handling (401, 403)  
- Consistent API response format  

---

## API Endpoints

**Auth**  
- `POST /api/auth/register`  
- `POST /api/auth/login`  
- `POST /api/auth/refresh-token`  
- `POST /api/auth/logout`  

**Users**  
- `GET /api/users/me`  
- `GET /api/users` (admin only)  
- `DELETE /api/users/:id` (admin only)  

**Deposits / Wallet**  
- `POST /api/deposits`  
- `GET /api/deposits/my`  
- `GET /api/deposits`  
- `PATCH /api/deposits/:id/approve`  
- `PATCH /api/deposits/:id/reject`  
- `GET /api/deposits/wallet`  

---

## Repository Structure
DB-user-mongo-DB
│
├── controllers/ # API controllers
├── models/ # MongoDB models
├── routes/ # API routes
├── middleware/ # Authorization middleware
├── config/ # DB config
├── package.json
├── package-lock.json
├── server.js
├── .gitignore
└── README.md


---

## Notes

- `main` branch contains **all tasks** for easy review  
- `feature/task-2-backup` is a safe backup branch for Task 2  
- `node_modules` are ignored via `.gitignore`  
- All APIs are tested using Postman (collection available)  

---

## Setup

```bash
git clone https://github.com/Pavithrahar/DB-user-mongo-DB.git
cd DB-user-mongo-DB
npm install
npm run dev

Deliverables

Working APIs for Task 1 + Task 2

Proper authorization and role-based access

Pagination, filtering, and error handling implemented

Clean and consistent code structure