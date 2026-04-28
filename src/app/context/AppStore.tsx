import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Board, Label, RadioStation, AppSettings, Playlist } from "../../types";

const DEFAULT_SETTINGS: AppSettings = {
  treatAlbumsAsPlaylists: false,
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY ?? "",
  artistNotifications: [],
  darkMode: false,
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

interface AppStoreContextType {
  boards: Board[];
  labels: Label[];
  radioStations: RadioStation[];
  settings: AppSettings;

  // Boards
  createBoard: (name: string, description?: string, secret?: boolean) => Board;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  archiveBoard: (id: string, archived: boolean) => void;
  addPlaylistToBoard: (boardId: string, playlistId: string) => void;
  removePlaylistFromBoard: (boardId: string, playlistId: string) => void;

  // Labels
  createLabel: (name: string, color: string) => Label;
  deleteLabel: (id: string) => void;
  addLabelToPlaylist: (playlistId: string, labelId: string, playlists: Playlist[], setPlaylists: (p: Playlist[]) => void) => void;
  removeLabelFromPlaylist: (playlistId: string, labelId: string, playlists: Playlist[], setPlaylists: (p: Playlist[]) => void) => void;

  // Radio stations
  createRadioStation: (name: string, playlistIds: string[]) => RadioStation;
  updateRadioStation: (id: string, updates: Partial<RadioStation>) => void;
  deleteRadioStation: (id: string) => void;

  // Settings
  updateSettings: (updates: Partial<AppSettings>) => void;

  // Multi-select
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  clearSelection: () => void;
  selectAll: (ids: string[]) => void;
}

const AppStoreContext = createContext<AppStoreContextType | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [boards, setBoards] = useState<Board[]>(() =>
    load("pfy_boards", [])
  );
  const [labels, setLabels] = useState<Label[]>(() =>
    load("pfy_labels", [])
  );
  const [radioStations, setRadioStations] = useState<RadioStation[]>(() =>
    load("pfy_radio", [])
  );
  const [settings, setSettings] = useState<AppSettings>(() =>
    load("pfy_settings", DEFAULT_SETTINGS)
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // ── Boards ──────────────────────────────────────────────────────────────────
  const createBoard = useCallback((name: string, description = "", secret = false): Board => {
    const board: Board = {
      id: crypto.randomUUID(),
      name,
      description,
      playlistIds: [],
      labelIds: [],
      archived: false,
      createdAt: Date.now(),
      secret,
    };
    setBoards((prev) => {
      const next = [...prev, board];
      save("pfy_boards", next);
      return next;
    });
    return board;
  }, []);

  const updateBoard = useCallback((id: string, updates: Partial<Board>) => {
    setBoards((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, ...updates } : b));
      save("pfy_boards", next);
      return next;
    });
  }, []);

  const deleteBoard = useCallback((id: string) => {
    setBoards((prev) => {
      const next = prev.filter((b) => b.id !== id);
      save("pfy_boards", next);
      return next;
    });
  }, []);

  const archiveBoard = useCallback((id: string, archived: boolean) => {
    setBoards((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, archived } : b));
      save("pfy_boards", next);
      return next;
    });
  }, []);

  const addPlaylistToBoard = useCallback((boardId: string, playlistId: string) => {
    setBoards((prev) => {
      const next = prev.map((b) =>
        b.id === boardId && !b.playlistIds.includes(playlistId)
          ? { ...b, playlistIds: [...b.playlistIds, playlistId] }
          : b
      );
      save("pfy_boards", next);
      return next;
    });
  }, []);

  const removePlaylistFromBoard = useCallback((boardId: string, playlistId: string) => {
    setBoards((prev) => {
      const next = prev.map((b) =>
        b.id === boardId
          ? { ...b, playlistIds: b.playlistIds.filter((id) => id !== playlistId) }
          : b
      );
      save("pfy_boards", next);
      return next;
    });
  }, []);

  // ── Labels ──────────────────────────────────────────────────────────────────
  const createLabel = useCallback((name: string, color: string): Label => {
    const label: Label = { id: crypto.randomUUID(), name, color };
    setLabels((prev) => {
      const next = [...prev, label];
      save("pfy_labels", next);
      return next;
    });
    return label;
  }, []);

  const deleteLabel = useCallback((id: string) => {
    setLabels((prev) => {
      const next = prev.filter((l) => l.id !== id);
      save("pfy_labels", next);
      return next;
    });
  }, []);

  const addLabelToPlaylist = useCallback(
    (playlistId: string, labelId: string, playlists: Playlist[], setPlaylists: (p: Playlist[]) => void) => {
      setPlaylists(
        playlists.map((p) =>
          p.id === playlistId && !p.labelIds.includes(labelId)
            ? { ...p, labelIds: [...p.labelIds, labelId] }
            : p
        )
      );
    },
    []
  );

  const removeLabelFromPlaylist = useCallback(
    (playlistId: string, labelId: string, playlists: Playlist[], setPlaylists: (p: Playlist[]) => void) => {
      setPlaylists(
        playlists.map((p) =>
          p.id === playlistId
            ? { ...p, labelIds: p.labelIds.filter((id) => id !== labelId) }
            : p
        )
      );
    },
    []
  );

  // ── Radio ───────────────────────────────────────────────────────────────────
  const createRadioStation = useCallback((name: string, playlistIds: string[]): RadioStation => {
    const station: RadioStation = {
      id: crypto.randomUUID(),
      name,
      playlistIds,
      podcasts: [],
      frequencyMinutes: 30,
    };
    setRadioStations((prev) => {
      const next = [...prev, station];
      save("pfy_radio", next);
      return next;
    });
    return station;
  }, []);

  const updateRadioStation = useCallback((id: string, updates: Partial<RadioStation>) => {
    setRadioStations((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
      save("pfy_radio", next);
      return next;
    });
  }, []);

  const deleteRadioStation = useCallback((id: string) => {
    setRadioStations((prev) => {
      const next = prev.filter((s) => s.id !== id);
      save("pfy_radio", next);
      return next;
    });
  }, []);

  // ── Settings ────────────────────────────────────────────────────────────────
  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      save("pfy_settings", next);
      return next;
    });
  }, []);

  // ── Multi-select ────────────────────────────────────────────────────────────
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  return (
    <AppStoreContext.Provider
      value={{
        boards,
        labels,
        radioStations,
        settings,
        createBoard,
        updateBoard,
        deleteBoard,
        archiveBoard,
        addPlaylistToBoard,
        removePlaylistFromBoard,
        createLabel,
        deleteLabel,
        addLabelToPlaylist,
        removeLabelFromPlaylist,
        createRadioStation,
        updateRadioStation,
        deleteRadioStation,
        updateSettings,
        selectedIds,
        toggleSelect,
        clearSelection,
        selectAll,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
