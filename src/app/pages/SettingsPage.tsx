import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  User,
  Bell,
  Lock,
  Palette,
  Music,
  Trash2,
  Check,
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  ChevronRight,
} from "lucide-react";

function SpotifyIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`fill-current ${className}`}>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  
  // Account settings state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  // Notification settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [playlistUpdates, setPlaylistUpdates] = useState(true);
  const [newFollowers, setNewFollowers] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  
  // Preferences state
  const [autoplay, setAutoplay] = useState(true);
  const [highQuality, setHighQuality] = useState(true);
  const [privateProfile, setPrivateProfile] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navigation />
        <main className="pt-24 pb-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Sign in to access settings
            </h2>
            <p className="text-gray-500 mb-8">
              Create an account or sign in to customize your experience.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/login">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6">
                  Sign in
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" className="px-6">
                  Create account
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleSaveAccount = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    logout();
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />

      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Profile
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-500">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="space-y-6">
            {/* Account Settings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Account Settings
                  </h2>
                  <p className="text-sm text-gray-500">
                    Update your personal information
                  </p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="pt-2">
                  <Button
                    onClick={handleSaveAccount}
                    disabled={isSaving}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Connected Services */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Music className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Connected Services
                  </h2>
                  <p className="text-sm text-gray-500">
                    Manage your integrations
                  </p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#1DB954]/10 rounded-xl flex items-center justify-center">
                      <SpotifyIcon className="w-6 h-6 text-[#1DB954]" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 mb-0.5">
                        Spotify
                      </div>
                      <div className="text-sm text-gray-500">
                        {user?.spotifyConnected
                          ? "Connected and syncing"
                          : "Not connected"}
                      </div>
                    </div>
                  </div>
                  {user?.spotifyConnected ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                        Active
                      </span>
                      <Button variant="outline" className="text-sm px-4">
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <Button className="bg-[#1DB954] hover:bg-[#1aa34a] text-white text-sm px-4">
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Notifications
                  </h2>
                  <p className="text-sm text-gray-500">
                    Customize your notification preferences
                  </p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {[
                  {
                    label: "Email Notifications",
                    description: "Receive notifications via email",
                    checked: emailNotifications,
                    onChange: setEmailNotifications,
                  },
                  {
                    label: "Playlist Updates",
                    description: "Get notified when playlists are updated",
                    checked: playlistUpdates,
                    onChange: setPlaylistUpdates,
                  },
                  {
                    label: "New Followers",
                    description: "Alert when someone follows you",
                    checked: newFollowers,
                    onChange: setNewFollowers,
                  },
                  {
                    label: "Weekly Digest",
                    description: "Summary of your activity every week",
                    checked: weeklyDigest,
                    onChange: setWeeklyDigest,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <div className="font-medium text-gray-900 mb-0.5">
                        {item.label}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.description}
                      </div>
                    </div>
                    <button
                      onClick={() => item.onChange(!item.checked)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        item.checked ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          item.checked ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Palette className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Preferences
                  </h2>
                  <p className="text-sm text-gray-500">
                    Customize your playback and privacy settings
                  </p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {[
                  {
                    label: "Autoplay",
                    description: "Automatically play similar content",
                    checked: autoplay,
                    onChange: setAutoplay,
                  },
                  {
                    label: "High Quality Audio",
                    description: "Stream at the highest quality available",
                    checked: highQuality,
                    onChange: setHighQuality,
                  },
                  {
                    label: "Private Profile",
                    description: "Hide your profile from search results",
                    checked: privateProfile,
                    onChange: setPrivateProfile,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <div className="font-medium text-gray-900 mb-0.5">
                        {item.label}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.description}
                      </div>
                    </div>
                    <button
                      onClick={() => item.onChange(!item.checked)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        item.checked ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          item.checked ? "translate-x-6" : ""
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Privacy & Security
                  </h2>
                  <p className="text-sm text-gray-500">
                    Control your data and security options
                  </p>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <div>
                    <div className="font-medium text-gray-900 mb-0.5">
                      Download Your Data
                    </div>
                    <div className="text-sm text-gray-500">
                      Get a copy of your information
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <div>
                    <div className="font-medium text-gray-900 mb-0.5">
                      Two-Factor Authentication
                    </div>
                    <div className="text-sm text-gray-500">
                      Add an extra layer of security
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <div>
                    <div className="font-medium text-gray-900 mb-0.5">
                      Sessions
                    </div>
                    <div className="text-sm text-gray-500">
                      Manage active sessions on other devices
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-red-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Danger Zone
                  </h2>
                  <p className="text-sm text-gray-500">
                    Irreversible account actions
                  </p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between p-4 bg-red-50 rounded-xl">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">
                      Sign Out
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      Sign out from this device
                    </div>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
                <div className="flex items-start justify-between p-4 bg-red-50 rounded-xl">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">
                      Delete Account
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      Permanently delete your account and all data. This action
                      cannot be undone.
                    </div>
                    <Button
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-600 hover:text-white"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
