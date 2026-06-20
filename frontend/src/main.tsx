import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SongProvider } from "./context/SongContext.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import { PlaylistProvider } from "./context/PlaylistContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UserProvider>
      <SongProvider>
        <PlaylistProvider>
          <App />
        </PlaylistProvider>
      </SongProvider>
    </UserProvider>
  </StrictMode>,
);
