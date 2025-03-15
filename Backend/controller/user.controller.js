import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import rs from "randomstring";
import nodemailer from "nodemailer";
import UserSchemaModel from "../models/user.model.js";
import "../models/connection.js";

// User Registration
export const save = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await UserSchemaModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new UserSchemaModel({
      name,
      email,
      password: hashedPassword,
      role: "user",
      status: 1,
      info: new Date().toISOString(),
    });

    await newUser.save();
    res.status(201).json({ status: true, message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await UserSchemaModel.findOne({ email, status: 1 });
    if (!user) return res.status(401).json({ message: "Invalid credentials or inactive user" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token
    const payload = { userId: user._id, email: user.email, role: user.role };
    const key = process.env.JWT_SECRET || rs.generate();
    const token = jwt.sign(payload, key, { expiresIn: "1h" });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Forgot Password Controller  
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserSchemaModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const secret = user._id.toString() + "RESET_SECRET";
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: "10m" });
    res.status(200).json({ message: "Token generated successfully", token });
  
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const resetPasswordWithToken = async (req, res) => {
  const { email, newPassword, confirmPassword, token } = req.body;

  try {
    const user = await UserSchemaModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const secret = user._id.toString() + "RESET_SECRET";

    try {
      jwt.verify(token, secret);
    } catch (error) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // ✅ Hash the password before saving
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password reset successfully!" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
  