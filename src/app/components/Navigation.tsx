import { useState } from "react";
import {
  Music,
  Plus,
  User,
  LogIn,
  Sun,
  Moon,
  Menu,
  X,
  Settings,
  LayoutGrid,
} from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLanding = location.pathname === "/";

  const navBg = isLanding
    ? "bg-[#0a0a0a]/80 border-white/5"
    : "bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-700";

  const logoTextClass = isLanding
    ? "text-white"
    : "text-gray-900 dark:text-gray-100";

  const linkClass = isLanding
    ? "text-white/60 hover:text-white"
    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white";

  const iconBtnClass = isLanding
    ? "bg-white/8 hover:bg-white/12 text-white/70"
    : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300";

  const mobileMenuBg = isLanding
    ? "bg-[#111111] border-white/8 shadow-2xl shadow-black/60"
    : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-lg";

  const mobileLinkClass = isLanding
    ? "text-white/70 hover:text-white hover:bg-white/6"
    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b ${navBg}`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <Music className="w-7 h-7 text-[#1DB954]" />
              <span className={`font-semibold text-lg ${logoTextClass}`}>
                Playlistify
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {isLanding && !isAuthenticated && (
                <>
                  <a
                    href="#features"
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${linkClass}`}
                  >
                    Features
                  </a>
                  <a
                    href="#how-it-works"
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${linkClass}`}
                  >
                    How it works
                  </a>
                </>
              )}

              {isAuthenticated && (
                <Link
                  to="/app"
                  className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-1.5 ${linkClass}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  My Library
                </Link>
              )}
            </div>

            {/* Desktop right */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <Button
                  className="bg-[#1DB954] hover:bg-[#1aa34a] text-white px-5 py-2 rounded-lg shadow-sm flex items-center gap-2 text-sm"
                  onClick={() => navigate("/new-playlist")}
                >
                  <Plus className="w-4 h-4" />
                  New Playlist
                </Button>
              ) : (
                <>
                  <Link to="/login">
                    <Button
                      variant="ghost"
                      className={`text-sm px-4 py-2 rounded-lg transition-colors ${linkClass}`}
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-[#1DB954] hover:bg-[#1aa34a] text-white px-5 py-2 rounded-lg shadow-sm text-sm">
                      Get started
                    </Button>
                  </Link>
                </>
              )}

              {/* Theme toggle */}
              <button
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${iconBtnClass}`}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              {/* Avatar */}
              {isAuthenticated && (
                <button
                  aria-label="View profile"
                  onClick={() => navigate("/profile")}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1DB954] to-[#1aa34a] flex items-center justify-center hover:shadow-lg transition-shadow text-white font-bold text-xs"
                >
                  {user?.initials ?? <User className="w-4 h-4" />}
                </button>
              )}
            </div>

            {/* Mobile right */}
            <div className="flex md:hidden items-center gap-2">
              <button
                aria-label="Toggle theme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${iconBtnClass}`}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
              <button
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMenuOpen((v) => !v)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${iconBtnClass}`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={menuOpen ? "close" : "open"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {menuOpen ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Menu className="w-4 h-4" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className={`fixed top-[65px] left-0 right-0 z-40 border-b ${mobileMenuBg} md:hidden`}
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/app"
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${mobileLinkClass}`}
                  >
                    <LayoutGrid className="w-4 h-4 opacity-60" />
                    My Library
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/new-playlist");
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#1DB954] bg-[#1DB954]/10 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    New Playlist
                  </button>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${mobileLinkClass}`}
                  >
                    <User className="w-4 h-4 opacity-60" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${mobileLinkClass}`}
                  >
                    <Settings className="w-4 h-4 opacity-60" />
                    Settings
                  </Link>
                </>
              ) : (
                <>
                  {isLanding && (
                    <>
                      <a
                        href="#features"
                        onClick={() => setMenuOpen(false)}
                        className={`px-4 py-3 rounded-xl text-sm transition-colors ${mobileLinkClass}`}
                      >
                        Features
                      </a>
                      <a
                        href="#how-it-works"
                        onClick={() => setMenuOpen(false)}
                        className={`px-4 py-3 rounded-xl text-sm transition-colors ${mobileLinkClass}`}
                      >
                        How it works
                      </a>
                      <Link
                        to="/app"
                        onClick={() => setMenuOpen(false)}
                        className={`px-4 py-3 rounded-xl text-sm transition-colors ${mobileLinkClass}`}
                      >
                        Browse demo
                      </Link>
                    </>
                  )}
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl text-sm transition-colors ${mobileLinkClass}`}
                  >
                    <LogIn className="w-4 h-4 inline mr-2 opacity-60" />
                    Log in
                  </Link>
                  <div className="pt-1 pb-2">
                    <Link to="/signup" onClick={() => setMenuOpen(false)}>
                      <Button className="w-full bg-[#1DB954] hover:bg-[#1aa34a] text-white rounded-xl">
                        Get started
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
