import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../backend/.env") });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

async function listUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}, "name email");
    console.log("Registered Users:");
    users.forEach(u => console.log(`- ${u.name} (${u.email})`));
    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
}

listUsers();
