import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking stored token

  // ─── On mount: restore session from localStorage ────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("hh_token");
    if (!token) {
      setLoading(false);
      return;
    }
    // Validate token + fetch fresh profile
    api.get("/api/users/profile")
      .then(({ data }) => {
        setUserProfile(data.user);
        setIsAuthenticated(true);
      })
      .catch(() => {
        // Token expired / invalid
        localStorage.removeItem("hh_token");
      })
      .finally(() => setLoading(false));
  }, []);

  // ─── Register ────────────────────────────────────────────────────────────
  const register = async (formData) => {
    const { data } = await api.post("/api/users/register", formData);
    localStorage.setItem("hh_token", data.token);
    setUserProfile(data.user);
    setIsAuthenticated(true);
    return data;
  };

  // ─── Login ───────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const { data } = await api.post("/api/users/login", { email, password });
    localStorage.setItem("hh_token", data.token);
    setUserProfile(data.user);
    setIsAuthenticated(true);
    return data;
  };

  // ─── Logout ──────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem("hh_token");
    setUserProfile(null);
    setIsAuthenticated(false);
  };

  // ─── Update profile (local + API) ────────────────────────────────────────
  const updateProfile = async (updates) => {
    const { data } = await api.patch("/api/users/profile", updates);
    setUserProfile(data.user);
    return data;
  };

  // ─── Role Toggle (Demo Purposes) ─────────────────────────────────────────
  const [role, setRole] = useState("patient");
  const toggleRole = () => setRole(r => r === "patient" ? "doctor" : "patient");

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userProfile,
        loading,
        role,
        toggleRole,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
