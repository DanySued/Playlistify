import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { Playlist } from "../../types";

interface PlaylistCardProps {
  playlist: Playlist;
  onCardClick: (playlist: Playlist) => void;
}

const sizeClasses: Record<Playlist["size"], string> = {
  small: "col-span-1 row-span-1",
  medium: "col-span-1 row-span-1",
  large: "col-span-2 row-span-2",
  wide: "col-span-2 row-span-1",
  tall: "col-span-1 row-span-2",
};

const variants = {
  card: {
    rest: { y: 0, scale: 1 },
    hover: { y: -4, scale: 1.01 },
  },
  description: {
    rest: { opacity: 0, y: 8 },
    hover: { opacity: 1, y: 0 },
  },
  border: {
    rest: { borderColor: "rgba(255, 255, 255, 0)" },
    hover: { borderColor: "rgba(255, 255, 255, 0.3)" },
  },
};

export function PlaylistCard({ playlist, onCardClick }: PlaylistCardProps) {
  const { name, description, imageUrl, size = "medium" } = playlist;

  return (
    <motion.div
      role="button"
      onClick={() => onCardClick(playlist)}
      className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer h-full ${sizeClasses[size]}`}
      variants={variants.card}
      initial="rest"
      whileHover="hover"
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="absolute inset-0">
        <ImageWithFallback
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <h3 className="text-white font-bold text-2xl mb-2">{name}</h3>
        <motion.p
          className="text-white/90 text-sm leading-relaxed"
          variants={variants.description}
          transition={{ duration: 0.2 }}
        >
          {description}
        </motion.p>
      </div>

      <motion.div
        className="absolute inset-0 border-2 rounded-xl pointer-events-none"
        variants={variants.border}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
