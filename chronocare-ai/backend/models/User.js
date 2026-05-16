import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, default: "" },
  frequency: { type: String, default: "" },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },

  // Personal
  phone: { type: String, default: "" },
  dateOfBirth: { type: String, default: "" },
  gender: { type: String, default: "" },
  address: { type: String, default: "" },
  profilePicture: { type: String, default: null },

  // Medical
  bloodGroup: { type: String, default: "" },
  height: { type: String, default: "" },
  weight: { type: String, default: "" },
  emergencyContact: { type: String, default: "" },
  allergies: { type: [String], default: [] },
  chronicConditions: { type: [String], default: [] },
  currentMedications: { type: [medicationSchema], default: [] },

  // Computed
  healthScore: { type: Number, default: 0 },

}, { timestamps: true });

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password helper
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Never return password in JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = mongoose.model("User", userSchema);
