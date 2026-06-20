import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useSongData } from "../context/SongContext";
import { useUserData } from "../context/UserContext";
import { usePlaylistData } from "../context/PlaylistContext";
import { FaBookmark, FaPlay, FaTrash, FaEdit, FaGlobeAmericas, FaLock } from "react-icons/fa";
import Loading from "../components/Loading";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const playlistServer = import.meta.env.VITE_PLAYLIST_API;

const PlayList = () => {
  const { setIsPlaying, setQueue,
  setCurrentIndex, } = useSongData();
  const { isAuth } = useUserData();

  const handleDeletePlaylist = async () => {
  if (!currentPlaylist) return;

  await deletePlaylist(currentPlaylist._id);

  navigate("/");
};

  const {
    playlists,
    playlistLoading,
    fetchMyPlaylists,
    removeSongFromPlaylist,
    deletePlaylist,
    updatePlaylist,
  } = usePlaylistData();

  const { id } = useParams();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false); 
  const [editName, setEditName] = useState(""); 
  const [editDescription, setEditDescription] = useState("");
  const [editCoverImage, setEditCoverImage] = useState("");

const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (isAuth) {
      fetchMyPlaylists();
    }
  }, [isAuth, id]);

  const currentPlaylist =
  playlists.find((p) => p._id === id);
  if (!currentPlaylist) {
  return <div>Playlist not found</div>;
}
  console.log("CURRENT PLAYLIST:", currentPlaylist);

const currentSongs =
  currentPlaylist?.songs || [];

const handleOpenEdit = () => {
  if (!currentPlaylist) return;

  setEditName(currentPlaylist.name);
  setEditDescription(
    currentPlaylist.description
  );
setEditCoverImage(
  currentPlaylist.coverImage || ""
);

setIsPublic(
  currentPlaylist.isPublic
);
  setShowEditModal(true);
};

const handleSaveEdit = async () => {
  if (!currentPlaylist) return;

  await updatePlaylist(
  currentPlaylist._id,
  editName,
  editDescription,
  isPublic,
  editCoverImage
);

  setShowEditModal(false);
};

const handleCoverUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const formData = new FormData();

  formData.append("file", file);

const { data } = await axios.post(
  `${playlistServer}/api/v1/playlist/upload-cover`,
  formData,
  {
    headers: {
      token: localStorage.getItem("token"),
    },
  }
);

  setEditCoverImage(data.imageUrl);
};

const playlistQueue = currentSongs.map(
  (s) => ({
    id: s.songId,
    title: s.title,
    description: s.description || "",
    thumbnail: s.thumbnail || "",
    audio: s.audio || "",
    album: "",
  })
);

    if (
  !playlistLoading &&
  playlists.length > 0 &&
  !currentPlaylist
) 

