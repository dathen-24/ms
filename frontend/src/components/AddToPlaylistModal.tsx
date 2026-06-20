import React, { useEffect } from "react";
import { Song } from "../context/SongContext";
import { usePlaylistData } from "../context/PlaylistContext";
import { FaTimes } from "react-icons/fa";

interface AddToPlaylistModalProps {
  song: Song | null;
  onClose: () => void;
}

const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  song,
  onClose,
}) => {
  const {
    playlists,
    fetchMyPlaylists,
    addSongToPlaylist,
    createPlaylist,
    playlistLoading,
  } = usePlaylistData();

  useEffect(() => {
    fetchMyPlaylists();
  }, []);

  if (!song) return null;

  const handleAddToPlaylist = async (playlistId: string) => {
    await addSongToPlaylist(playlistId, song);
    onClose();
  };

  const handleCreateDefaultPlaylist = async () => {
    const newPlaylist = await createPlaylist("My Playlist", "Default playlist");

    if (newPlaylist) {
      await addSongToPlaylist(newPlaylist._id, song);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-[90%] max-w-md bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white">Add to Playlist</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-800 transition"
          >
            <FaTimes className="text-zinc-400" />
          </button>
        </div>

        {/* Song Info */}
        <div className="p-6">
          <div className="flex gap-4 items-center mb-6">
            <img
              src={song.thumbnail || "/download.jpeg"}
              alt={song.title}
              className="w-16 h-16 rounded-lg object-cover shadow-lg"
            />

            <div className="flex-1">
              <h3 className="font-semibold text-white truncate">
                {song.title}
              </h3>

              <p className="text-sm text-zinc-400 mt-1">
                {song.description?.slice(0, 60)}
              </p>
            </div>
          </div>

          {playlistLoading ? (
            <p className="text-zinc-400">Loading playlists...</p>
          ) : playlists.length === 0 ? (
            <div>
              <p className="text-zinc-400 mb-4">
                You don't have any playlists yet.
              </p>

              <button
                onClick={handleCreateDefaultPlaylist}
                className="
            w-full
            py-3
            rounded-full
            bg-green-500
            hover:bg-green-400
            text-black
            font-bold
            transition
          "
              >
                Create My Playlist
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {playlists.map((playlist) => (
                <button
                  key={playlist._id}
                  onClick={() => handleAddToPlaylist(playlist._id)}
                  className="
              w-full
              p-4
              rounded-xl
              bg-zinc-800
              hover:bg-zinc-700
              transition-all
              text-left
            "
                >
                  <p className="font-semibold text-white">{playlist.name}</p>

                  <p className="text-sm text-zinc-400 mt-1">
                    {playlist.songs.length} songs
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
