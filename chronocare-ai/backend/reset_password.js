import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../backend/.env") });

const userSchema = new mongoose.Schema({
  email: String,
  password: { type: String, required: true },
});

// We need to re-implement the hash logic or just hash it manually here since we are using a custom script
// But actually, it's safer to just hash it here and update the field.

const User = mongoose.model("User", userSchema);

async function resetPassword() {
  const email = "sri@gmail.com";
  const newPassword = "password123";
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`User ${email} not found.`);
      await mongoose.disconnect();
      return;
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();
    
    console.log(`Password for ${email} has been reset to: ${newPassword}`);
    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
}

resetPassword();
