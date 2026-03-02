# Wallet & Transaction Management System

A Node.js + Express + MongoDB project for managing user wallets, deposits, withdrawals, fees, and GST.

---

## Features

- User authentication (Register / Login / Refresh Token) using JWT

- User Wallet management (multiple assets per user)
- Deposit functionality:

  - Users can create deposits with proof (screenshot/document)
  - Admin can approve/reject deposits
  - Configurable fees & GST applied

- Withdrawal functionality:
  - Users can request withdrawals
  - Admin can approve/reject withdrawals

- Fee & GST management:
  - Admin can configure fees per asset and enable/disable dynamically

- Transaction history & single transaction retrieval
- Admin transaction listing with filters (date, user, status, asset type)
- Proper status handling (`Pending`, `Approved`, `Rejected`)
- Audit logs for admin actions
- Secure file upload for deposit proofs

---

## Environment Variables

Create a `.env` file in the root:

```bash
PORT=5000
MONGO_URI=<Your MongoDB connection string>
JWT_SECRET=<Your JWT access token secret>
JWT_REFRESH_SECRET=<Your JWT refresh token secret>

Installation

git clone <your-repo-url>
cd <project-folder>
npm install
npm start

Server runs at: http://localhost:5000.


API Endpoints — Manual Postman Testing

1️⃣ Auth Routes

Endpoint	Method	Headers	Body	Notes
/api/auth/register	POST	Content-Type: application/json	json { "name": "Pavithraharini", "email": "pavithra123@gmail.com", "password": "123456" }	Register a new user
/api/auth/login	POST	Content-Type: application/json	json { "email": "pavithra123@gmail.com", "password": "123456" }	Login and get accessToken & refreshToken
/api/auth/refresh	POST	Content-Type: application/json	json { "token": "<refresh_token>" }	Refresh JWT access token

2️⃣ Deposit Routes

Endpoint	Method	Headers	Body / Form-data	Notes
/api/deposits	POST	Authorization: Bearer <accessToken>	Form-data:
assetType: BTC
amount: 0.5
network: Bitcoin
walletAddress: <user_wallet_address>
remarks: Test deposit
assetProof: <file>	Create a deposit request
/api/deposits/:id/approve	PATCH	Authorization: Bearer <admin_accessToken>	None	Admin approves a deposit
/api/deposits/:id/reject	PATCH	Authorization: Bearer <admin_accessToken>	None	Admin rejects a deposit

3️⃣ Withdrawal Routes

Endpoint	Method	Headers	Body	Notes
/api/withdrawals	POST	Authorization: Bearer <accessToken>	json { "assetType": "BTC", "amount": 0.2, "destinationWallet": "<wallet_address>", "remarks": "Withdrawal test" }	Request a withdrawal
/api/withdrawals/:id/approve	PATCH	Authorization: Bearer <admin_accessToken>	None	Admin approves a withdrawal
/api/withdrawals/:id/reject	PATCH	Authorization: Bearer <admin_accessToken>	None	Admin rejects a withdrawal

4️⃣ Wallet Routes

Endpoint	Method	Headers	Body	Notes
/api/wallets	GET	Authorization: Bearer <accessToken>	None	Get all wallet balances for logged-in user

5️⃣ Transaction Routes

Endpoint	Method	Headers	Body	Notes
/api/transactions	GET	Authorization: Bearer <accessToken>	None	Get transaction history (deposit + withdrawal)
/api/transactions/:id	GET	Authorization: Bearer <accessToken>	None	Get single transaction details

6️⃣ Fee & GST Management (Admin)

Endpoint	Method	Headers	Body	Notes
/api/fees	GET	Authorization: Bearer <admin_accessToken>	None	List all fee configurations
/api/fees	POST	Authorization: Bearer <admin_accessToken>	json { "assetType": "BTC", "feePercentage": 0.5, "gstPercentage": 18, "enabled": true }	Create or update fee & GST
Testing Notes


Always replace tokens:

<accessToken> = token from user login

<admin_accessToken> = token from admin login

<refresh_token> = refresh token from login


Deposit/Withdrawal IDs: Use _id from API responses for approve/reject.


Sequence to test:

1.Register → Login → Deposit → Approve Deposit → Check Wallet

2.Request Withdrawal → Approve Withdrawal → Check Wallet

3.Check Transaction History → Single Transaction → Fees

4.Deposit uses form-data (file upload), all others use JSON.

5.Statuses: Pending, Approved, Rejected.