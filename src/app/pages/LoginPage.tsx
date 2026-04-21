import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Music, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginWithSpotify, loginWithEmail } = useAuth();
  const [spotifyLoading, setSpotifyLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSpotifyLogin = async () => {
    setSpotifyLoading(true);
    setError("");
    try {
      await loginWithSpotify();
      // Browser redirects to Spotify — code below never runs
    } catch {
      setError("Failed to connect with Spotify. Please try again.");
      setSpotifyLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setEmailLoading(true);
    setError("");
    try {
      await loginWithEmail(email, password);
      navigate("/");
    } catch {
      setError("Invalid email or password.");
      setEmailLoading(false);
    }
  };

  const isDisabled = spotifyLoading || emailLoading;

  return (
    <div className="min-h-screen flex">
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0f5a2a] via-[#1DB954] to-[#0d4a22] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-[#1DB954]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full bg-[#1DB954]/20 blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Music className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-white">Playlistify</span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-6">
          {/* Mini bento illustration */}
          <div className="flex gap-2 mb-2">
            {[
              "w-20 h-20",
              "w-14 h-14 self-end",
              "w-10 h-24",
              "w-24 h-10 self-end",
              "w-10 h-10 self-end",
            ].map((cls, i) => (
              <div key={i} className={`bg-white/10 rounded-lg ${cls}`} />
            ))}
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight">
            Your music,
            <br />
            beautifully organized.
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-md">
            Import your Spotify playlists and display them in a stunning bento
            grid. Discover, organize, and share your sound.
          </p>
        </div>

        {/* Social proof */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-2">
            {["AR", "JM", "SK", "TL"].map((init) => (
              <div
                key={init}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1DB954] to-[#1aa34a] flex items-center justify-center text-xs font-semibold text-white border-2 border-[#0d4a22]"
              >
                {init}
              </div>
            ))}
          </div>
          <p className="text-white/60 text-sm">
            Join <span className="text-white font-semibold">10,000+</span> music
            lovers
          </p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Music className="w-7 h-7 text-[#1DB954]" />
            <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
              Playlistify
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            Welcome back
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Sign in to your account to continue
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm rounded-lg px-4 py-3 mb-6">
              {error}
            </div>
          )}

          {/* Spotify SSO */}
          <button
            onClick={handleSpotifyLogin}
            disabled={isDisabled}
            className="w-full flex items-center justify-center gap-3 bg-[#1DB954] hover:bg-[#1aa34a] text-white font-semibold py-3.5 px-6 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed mb-6"
          >
            {spotifyLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Connecting to Spotify…
              </>
            ) : (
              <>
                <SpotifyIcon />
                Continue with Spotify
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-gray-950 px-4 text-gray-400 dark:text-gray-500">
                or continue with email
              </span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isDisabled}
                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm text-[#1DB954] hover:text-[#1aa34a]"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isDisabled}
                  className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 pr-12 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1DB954] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isDisabled}
              className="w-full bg-[#1DB954] hover:bg-[#1aa34a] text-white rounded-xl font-semibold"
            >
              {emailLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            New to Playlistify?{" "}
            <Link
              to="/signup"
              className="text-[#1DB954] font-semibold hover:text-[#1aa34a]"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
