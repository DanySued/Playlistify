# Playlistify

React + Vite + TypeScript SPA. Spotify playlist manager with masonry UI, boards, labels, and AI features.

## Stack
- React 18, React Router 7, TypeScript 5.7, Vite 6
- Tailwind CSS 4 + custom CSS (`src/styles/playlistify.css`, `src/styles/theme.css`)
- Radix UI primitives, Lucide icons, Framer Motion
- Gemini API (`src/lib/gemini.ts`) for AI features

## Key files
- `src/types.ts` — all shared interfaces (`Playlist`, `Track`, `Board`, `Label`, `SpotifyAPIPlaylist`, etc.)
- `src/lib/spotify.ts` — all Spotify API calls
- `src/app/context/AuthContext.tsx` — auth state, playlist state, `apiPlaylistToLocal()`, `mergePlaylists()`
- `src/app/context/AppStore.tsx` — boards, labels, selection state (localStorage-persisted)
- `src/app/components/PlaylistCard.tsx` — masonry card for playlists
- `src/app/pages/HomePage.tsx` — main playlist grid

## Data flow
Spotify API → `getSpotifyPlaylists()` → `apiPlaylistToLocal()` → `mergePlaylists(fresh, saved)` → React state + localStorage

`mergePlaylists` keeps `boardIds`/`labelIds` from saved, everything else from fresh (including `totalTracks`).

## Deploy
After every change: `git add <files> && git commit && git push origin main && vercel deploy --prod --yes`

## Conventions
- No test suite — verify UI manually in browser
- No comments unless the WHY is non-obvious
- `src/app/components/ui/` — shadcn/Radix wrappers, don't modify
- Playlists persisted in `localStorage` key `spotify_playlists`; tokens in `spotify_access_token` / `spotify_refresh_token` / `spotify_expires_at`
