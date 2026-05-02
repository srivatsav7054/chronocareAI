import { User } from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

// ─── Register ────────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const {
      name, email, password,
      phone, dateOfBirth, gender, bloodGroup,
      height, weight, address, emergencyContact,
      allergies, chronicConditions,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with that email already exists" });
    }

    const user = new User({
      name,
      email,
      password,
      phone: phone || "",
      dateOfBirth: dateOfBirth || "",
      gender: gender || "",
      bloodGroup: bloodGroup || "",
      height: height || "",
      weight: weight || "",
      address: address || "",
      emergencyContact: emergencyContact || "",
      allergies: Array.isArray(allergies)
        ? allergies
        : allergies
          ? allergies.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      chronicConditions: Array.isArray(chronicConditions)
        ? chronicConditions
        : chronicConditions
          ? chronicConditions.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
    });

    await user.save();

    const token = generateToken(user._id);

    return res.status(201).json({
      message: "Account created successfully",
      token,
      user: user.toJSON(),
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error during registration" });
  }
};

// ─── Login ───────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    return res.json({
      message: "Login successful",
      token,
      user: user.toJSON(),
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
};

// ─── Get Profile ─────────────────────────────────────────────────────────────
export const getProfile = async (req, res) => {
  try {
    return res.json({ user: req.user.toJSON() });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─── Update Profile ───────────────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const ALLOWED = [
      "name", "phone", "dateOfBirth", "gender", "bloodGroup",
      "height", "weight", "address", "emergencyContact",
      "allergies", "chronicConditions", "currentMedications", "profilePicture",
    ];

    const updates = {};
    for (const key of ALLOWED) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.json({
      message: "Profile updated",
      user: user.toJSON(),
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
