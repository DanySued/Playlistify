import { useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import {
  Music2,
  ArrowRight,
  Folder,
  Sparkles,
  ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Navigation } from "../components/Navigation";
import { mockPlaylists } from "../../data/playlists";

const features = [
  {
    icon: Folder,
    title: "Smart Folders",
    description:
      "Organize playlists by mood, genre, or activity. Custom icons, colors, and filters — your library, your rules.",
    accent: "text-violet-400",
    bg: "bg-violet-400/10",
  },
  {
    icon: ImageIcon,
    title: "Cover Art Editor",
    description:
      "Browse millions of photos from Pexels to find the perfect cover for every playlist, no design skills needed.",
    accent: "text-[#1DB954]",
    bg: "bg-[#1DB954]/10",
  },
  {
    icon: Sparkles,
    title: "AI Descriptions",
    description:
      "Let AI craft the perfect vibe description for your playlists in seconds. Smart, personal, on-brand.",
    accent: "text-amber-400",
    bg: "bg-amber-400/10",
  },
];

const steps = [
  {
    number: "01",
    title: "Connect Spotify",
    description:
      "Link your account with one click and import your full library instantly — no manual entry.",
  },
  {
    number: "02",
    title: "Organize Everything",
    description:
      "Create folders, assign playlists, and build a visual library you'll actually enjoy browsing.",
  },
  {
    number: "03",
    title: "Make It Yours",
    description:
      "Customize covers, write AI-powered descriptions, and share your collection with the world.",
  },
];

const previewPlaylists = mockPlaylists.slice(0, 8);

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navigation />

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-8 pt-24 pb-16">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1DB954]/8 via-transparent to-violet-900/8" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#1DB954]/4 rounded-full blur-3xl" />

        <div className="relative max-w-[860px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#1DB954] bg-[#1DB954]/10 border border-[#1DB954]/20 px-4 py-2 rounded-full mb-8">
              <Music2 className="w-3.5 h-3.5" />
              Spotify-Powered Playlist Manager
            </span>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              Your music library,{" "}
              <span className="bg-gradient-to-r from-[#1DB954] to-[#1ed760] bg-clip-text text-transparent">
                beautifully organized.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-white/55 max-w-xl mx-auto mb-10 leading-relaxed">
              Connect Spotify, build smart folders, and customize your playlists
              with AI descriptions and stunning cover art.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button
                onClick={() => navigate("/app")}
                className="w-full sm:w-auto bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold px-8 py-6 text-base rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#1DB954]/20 hover:shadow-[#1DB954]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Explore the app
                <ArrowRight className="w-4 h-4" />
              </Button>
              <button
                onClick={() => navigate("/signup")}
                className="w-full sm:w-auto bg-transparent border border-white/15 hover:bg-white/8 text-white/70 hover:text-white px-8 py-[22px] text-base rounded-xl transition-all duration-200 font-medium"
              >
                Create free account
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-white/30">
              {["Free to use", "No credit card", "Spotify integration"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1DB954]/60" />
                    {item}
                  </span>
                )
              )}
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/20 tracking-widest uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent"
          />
        </motion.div>
      </section>

      {/* ─── App Preview ─── */}
      <section className="py-12 sm:py-20 px-4 sm:px-8">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl overflow-hidden border border-white/8 bg-[#111111] p-4 sm:p-6 shadow-2xl shadow-black/60"
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 mb-4 sm:mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-[#1DB954]/50" />
              <div className="ml-4 flex-1 max-w-[200px] bg-white/5 rounded-md h-6 flex items-center px-3 gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#1DB954]/40" />
                <span className="text-xs text-white/25">playlistify.app</span>
              </div>
            </div>

            {/* Mini grid preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 auto-rows-[140px] sm:auto-rows-[180px] grid-flow-dense">
              {previewPlaylists.map((playlist, i) => {
                const isLarge = i === 0;
                const isWide = i === 3;
                const isTall = i === 5;
                const cls = isLarge
                  ? "col-span-2 row-span-2"
                  : isWide
                    ? "col-span-2 row-span-1"
                    : isTall
                      ? "col-span-1 row-span-2 hidden sm:block"
                      : "col-span-1 row-span-1";

                return (
                  <div
                    key={playlist.id}
                    className={`relative overflow-hidden rounded-xl ${cls}`}
                  >
                    <ImageWithFallback
                      src={playlist.imageUrl}
                      alt={playlist.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                      <p className="text-white font-semibold text-xs sm:text-sm truncate">
                        {playlist.name}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-[#1DB954] text-xs font-semibold tracking-widest uppercase mb-3">
              Everything you need
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Built for music lovers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#111111] border border-white/8 rounded-2xl p-6 sm:p-8 hover:border-white/15 transition-colors duration-300"
              >
                <div
                  className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-5`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.accent}`} />
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/45 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section
        id="how-it-works"
        className="py-16 sm:py-24 px-4 sm:px-8 border-t border-white/5"
      >
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <p className="text-[#1DB954] text-xs font-semibold tracking-widest uppercase mb-3">
              Simple setup
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Up and running in minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 relative">
            {/* Connector line, desktop only */}
            <div className="hidden sm:block absolute top-5 left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-px bg-gradient-to-r from-white/10 via-white/5 to-white/10" />

            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col items-center sm:items-start text-center sm:text-left"
              >
                <div className="relative z-10 w-10 h-10 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/25 flex items-center justify-center text-[#1DB954] text-xs font-bold mb-4">
                  {step.number}
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  {step.title}
                </h3>
                <p className="text-white/45 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden bg-gradient-to-br from-[#1DB954]/12 via-[#1DB954]/5 to-transparent border border-[#1DB954]/15 rounded-3xl p-8 sm:p-16 text-center"
          >
            <div className="pointer-events-none absolute -top-32 -right-32 w-64 h-64 bg-[#1DB954]/8 rounded-full blur-3xl" />
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 relative">
              Ready to organize your library?
            </h2>
            <p className="text-white/45 text-base sm:text-lg mb-8 max-w-md mx-auto relative">
              Connect Spotify and start building the music library you always
              wanted.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 relative">
              <Button
                onClick={() => navigate("/app")}
                className="w-full sm:w-auto bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold px-8 py-5 text-base rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Browse demo
              </Button>
              <button
                onClick={() => navigate("/signup")}
                className="w-full sm:w-auto bg-transparent border border-white/15 hover:bg-white/8 text-white/70 hover:text-white px-8 py-[18px] text-base rounded-xl transition-all duration-200 font-medium"
              >
                Create free account
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/5 py-8 px-4 sm:px-8">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Music2 className="w-4 h-4 text-[#1DB954]" />
            <span className="text-sm font-semibold text-white/50">
              Playlistify
            </span>
          </div>
          <p className="text-xs text-white/25 order-last sm:order-none">
            © 2026 Playlistify. Built with love for music.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="text-xs text-white/35 hover:text-white/70 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-xs text-white/35 hover:text-white/70 transition-colors"
            >
              Sign up
            </Link>
            <Link
              to="/app"
              className="text-xs text-white/35 hover:text-white/70 transition-colors"
            >
              App
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
