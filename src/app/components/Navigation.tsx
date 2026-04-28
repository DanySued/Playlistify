import { User, Search } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

interface NavigationProps {
  searchQuery?: string;
  onSearch?: (q: string) => void;
}

export function Navigation({ searchQuery = "", onSearch }: NavigationProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
        <Link to="/" className="shrink-0">
          <span className="font-bold text-xl text-[#E60023]">Playlistify</span>
        </Link>

        <div className="flex-1 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search playlists..."
              value={searchQuery}
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
            />
          </div>
        </div>

        <button
          aria-label="View profile"
          onClick={() => navigate("/profile")}
          className="shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-700 font-bold text-sm overflow-hidden"
        >
          {isAuthenticated && user?.initials ? (
            <span>{user.initials}</span>
          ) : (
            <User className="w-5 h-5" />
          )}
        </button>
      </div>
    </nav>
  );
}
