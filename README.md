Project Name:   Wallet & Deposit Management API

1.Overview

This project is a secure backend API built using:

Node.js
Express.js
MongoDB
JWT Authentication

It implements:

Refresh Token Authentication System
Role-Based Access Control (RBAC)
Wallet & Deposit Management Flow
Secure Business Rule Enforcement

2.Authentication System

Token Lifecycle

Access Token:
Expiry: 15 minutes
Used to access protected routes

Refresh Token:
Expiry: 7 days
Stored securely in database
Used to generate new access tokens

Flow:

User logs in → receives access & refresh tokens

Access token expires after 15 minutes

Client calls /auth/refresh-token with refresh token

Server verifies refresh token and issues new access token

On logout → refresh token is removed from database


3.Role-Based Access Control (RBAC)

Roles:

user
admin

Normal User Can:

View own profile
Update own profile
Create deposit request
View own deposits
View wallet balance

Admin Can:

View all users
Delete any user
View all deposits
Approve deposits
Reject deposits

Middleware Enforcement:

protect → verifies authentication
admin → verifies role

4.Deposit Flow

->Create Deposit

User submits deposit amount
Deposit status = pending
User cannot set approval status manually

->Admin Approval

Only admin can approve
Only pending deposits can be approved
On approval:
    Deposit status → approved
    User wallet balance increases
Double approval prevented

->Admin Rejection

Only pending deposits can be rejected
Wallet balance remains unchanged

5.Wallet System

Endpoint:
GET /api/deposits/wallet

->Returns current user's wallet balance
->Requires authentication
Wallet balance is updated only when:
->Deposit status changes to approved

6.Pagination & Filtering

Supported on deposit endpoints:

Pagination (page, limit)
Filtering by status
Admin filtering by userId
Sorting by createdAt

7.Business Rules Enforced

Deposit status transitions:

pending → approved
pending → rejected
Approved deposits cannot be modified again
Wallet balance integrity maintained
Proper 401 & 403 handling
Consistent API response format

8.API Endpoints

Auth

POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token
POST /api/auth/logout

Users

GET /api/users/me
GET /api/users (admin only)
DELETE /api/users/:id (admin only)

Deposits

POST /api/deposits
GET /api/deposits/my
GET /api/deposits
PATCH /api/deposits/:id/approve
PATCH /api/deposits/:id/reject
GET /api/deposits/wallet