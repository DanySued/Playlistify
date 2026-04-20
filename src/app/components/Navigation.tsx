import { Music, Plus, User, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export function Navigation() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Music className="w-8 h-8 text-indigo-600" />
            <span className="font-semibold text-xl">Playlistify</span>
          </Link>

          {/* Center action */}
          {isAuthenticated ? (
            <Button
              className="hidden sm:flex bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-sm items-center gap-2"
              onClick={() => navigate("/new-playlist")}
            >
              <Plus className="w-4 h-4" />
              New Playlist
            </Button>
          ) : (
            <Link to="/login" className="hidden sm:block">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-sm flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                Sign in
              </Button>
            </Link>
          )}

          {/* Profile / avatar */}
          <button
            aria-label="View profile"
            onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center hover:shadow-lg transition-shadow text-white font-bold text-sm"
          >
            {isAuthenticated && user?.initials ? (
              user.initials
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}