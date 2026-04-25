import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const defaultProfile = {
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  phone: "+1 (555) 234-5678",
  dateOfBirth: "1990-05-14",
  gender: "Female",
  bloodGroup: "O+",
  height: "5'6\"",
  weight: "145 lbs",
  address: "42 Maple Street, Austin, TX 78701",
  emergencyContact: "James Johnson — +1 (555) 987-6543",
  healthScore: 82,
  allergies: ["Penicillin", "Peanuts", "Shellfish"],
  chronicConditions: ["Hypertension", "Type 2 Diabetes"],
  currentMedications: [
    { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" },
    { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
  ],
  profilePicture: null,
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(defaultProfile);

  const login = (profileData) => {
    if (profileData) {
      setUserProfile((prev) => ({ ...prev, ...profileData }));
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateProfile = (updates) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userProfile,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
