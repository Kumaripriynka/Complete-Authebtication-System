import express from 'express';
import { connectToDatabase } from '../lib/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendResetPasswordEmail from '../utils/mailer.js';

const router = express.Router();

// Security and validation middleware
const validateRegisterInput = (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  next();
};

// Register route
router.post('/register', validateRegisterInput, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const db = await connectToDatabase();
    
    // Check if user exists (both email and username)
    const [existingUsers] = await db.query(
      "SELECT * FROM users WHERE email = ? OR username = ?", 
      [email, username]
    );
    
    if (existingUsers.length > 0) {
      return res.status(409).json({ 
        message: "User already exists",
        // Don't reveal which field is duplicate in production
      });
    }

    const hashPassword = await bcrypt.hash(password, 12); // Increased salt rounds
    await db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)", 
      [username, email, hashPassword]
    );

    return res.status(201).json({
      message: "User account created successfully!",
      user: { username, email }
    });

  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ 
      message: "Server error during registration",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(
      "SELECT id, username, email, password FROM users WHERE email = ?", 
      [email]
    );

    if (rows.length === 0) {
      // Generic message to prevent email enumeration
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_KEY, 
      { expiresIn: '3h' }
    );
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
      maxAge: 3 * 60 * 60 * 1000,
      domain: 'localhost' // Add this if needed
    });
  
    return res.status(200).json({ 
      message: "Login successful",
      user: { id: user.id, username: user.username, email: user.email }
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ 
      message: "Server error during login",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Forgot Password route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(
      "SELECT id FROM users WHERE email = ?", 
      [email]
    );
    
    // Always return success to prevent email enumeration
    if (rows.length === 0) {
      return res.status(200).json({ 
        message: "If this email exists in our system, you will receive a reset link"
      });
    }
    
    // Generate cryptographically secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiration = new Date(Date.now() + 3600000); // 1 hour
    
    // Hash the token before storing
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    await db.query(
      "UPDATE users SET resetToken = ?, resetTokenExpiration = ? WHERE email = ?",
      [hashedToken, resetTokenExpiration, email]
    );
    
    // Send email with unhashed token
    await sendResetPasswordEmail(email, resetToken);
    
    return res.status(200).json({ 
      message: "If this email exists in our system, you will receive a reset link"
    });
    
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ 
      message: "Server error processing your request",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Verify reset token
router.get('/verify-reset-token/:token', async (req, res) => {
  const { token } = req.params;
  
  if (!token) {
    return res.status(400).json({ valid: false, message: "Token is required" });
  }
  
  try {
    const db = await connectToDatabase();
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const [rows] = await db.query(
      "SELECT id FROM users WHERE resetToken = ? AND resetTokenExpiration > NOW()", 
      [hashedToken]
    );
    
    return res.status(200).json({ 
      valid: rows.length > 0,
      message: rows.length > 0 ? "Valid token" : "Invalid or expired token"
    });
    
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(500).json({ 
      valid: false,
      message: "Server error verifying token",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Reset Password route
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  
  if (!token || !password) {
    return res.status(400).json({ error: "Token and new password are required" });
  }
  
  if (password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }
  
  try {
    const db = await connectToDatabase();
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const [rows] = await db.query(
      "SELECT id FROM users WHERE resetToken = ? AND resetTokenExpiration > NOW()", 
      [hashedToken]
    );
    
    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    
    const hashPassword = await bcrypt.hash(password, 12);
    await db.query(
      "UPDATE users SET password = ?, resetToken = NULL, resetTokenExpiration = NULL WHERE id = ?",
      [hashPassword, rows[0].id]
    );
    
    return res.status(200).json({ message: "Password reset successfully" });
    
  } catch (err) {
    console.error('Password reset error:', err);
    return res.status(500).json({ 
      message: "Server error resetting password",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Middleware for verifying token
const verifyToken = (req, res, next) => {
  try {
    // Check cookies first
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(403).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Protected route
router.get('/me', verifyToken, async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query(
      "SELECT id, username, email FROM users WHERE id = ?", 
      [req.userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user: rows[0] });

  } catch (err) {
    console.error('Profile fetch error:', err);
    return res.status(500).json({ 
      message: "Server error fetching profile",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: "Logged out successfully" });
});

export default router;