{
  return (
    <Layout>
      <div className="mt-20 text-center text-zinc-400">
        Playlist not found
      </div>
    </Layout>
  );
}
  return (
    <Layout>
      {playlistLoading ? (
        <Loading />
      ) : (
        <>
<div
  className="
    mt-6
    rounded-2xl
    bg-gradient-to-b
    from-zinc-800
    to-zinc-900
    p-8
  "
>
  <div className="flex flex-col md:flex-row gap-8 items-end">

    <div
      className="
        w-64
        h-64
        rounded-xl
        overflow-hidden
        shadow-2xl
        bg-zinc-800
        flex
        items-center
        justify-center
      "
    >
      {currentPlaylist?.coverImage ? (
        <img
          src={currentPlaylist.coverImage}
          alt={currentPlaylist.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <FaBookmark className="text-8xl text-zinc-500" />
      )}
    </div>

    <div className="flex-1">

      <p className="uppercase text-sm tracking-widest">
        Playlist
      </p>

      <h1
        className="
          text-6xl
          md:text-6xl
          font-semibold
          mt-2
        "
      >
        {currentPlaylist?.name}
      </h1>

      <p className="mt-4 text-zinc-300">
        {currentPlaylist?.description}
      </p>

      <div
  className="
    flex
    items-center
    gap-4
    mt-4
    text-zinc-400
  "
>
  <span>
    {currentPlaylist?.songs.length} songs
  </span>

  <span>•</span>

  {currentPlaylist?.isPublic ? (
    <div className="flex items-center gap-2">
      <FaGlobeAmericas/>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <FaLock />
    </div>
  )}
</div>
    </div>
  </div>

  <div className="flex items-center justify-between mt-8">
    {/* Left */}
    <button
onClick={() => {
  if (playlistQueue.length === 0) return;

  setQueue(playlistQueue);
  setCurrentIndex(0);
  setIsPlaying(true);
}}
      className="
      w-14
      h-14
      rounded-full
      bg-green-500
      text-black
      flex
      items-center
      justify-center
      text-xl
      hover:scale-105
      transition
    "
    >
      <FaPlay />
    </button>
    
    {/* Right */}
    <div className="flex gap-3">
    <button
      onClick={handleOpenEdit}
      className="
        w-12
        h-12
        rounded-full
        bg-zinc-800
        hover:bg-zinc-700
        flex
        items-center
        justify-center
      "
    >
      <FaEdit />
    </button>

    <button
      onClick={handleDeletePlaylist}
      className="
        w-12
        h-12
        rounded-full
        bg-zinc-800
        hover:bg-red-500
        flex
        items-center
        justify-center
      "
    >
      <FaTrash />
    </button>
</div>
  </div>

<div
  className="
    mt-8
    grid
    grid-cols-[60px_2fr_2fr_120px]
    px-4
    py-3
    text-zinc-400
    border-b
    border-zinc-700
  "
>
  <p>#</p>
  <p>Title</p>
  <p>Description</p>
</div>

              <hr />

              {currentSongs.length === 0 ? (
                <p className="text-center mt-10 text-slate-400">
                  This playlist is empty
                </p>
              ) : (
                currentSongs.map((song, index) => {
                  return (
                    <div
  key={song.songId}
onClick={() => {
  setQueue(playlistQueue);
  setCurrentIndex(index);
  setIsPlaying(true);
}}
  className="
    grid
    grid-cols-[60px_2fr_2fr_120px]
    items-center
    px-4
    py-3
    rounded-lg
    hover:bg-white/10
    transition
  "
>
  <p>{index + 1}</p>

  <div className="flex items-center gap-4">
    <img
      src={song.thumbnail}
      className="
        w-12
        h-12
        rounded
        object-cover
      "
      alt=""
    />

    <p className="text-white">
      {song.title}
    </p>
  </div>

  <p className="truncate text-zinc-400">
    {song.description}
  </p>

  <div className="flex items-center gap-4">

    <button
  className="text-white"
  onClick={(e) => {
    e.stopPropagation();

    removeSongFromPlaylist(
      currentPlaylist._id,
      song.songId
    );
  }}
>
  <FaTrash />
</button>
  </div>
</div>
                  );
                })
              )}
              </div>
            </>
          )}

{showEditModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
    <div
  className="
    bg-[#181818]
    p-8
    rounded-2xl
    w-[550px]
    border
    border-zinc-700
    shadow-2xl
  "
>
      <h2 className="text-xl font-bold mb-4">
        Edit Playlist
      </h2>

      <input
        value={editName}
        onChange={(e) =>
          setEditName(e.target.value)
        }
        placeholder="Playlist Name"
        className="
          w-full
          p-3
          rounded
          bg-zinc-800
          mb-3
        "
      />

      <textarea
        value={editDescription}
        onChange={(e) =>
          setEditDescription(
            e.target.value
          )
        }
        placeholder="Description"
        className="
          w-full
          p-3
          rounded
          bg-zinc-800
          h-28
        "
      />
  <input
  type="file"
  accept="image/*"
  onChange={handleCoverUpload}
  className="
    w-full
    p-3
    rounded
    bg-zinc-800
    mt-3
  "
/>
  
{
  editCoverImage && (
    <img
  src={editCoverImage}
  className="
    mt-4
    w-full
    h-52
    object-cover
    rounded-xl
  "
/>
  )
}

<label className="flex items-center gap-2 mt-4">
  <input
    type="checkbox"
    checked={isPublic}
    onChange={(e) =>
      setIsPublic(
        e.target.checked
      )
    }
  />

  Public Playlist
</label>

      <div className="flex justify-end gap-2 mt-4">
        <button
        className="px-4 py-2 text-zinc-300"
          onClick={() =>
            setShowEditModal(false)
          }
        >
          Cancel
        </button>

        <button
          onClick={handleSaveEdit}
          className="
            px-4
                  py-2
                  bg-green-500
                  text-black
                  rounded
                  font-semibold
          "
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
    </Layout>
  );
};

export default PlayList;
