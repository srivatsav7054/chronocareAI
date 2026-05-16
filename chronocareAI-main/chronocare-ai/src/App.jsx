import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { AppLayout } from "./layout/AppLayout";
import { RightPanel } from "./components/RightPanel";

import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/Dashboard";
import { Timeline } from "./pages/Timeline";
import { Upload } from "./pages/Upload";
import { Emergency } from "./pages/Emergency";
import { MedicalStory } from "./pages/MedicalStory";
import { AccessControl } from "./pages/AccessControl";
import { UnifiedProfile } from "./pages/UnifiedProfile";
import { HealthIntelligence } from "./pages/HealthIntelligence";
import { ProfileSettings } from "./pages/ProfileSettings";
import { RiskAnalysis } from "./pages/RiskAnalysis";

import "./index.css";

const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout showRightPanel={true} RightPanelComponent={RightPanel} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
      </Route>

      <Route path="/timeline" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Timeline />} />
      </Route>

      <Route path="/upload" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Upload />} />
      </Route>

      <Route path="/medical-story" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<MedicalStory />} />
      </Route>

      <Route path="/access-control" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<AccessControl />} />
      </Route>

      <Route path="/risk-analysis" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<RiskAnalysis />} />
      </Route>

      <Route path="/profile" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<ProfileSettings />} />
      </Route>

      <Route path="/unified-profile" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<UnifiedProfile />} />
      </Route>

      <Route path="/health-intelligence" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<HealthIntelligence />} />
      </Route>

      <Route path="/emergency" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Emergency />} />
      </Route>

    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
