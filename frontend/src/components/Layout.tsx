import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Player from "./Player";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen bg-black/30 text-white overflow-hidden">
      {/* Main Area */}{" "}
      <div className="h-[calc(100vh-90px)] flex gap-2 p-2">
        {" "}
        <Sidebar />
        <main
          className="
         flex-1
    rounded-xl
    overflow-y-auto
    h-full
    bg-gradient-to-b from-zinc-800 to-zinc-900
      "
        >
          <Navbar />

          <div className="px-6 pb-8">{children}</div>
        </main>
      </div>
      <Player />
    </div>
  );
};

export default Layout;
