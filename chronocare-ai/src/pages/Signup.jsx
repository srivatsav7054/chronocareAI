import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Loader, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import beeLogo from "../assets/bee-logo.svg";

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition text-sm";

export const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    height: "",
    weight: "",
    address: "",
    emergencyContact: "",
    allergies: "",
    chronicConditions: "",
  });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const payload = {
        ...form,
        allergies: form.allergies
          ? form.allergies.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        chronicConditions: form.chronicConditions
          ? form.chronicConditions.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        currentMedications: [],
      };
      await register(payload);
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Registration failed. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const next = () => { setError(""); setStep((s) => Math.min(s + 1, 3)); };
  const prev = () => { setError(""); setStep((s) => Math.max(s - 1, 1)); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <img src={beeLogo} alt="HealthHive" className="w-12 h-12 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-800">Create your account</h1>
          <p className="text-gray-400 text-sm mt-1">Step {step} of 3</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? "bg-amber-400" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={handleSignup}>

            {/* Error banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="font-semibold text-gray-700 text-sm mb-2">Account Details</h2>
                  <Field label="Full Name" required>
                    <input type="text" required value={form.name} onChange={set("name")} className={inputClass} placeholder="Sarah Johnson" />
                  </Field>
                  <Field label="Email" required>
                    <input type="email" required value={form.email} onChange={set("email")} className={inputClass} placeholder="you@example.com" />
                  </Field>
                  <Field label="Password" required>
                    <input type="password" required minLength={6} value={form.password} onChange={set("password")} className={inputClass} placeholder="Min. 6 characters" />
                  </Field>
                  <Field label="Phone Number">
                    <input type="tel" value={form.phone} onChange={set("phone")} className={inputClass} placeholder="+1 (555) 123-4567" />
                  </Field>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="font-semibold text-gray-700 text-sm mb-2">Personal Information</h2>
                  <Field label="Date of Birth">
                    <input type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} className={inputClass} />
                  </Field>
                  <Field label="Gender">
                    <select value={form.gender} onChange={set("gender")} className={inputClass}>
                      <option value="">Select gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                      <option>Prefer not to say</option>
                    </select>
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Height">
                      <input type="text" value={form.height} onChange={set("height")} className={inputClass} placeholder='5&apos;6"' />
                    </Field>
                    <Field label="Weight">
                      <input type="text" value={form.weight} onChange={set("weight")} className={inputClass} placeholder="145 lbs" />
                    </Field>
                  </div>
                  <Field label="Blood Group">
                    <select value={form.bloodGroup} onChange={set("bloodGroup")} className={inputClass}>
                      <option value="">Select blood group</option>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Address">
                    <input type="text" value={form.address} onChange={set("address")} className={inputClass} placeholder="42 Maple Street, Austin, TX" />
                  </Field>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <h2 className="font-semibold text-gray-700 text-sm mb-2">Medical Information</h2>
                  <Field label="Known Allergies" hint="Separate with commas">
                    <input type="text" value={form.allergies} onChange={set("allergies")} className={inputClass} placeholder="Penicillin, Peanuts" />
                  </Field>
                  <Field label="Chronic Conditions" hint="Separate with commas">
                    <input type="text" value={form.chronicConditions} onChange={set("chronicConditions")} className={inputClass} placeholder="Hypertension, Diabetes" />
                  </Field>
                  <Field label="Emergency Contact">
                    <input type="text" value={form.emergencyContact} onChange={set("emergencyContact")} className={inputClass} placeholder="Name — Phone number" />
                  </Field>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prev}
                  className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}
              {step < 3 ? (
                <button
                  type="button"
                  onClick={next}
                  className="flex-1 flex items-center justify-center gap-1 py-3 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all text-sm"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <><Loader className="w-4 h-4 animate-spin" /> Creating account...</>
                  ) : (
                    "Create Account"
                  )}
                </motion.button>
              )}
            </div>
          </form>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-500 hover:text-amber-600 font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

const Field = ({ label, required, hint, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1.5">
      {label}
      {required && <span className="text-red-400 ml-0.5">*</span>}
      {hint && <span className="text-gray-400 font-normal ml-1">({hint})</span>}
    </label>
    {children}
  </div>
);
