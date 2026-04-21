import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Loader2, Music, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function CallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithCallback } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const called = useRef(false);

  useEffect(() => {
    // Guard against React StrictMode double-invoke
    if (called.current) return;
    called.current = true;

    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError(
        errorParam === "access_denied"
          ? "You declined the Spotify permission request."
          : `Spotify returned an error: ${errorParam}`,
      );
      return;
    }

    if (!code) {
      setError("No authorization code received from Spotify.");
      return;
    }

    loginWithCallback(code)
      .then(() => navigate("/", { replace: true }))
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setError(`Failed to sign in: ${msg}`);
      });
  }, [searchParams, loginWithCallback, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 max-w-md w-full text-center space-y-4">
          <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Sign-in failed
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{error}</p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="mt-2 w-full bg-[#1DB954] hover:bg-[#1aa34a] text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-5">
        <div className="w-16 h-16 bg-[#1DB954]/10 dark:bg-[#1DB954]/30 rounded-2xl flex items-center justify-center">
          <Music className="w-8 h-8 text-[#1DB954]" />
        </div>
        <Loader2 className="w-8 h-8 animate-spin text-[#1DB954]" />
        <div className="text-center">
          <p className="font-semibold text-gray-800 dark:text-gray-200">
            Connecting your Spotify…
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Fetching your playlists
          </p>
        </div>
      </div>
    </div>
  );
}
