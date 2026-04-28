import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import NewPlaylistPage from "./pages/NewPlaylistPage";
import NewFolderPage from "./pages/NewFolderPage";
import SettingsPage from "./pages/SettingsPage";
import CallbackPage from "./pages/CallbackPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/new-playlist" element={<NewPlaylistPage />} />
          <Route path="/new-folder" element={<NewFolderPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/callback" element={<CallbackPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}