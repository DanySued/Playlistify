import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AuthProvider } from "./context/AuthContext";
import { AppStoreProvider } from "./context/AppStore";
import { Toaster } from "sonner";
import AppLayout from "./components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import BoardsPage from "./pages/BoardsPage";
import BoardDetailPage from "./pages/BoardDetailPage";
import PlaylistDetailPage from "./pages/PlaylistDetailPage";
import DiscoverPage from "./pages/DiscoverPage";
import RadioPage from "./pages/RadioPage";
import LoginPage from "./pages/LoginPage";
import CallbackPage from "./pages/CallbackPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppStoreProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--bg)",
                border: "1px solid var(--border)",
                color: "var(--text)",
                borderRadius: "12px",
              },
            }}
          />
          <DndProvider backend={HTML5Backend}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/callback" element={<CallbackPage />} />
              <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/boards" element={<BoardsPage />} />
                <Route path="/boards/:id" element={<BoardDetailPage />} />
                <Route path="/playlist/:id" element={<PlaylistDetailPage />} />
                <Route path="/discover" element={<DiscoverPage />} />
                <Route path="/radio" element={<RadioPage />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </DndProvider>
        </AppStoreProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
