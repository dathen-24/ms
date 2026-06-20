import { useNavigate } from "react-router-dom";
import { useUserData } from "../context/UserContext";
import { usePlaylistData } from "../context/PlaylistContext";
import { useState } from "react";

const Sidebar = () => {
  const navigate = useNavigate();

  const { user } = useUserData();

  const { playlists, createPlaylist } = usePlaylistData();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");

  const handleCreatePlaylist = async () => {
    if (!playlistName.trim()) return;

    const playlist = await createPlaylist(
      playlistName,
      ""
    );

    if (playlist) {
      setPlaylistName("");
      setShowCreateModal(false);

      navigate(`/playlist/${playlist._id}`);
    }
  };

  return (
    <>
      <div className="w-[25%] h-full hidden lg:flex flex-col gap-2">
        {/* Navigation */}
        <div className="bg-zinc-900 rounded-xl p-4">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 cursor-pointer transition-all"
          >
            <img
              src="/home.png"
              alt=""
              className="w-6"
            />

            <p className="font-semibold">
              Home
            </p>
          </div>
        </div>

        {/* Library */}
        <div className="flex-1 bg-zinc-900 rounded-xl p-4 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img
                src="/stack.png"
                className="w-6"
                alt=""
              />

              <p className="font-semibold">
                Playlists
              </p>
            </div>

            <div className="flex items-center gap-2">
              <img
                onClick={() =>
                  setShowCreateModal(true)
                }
                src="/plus.png"
                className="w-5 cursor-pointer opacity-70 hover:opacity-100"
                alt=""
              />
            </div>
          </div>

          {playlists.length === 0 ? (
            <div className="text-zinc-400 text-sm">
              No playlists yet
            </div>
          ) : (
            <div className="space-y-2 overflow-y-auto">
              {playlists.map((playlist) => (
                <div
                  key={playlist._id}
                  onClick={() =>
                    navigate(
                      `/playlist/${playlist._id}`
                    )
                  }
                  className="p-3 rounded-lg hover:bg-zinc-800 cursor-pointer transition"
                >
                  <p className="font-medium truncate">
                    {playlist.name}
                  </p>

                  <p className="text-xs text-zinc-400">
                    {playlist.songs.length} songs
                  </p>
                </div>
              ))}
            </div>
          )}

          {user?.role === "admin" && (
            <button
              onClick={() =>
                navigate("/admin/dashboard")
              }
              className="w-full mt-4 px-4 py-2 bg-green-500 hover:bg-green-400 text-black rounded-full font-semibold transition"
            >
              Admin Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-zinc-900 p-6 rounded-xl w-[400px]">
            <h2 className="text-xl font-bold mb-4">
              Create Playlist
            </h2>

            <input
              value={playlistName}
              onChange={(e) =>
                setPlaylistName(e.target.value)
              }
              placeholder="Playlist Name"
              className="
                w-full
                p-3
                rounded
                bg-zinc-800
                border
                border-zinc-700
                outline-none
              "
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() =>
                  setShowCreateModal(false)
                }
                className="px-4 py-2 text-zinc-300"
              >
                Cancel
              </button>

              <button
                onClick={handleCreatePlaylist}
                className="
                  px-4
                  py-2
                  bg-green-500
                  text-black
                  rounded
                  font-semibold
                "
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
