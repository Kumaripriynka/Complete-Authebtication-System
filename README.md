# Complete-Authentication-System

# Full Stack Authentication System (React + Vite)

A secure and user-friendly full-stack authentication system built with **React + Vite**, **Node.js**, and **MySQL**. This project includes features like registration, login, forgot/reset password via email, JWT protection, and user session handling.

---

##  Features

-  User Registration with Password Validation
-  Secure Login with JWT & Cookies
-  Forgot Password with Email Reset Password Link (via Nodemailer)
-  Password Reset with Strength Meter
-  Protected Routes
-  Auto Login with LocalStorage fallback
-  Logout & Session Cleanup
-  Toast Notifications for Feedback
-  Fully Responsive UI (Tailwind CSS)

---

##  Tech Stack

### 🔹 Frontend (React + Vite)
- Vite
- React.js
- React Router DOM
- Tailwind CSS
- Toastify
- Axios
- Lucide-React

### 🔹 Backend
- Node.js
- Express.js
- MySQL
- Bcrypt
- JWT (JSON Web Tokens)
- Nodemailer

---

## 📁 Folder Structure (Frontend)

```
src/
├── pages/
│   ├── Register.jsx
│   ├── Login.jsx
│   ├── ForgotPassword.jsx
│   ├── ResetPassword.jsx
│   └── Home.jsx
├── services/
│   └── api.js
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🖥️ Setup Instructions

###  Backend (Node.js + MySQL)

1. Clone the project
2. Navigate to the backend folder and run:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=my_password
   DB_NAME=db_name
   JWT_SECRET=my_jwt_secret
   Email_service = gmail
   Email_user= myusername
   Email_password = emailpassword
   PORT = port
   ```
4. Ensure MySQL is running and `auth_db` exists
5. Start the backend server:
   ```bash
   npm start or npm run dev
   ```

---

### 🌐 Frontend (React + Vite)

1. Navigate to the frontend folder
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Vite will run at [http://localhost:5173](http://localhost:5173)

---

## ✉️ Email Reset Flow

- User requests reset via `/forgot-password`
- Backend sends a time-limited token to user's email using Nodemailer
- Clicking the link navigates to `/reset-password/:token`
- User sets a new password that meets strength requirements

---

##  Password Strength Criteria

- Minimum 8 characters
- At least 1 uppercase and 1 lowercase letter
- At least 1 number
- At least 1 special character

---

##  Future Enhancements

- Two-Factor Authentication (2FA)
- Role-based Admin/User dashboards
- JWT refresh token handling
- Centralized error logging
- Unit testing with Jest + React Testing Library

---


---

## 📄 License

This project is open-source and available under the MIT license.

