# Wallet Ledger System Backend

This project implements a **Wallet Ledger System Backend API** using **Node.js, Express.js, and MongoDB**.

The system manages **user wallets, deposits, withdrawals, transaction ledgers, notifications, and admin reporting** while ensuring **data integrity, concurrency control, and security**.

---

# Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Multer (file upload)
- Express Middleware

---

# Project Features

## 1. Transaction Ledger System

A **Wallet Transaction Ledger** is implemented to record every wallet movement.

### Ledger Collection Fields

- Transaction ID
- User ID
- Asset Type
- Transaction Type
  - Deposit
  - Withdrawal
  - Fee
  - GST
  - Adjustment
- Transaction Amount
- Balance Before Transaction
- Balance After Transaction
- Reference ID (Deposit / Withdrawal request ID)
- Status
  - Pending
  - Approved
  - Rejected
- Remarks
- Created Timestamp
- Updated Timestamp

### Ledger Rules

- Every wallet balance change creates a **ledger entry**
- Ledger records are **immutable**
- Ledger supports **audit and reconciliation**

---

# 2. Race Condition & Concurrent Transaction Handling

The system implements **concurrency-safe wallet updates**.

### Mechanisms Used

- Atomic database operations
- MongoDB transactions
- Status validation before processing

### User Concurrency Scenarios Handled

- Multiple withdrawal requests submitted simultaneously
- Concurrent deposit requests
- Balance checks during transactions

### Withdrawal Validation

- Always verifies **latest available balance**
- Prevents withdrawal if balance becomes insufficient
- Prevents **double spending**

### Admin Concurrency Scenarios

- Multiple deposit approvals
- Multiple withdrawal approvals
- Multiple admins processing the same transaction

### Approval Rules

- A transaction can be **processed only once**
- Duplicate approvals are rejected
- Status updates are **atomic**

### System Guarantees

- Wallet balance integrity
- Safe handling of high concurrency
- No duplicate credits or debits

---

# 3. Notification System

Users receive notifications for wallet activities.

### Notification Events

- Deposit request submitted
- Deposit approved
- Deposit rejected
- Withdrawal request submitted
- Withdrawal approved
- Withdrawal rejected

### Notification Collection Fields

- Notification ID
- User ID
- Notification Type
- Message
- Reference Transaction ID
- Read / Unread Status
- Created Timestamp

### Notification APIs

- Get user notifications
- Mark notification as read

---

# 4. Admin Dashboard & Reporting APIs

Admin APIs provide **analytics and reporting**.

### Reporting APIs

- Total deposits (daily / monthly)
- Total withdrawals (daily / monthly)
- Platform fees collected
- GST collected
- Total assets held on platform

### Report Filters

- Date range
- Asset type
- User filter
- Transaction status

### Performance

- Pagination support
- Optimized queries for large datasets

---

# 5. Security & Access Control

### Authentication

All APIs are secured using **JWT authentication**.

### Role-Based Access Control

Roles implemented:

- User
- Admin
- Super Admin

### Permission Rules

User APIs:
- Access only their own wallet data

Admin APIs:
- Manage deposits
- Manage withdrawals
- Access reports
- Perform approvals

---

# File Upload Security

Deposit proof uploads are protected using:

- File type restrictions (Image / PDF)
- File size limits
- Secure file storage configuration

---

# Additional Security Features

- API Rate Limiting
- Request Validation Middleware
- Password Hashing (bcrypt)
- Admin action logging for audit

---

# Project Structure
wallet-ledger-system
│
├── config
│ └── multer.js
│
├── controllers
│ ├── authController.js
│ ├── walletController.js
│ ├── depositController.js
│ ├── withdrawalController.js
│ ├── transactionController.js
│ ├── ledgerController.js
│ ├── notificationController.js
│ ├── adminController.js
│ └── adminReportController.js
│
├── middleware
│ ├── authMiddleware.js
│ ├── roleMiddleware.js
│ └── validateRequest.js
│
├── models
│ ├── User.js
│ ├── Ledger.js
│ ├── Withdrawal.js
│ ├── Notification.js
│ └── AdminLog.js
│
├── routes
│ ├── authRoutes.js
│ ├── walletRoutes.js
│ ├── depositRoutes.js
│ ├── withdrawRoutes.js
│ ├── ledgerRoutes.js
│ ├── notificationRoutes.js
│ └── adminReportRoutes.js
│
├── seedTransactions.js
├── seedWallets.js
├── server.js
└── README.md


---

# Installation

Clone the repository


git clone https://github.com/YOUR_GITHUB_USERNAME/wallet-ledger-system.git


Navigate to the project folder


cd wallet-ledger-system


Install dependencies


npm install


---

# Environment Variables

Create `.env` file


PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
JWT_REFRESH_SECRET=your_refresh_secret


---

# Run Server


npm start


Server runs on


http://localhost:5000


---

# API Overview

Authentication


POST /api/auth/register
POST /api/auth/login


Wallet


GET /api/wallet


Deposits


POST /api/deposit


Withdrawals


POST /api/withdraw


Notifications


GET /api/notifications
PATCH /api/notifications/read


Admin Reports


GET /api/admin/reports


---

# Author

Wallet Ledger Backend System developed for backend engineering task.