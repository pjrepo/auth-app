# Authentication App – Backend (Node.js + Express + MongoDB)

### Overview

This backend server provides user authentication with OTP verification and JWT-based authorization.
Key features include:

- OTP-based Signup (valid for 2 minutes).
- Secure Password Hashing using bcrypt.
- Login Retry Limits (blocks after 3 failed attempts within 3 hours).
- JWT Authentication (1-hour expiry).
- Password Update for Authenticated Users.
- Email Service using nodemailer.
- Rate Limiting to prevent abuse (max 10 requests per 15 min/IP).
- Cron Job to reset login attempts every 3 hours.

### Tech Stack

- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB (via Mongoose ODM)
- Authentication: JWT (jsonwebtoken)
- Email Service: Nodemailer (Gmail SMTP)
- Utilities: bcrypt, node-cron, express-rate-limit

### Project Structure

server/
│
├── config/
│ └── db.js # MongoDB connection setup
│
├── controllers/
│ └── authController.js # Business logic for auth APIs
│
├── middlewares/
│ ├── rateLimiter.js # Request rate limiting
│ └── verifyToken.js # JWT verification middleware
│
├── models/
│ ├── User.js # User schema/model
│ └── Otp.js # OTP schema/model
│
├── routes/
│ └── authRoutes.js # API route definitions
│
├── utils/
│ ├── resetLoginAttempts.js # Cron job for login attempt reset
│ └── sendEmail.js # Utility for sending OTP emails
│
├── server.js # Main entry point
└── .env.example # Example environment variables

### API Endpoints

Base URL: /api/auth
| Method | Endpoint | Description | Auth Required |
| ------ | ------------------ | ------------------------------------- | ------------- |
| POST | `/send-otp` | Sends an OTP to user email | No |
| POST | `/verify-otp` | Verifies OTP for a given email | No |
| POST | `/signup` | Registers user after OTP verification | No |
| POST | `/login` | Logs in user and returns JWT | No |
| GET | `/user` | Fetches logged-in user profile | Yes (JWT) |
| PUT | `/update-password` | Updates password for logged-in user | Yes (JWT) |

### Environment Variables

Create a .env file in the server directory with:
PORT
MONGO_URI
JWT_SECRET
EMAIL_USER
EMAIL_PASS

### Getting Started

1. Clone the Repository
   git clone https://github.com/pjrepo/auth-app.git
   cd auth-app/server
2. Install Dependencies
   npm install
3. Run the Server
   npm run dev # Using nodemon (if configured)
   (or)  
   node server.js

### How it Works

##### Signup:

- User requests OTP via /send-otp.
- Verifies OTP with /verify-otp.
  Calls /signup with details and OTP.

##### Login:

- User logs in with email/password.
- Receives a JWT for protected routes.

##### Password Update:

- Authenticated user calls /update-password with current and new passwords.

### Security Features

- Passwords are stored as bcrypt hashes.
- OTP expires after 2 minutes.
- Rate limiting prevents brute-force attacks.
- Cron job resets failed login attempts every 3 hours.
