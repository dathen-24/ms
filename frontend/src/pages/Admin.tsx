import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "../context/UserContext";
import { useSongData } from "../context/SongContext";
import axios from "axios";
import toast from "react-hot-toast";
import { MdDelete, MdEdit } from "react-icons/md";

const server = "http://localhost:7000";

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useUserData();

  const { albums, songs, fetchAlbums, fetchSongs } = useSongData();

  const [albumTitle, setAlbumTitle] = useState<string>("");
  const [albumDescription, setAlbumDescription] = useState<string>("");
  const [albumFile, setAlbumFile] = useState<File | null>(null);

  const [songTitle, setSongTitle] = useState<string>("");
  const [songDescription, setSongDescription] = useState<string>("");
  const [songAlbum, setSongAlbum] = useState<string>("");
  const [songFile, setSongFile] = useState<File | null>(null);
  const [songThumbnail, setSongThumbnail] =
  useState<File | null>(null);

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [albumBtnLoading, setAlbumBtnLoading] = useState<boolean>(false);
  const [songBtnLoading, setSongBtnLoading] = useState<boolean>(false);
  const [thumbnailBtnLoading, setThumbnailBtnLoading] =
    useState<boolean>(false);
  const [deleteBtnLoading, setDeleteBtnLoading] = useState<boolean>(false);

  const [editingAlbum, setEditingAlbum] = useState<any>(null);
  const [editingSong, setEditingSong] = useState<any>(null);

  const [editAlbumTitle, setEditAlbumTitle] = useState<string>("");
  const [editAlbumDescription, setEditAlbumDescription] = useState<string>("");
  const [editAlbumFile, setEditAlbumFile] = useState<File | null>(null);

  const [editSongTitle, setEditSongTitle] = useState<string>("");
  const [editSongDescription, setEditSongDescription] = useState<string>("");
  const [editSongAlbum, setEditSongAlbum] = useState<string>("");
  const [editSongFile, setEditSongFile] = useState<File | null>(null);
  const [editSongThumbnail, setEditSongThumbnail] = useState<File | null>(null);

  const [editBtnLoading, setEditBtnLoading] = useState<boolean>(false);

  const albumFileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setAlbumFile(selectedFile);
  };

  const songFileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setSongFile(selectedFile);
  };

  const thumbnailFileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setThumbnailFile(selectedFile);
  };

  const editAlbumFileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setEditAlbumFile(selectedFile);
  };

  const editSongFileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setEditSongFile(selectedFile);
  };

  const addAlbumHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!albumFile) {
      toast.error("Please choose album thumbnail");
      return;
    }

    const formData = new FormData();
    formData.append("title", albumTitle);
    formData.append("description", albumDescription);
    formData.append("file", albumFile);

    setAlbumBtnLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/album/new`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );

      toast.success(data.message);
      fetchAlbums();

      setAlbumTitle("");
      setAlbumDescription("");
      setAlbumFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occured");
    } finally {
      setAlbumBtnLoading(false);
    }
  };

  const addSongHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!songFile) {
      toast.error("Please choose audio file");
      return;
    }

    const formData = new FormData();
    formData.append("title", songTitle);
    formData.append("description", songDescription);
    formData.append("file", songFile);
    formData.append("album", songAlbum);

    if (songThumbnail) {
  formData.append(
    "thumbnail",
    songThumbnail
  );
}

    setSongBtnLoading(true);

    try {
      const { data } = await axios.post(`${server}/api/v1/song/new`, formData, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      toast.success(data.message);
      fetchSongs();

      setSongTitle("");
      setSongDescription("");
      setSongFile(null);
      setSongThumbnail(null);
      setSongAlbum("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occured");
    } finally {
      setSongBtnLoading(false);
    }
  };

  const addThumbnailHandler = async (id: string) => {
    if (!thumbnailFile) {
      toast.error("Please choose thumbnail");
      return;
    }

    const formData = new FormData();
    formData.append("file", thumbnailFile);

    setThumbnailBtnLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/song/${id}`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );

      toast.success(data.message);
      fetchSongs();
      setThumbnailFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occured");
    } finally {
      setThumbnailBtnLoading(false);
    }
  };

  const openEditAlbum = (album: any) => {
    setEditingAlbum(album);
    setEditAlbumTitle(album.title);
    setEditAlbumDescription(album.description);
    setEditAlbumFile(null);
  };

const openEditSong = (song: any) => {
  setEditingSong(song);

  setEditSongTitle(song.title);
  setEditSongDescription(song.description);

  setEditSongAlbum(
    String(song.album_id)
  );

  setEditSongFile(null);
  setEditSongThumbnail(null);
};

  const updateAlbumHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!editingAlbum) return;

    const formData = new FormData();
    formData.append("title", editAlbumTitle);
    formData.append("description", editAlbumDescription);

    if (editAlbumFile) {
      formData.append("file", editAlbumFile);
    }

    setEditBtnLoading(true);

    try {
      const { data } = await axios.put(
        `${server}/api/v1/album/${editingAlbum.id}`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );

      toast.success(data.message);
      fetchAlbums();

      setEditingAlbum(null);
      setEditAlbumTitle("");
      setEditAlbumDescription("");
      setEditAlbumFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occured");
    } finally {
      setEditBtnLoading(false);
    }
  };

  const updateSongHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!editingSong) return;

    const formData = new FormData();
    formData.append("title", editSongTitle);
    formData.append("description", editSongDescription);
    formData.append(
  "album",
  editSongAlbum || editingSong.album_id
);

    if (editSongFile) {
      formData.append("file", editSongFile);
    }

    if (editSongThumbnail) {
  formData.append(
    "thumbnail",
    editSongThumbnail
  );
}

    setEditBtnLoading(true);

    try {
      const { data } = await axios.put(
        `${server}/api/v1/song/${editingSong.id}`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );

      toast.success(data.message);
      fetchSongs();

      setEditingSong(null);
      setEditSongTitle("");
      setEditSongDescription("");
      setEditSongAlbum("");
      setEditSongFile(null);
      setEditSongThumbnail(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occured");
    } finally {
      setEditBtnLoading(false);
    }
  };

  const deleteAlbum = async (id: string) => {
    if (confirm("Are you sure you want to delete this album?")) {
      setDeleteBtnLoading(true);

      try {
        const { data } = await axios.delete(`${server}/api/v1/album/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchSongs();
        fetchAlbums();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occured");
      } finally {
        setDeleteBtnLoading(false);
      }
    }
  };

  const deleteSong = async (id: string) => {
    if (confirm("Are you sure you want to delete this song?")) {
      setDeleteBtnLoading(true);

      try {
        const { data } = await axios.delete(`${server}/api/v1/song/${id}`, {
          headers: {
            token: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchSongs();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occured");
      } finally {
        setDeleteBtnLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-white p-8">
      <div className="mb-10 mt-6">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>

        <p className="text-zinc-400 mt-2">
          Manage albums, songs and media assets
        </p>
      </div>
      <Link
        to="/"
        className="
    inline-flex
    items-center
    gap-2
    bg-zinc-800
    hover:bg-zinc-700
    px-4
    py-2
    rounded-full
    mb-8
  "
      >
        ← Back to Homepage
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-zinc-900 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">Albums</p>
          <h2 className="text-3xl font-bold mt-2">{albums.length}</h2>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">Songs</p>
          <h2 className="text-3xl font-bold mt-2">{songs.length}</h2>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">Total Media</p>
          <h2 className="text-3xl font-bold mt-2">
            {albums.length + songs.length}
          </h2>
        </div>
      </div>

      {/* <h2 className="text-2xl font-bold mb-6 mt-6">Add Album</h2> */}
      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-5">Add Album</h2>

          <form className="flex flex-col gap-4" onSubmit={addAlbumHandler}>
            <input
              type="text"
              placeholder="Album title"
              value={albumTitle}
              onChange={(e) => setAlbumTitle(e.target.value)}
              className="
        bg-zinc-800
        border border-zinc-700
        rounded-xl
        px-4 py-3
        outline-none
        focus:border-green-500
      "
            />

            <input
              type="text"
              placeholder="Album description"
              value={albumDescription}
              onChange={(e) => setAlbumDescription(e.target.value)}
              className="
        bg-zinc-800
        border border-zinc-700
        rounded-xl
        px-4 py-3
        outline-none
        focus:border-green-500
      "
            />

            <label
              className="
        bg-zinc-800
        border border-dashed border-zinc-600
        rounded-xl
        p-6
        text-center
        cursor-pointer
        hover:border-green-500
      "
            >
              {albumFile ? albumFile.name : "Upload Album Thumbnail"}

              <input
                type="file"
                hidden
                accept="image/*"
                onChange={albumFileChangeHandler}
              />
            </label>

            <button
              disabled={albumBtnLoading}
              className="
        bg-green-500
        hover:bg-green-400
        text-black
        font-semibold
        rounded-full
        py-3
      "
            >
              {albumBtnLoading ? "Creating..." : "Create Album"}
            </button>
          </form>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-5">Add Song</h2>

          <form className="flex flex-col gap-4" onSubmit={addSongHandler}>
            <input
              type="text"
              placeholder="Title"
              className="bg-zinc-800
  border border-zinc-700
  rounded-xl
  px-4 py-3
  outline-none
  focus:border-green-500"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Description"
              className="bg-zinc-800
  border border-zinc-700
  rounded-xl
  px-4 py-3
  outline-none
  focus:border-green-500"
              value={songDescription}
              onChange={(e) => setSongDescription(e.target.value)}
              required
            />

            <select
              className="bg-zinc-800
  border border-zinc-700
  rounded-xl
  px-4 py-3
  outline-none
  focus:border-green-500"
              value={songAlbum}
              onChange={(e) => setSongAlbum(e.target.value)}
              required
            >
              <option value="">Choose Album</option>

              {albums?.map((e: any, i: number) => {
                return (
                  <option value={e.id} key={i}>
                    {e.title}
                  </option>
                );
              })}
            </select>

            <label
  className="
  bg-zinc-800
  border border-dashed border-zinc-600
  rounded-xl
  p-6
  text-center
  cursor-pointer
"
>
  <span>
    {songThumbnail
      ? songThumbnail.name
      : "Choose Thumbnail"}
  </span>

  <input
    type="file"
    accept="image/*"
    hidden
    onChange={(e) =>
      setSongThumbnail(
        e.target.files?.[0] || null
      )
    }
  />
</label>

            <label
              className="
    bg-zinc-800
    border border-dashed border-zinc-600
    rounded-xl
    p-6
    text-center
    cursor-pointer
    hover:border-green-500
  "
            >
              <span>{songFile ? songFile.name : "Choose Audio File"}</span>

              <input
                type="file"
                onChange={songFileChangeHandler}
                accept="audio/*"
                required
                className="hidden"
              />
            </label>

            <button
              disabled={songBtnLoading}
              className="
    bg-green-500
    hover:bg-green-400
    text-black
    font-semibold
    rounded-full
    py-3
  "
            >
              {songBtnLoading ? "Uploading..." : "Upload Song"}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Added Albums</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {albums?.map((e, i) => {
            return (
              <div
                className="group relative bg-zinc-900 hover:bg-zinc-800 rounded-2xl p-4 transition-all duration-300"
                key={i}
              >
                <img
                  src={e.thumbnail}
                  className="
    w-full
    aspect-square
    object-cover
    rounded-xl"
                />

                <h4 className="font-semibold mt-3 truncate">{e.title}</h4>

                <p className="text-sm text-zinc-400 truncate">
                  {e.description}
                </p>

                <div
                  className="
    absolute
    bottom-4
    right-4
    flex
    gap-2
    opacity-0
    group-hover:opacity-100
    transition"
                >
                  <button
                    disabled={editBtnLoading}
                    className="
    w-10
    h-10
    rounded-full
    bg-blue-500
    flex
    items-center
    justify-center
  "
                    onClick={() => openEditAlbum(e)}
                  >
                    <MdEdit />
                  </button>

                  <button
                    disabled={deleteBtnLoading}
                    className="
    w-10
    h-10
    rounded-full
    bg-red-500
    flex
    items-center
    justify-center
  "
                    onClick={() => deleteAlbum(e.id)}
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Added Songs</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {songs?.map((e, i) => {
            return (
              <div
                className="group relative bg-zinc-900 hover:bg-zinc-800 rounded-2xl p-4 transition-all duration-300"
                key={i}
              >
                {e.thumbnail ? (
                  <img
                    src={e.thumbnail}
                    className="w-full
    aspect-square
    object-cover
    rounded-xl"
                  />
                ) : (
                  <div className="flex flex-col justify-center items-center gap-2 w-[250px]">
                    <label className="auth-input cursor-pointer">
                      <span>
                        {thumbnailFile
                          ? thumbnailFile.name
                          : "Choose thumbnail"}
                      </span>

                      <input
                        type="file"
                        onChange={thumbnailFileChangeHandler}
                        accept="image/*"
                        className="hidden"
                      />
                    </label>

                    <button
                      className="auth-btn"
                      style={{ width: "200px" }}
                      disabled={thumbnailBtnLoading}
                      onClick={() => addThumbnailHandler(e.id)}
                    >
                      {thumbnailBtnLoading ? "Please Wait..." : "Add Thumbnail"}
                    </button>
                  </div>
                )}

                <h4 className="font-semibold mt-3 truncate">{e.title}</h4>

                <p className="text-sm text-zinc-400 truncate">
                  {e.description}
                </p>

                <div
                  className="
    absolute
    bottom-4
    right-4
    flex
    gap-2
    opacity-0
    group-hover:opacity-100
    transition"
                >
                  <button
                    disabled={editBtnLoading}
                    className="
    w-10
    h-10
    rounded-full
    bg-blue-500
    flex
    items-center
    justify-center
  "
                    onClick={() => openEditSong(e)}
                  >
                    <MdEdit />
                  </button>

                  <button
                    disabled={deleteBtnLoading}
                    className="
    w-10
    h-10
    rounded-full
    bg-red-500
    flex
    items-center
    justify-center
  "
                    onClick={() => deleteSong(e.id)}
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {editingAlbum && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <form
            onSubmit={updateAlbumHandler}
            className="bg-[#181818] p-6 rounded-lg w-[90%] max-w-lg flex flex-col gap-4"
          >
            <h2 className="text-2xl font-bold">Edit Album</h2>

            <input
              type="text"
              className="auth-input"
              value={editAlbumTitle}
              onChange={(e) => setEditAlbumTitle(e.target.value)}
              required
            />

            <input
              type="text"
              className="auth-input"
              value={editAlbumDescription}
              onChange={(e) => setEditAlbumDescription(e.target.value)}
              required
            />

            <label className="auth-input cursor-pointer">
              <span>
                {editAlbumFile
                  ? editAlbumFile.name
                  : "Choose new thumbnail optional"}
              </span>

              <input
                type="file"
                onChange={editAlbumFileChangeHandler}
                accept="image/*"
                className="hidden"
              />
            </label>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-gray-500 rounded"
                onClick={() => setEditingAlbum(null)}
              >
                Cancel
              </button>

              <button
                disabled={editBtnLoading}
                className="px-4 py-2 bg-green-500 text-black rounded"
              >
                {editBtnLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {editingSong && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <form
            onSubmit={updateSongHandler}
            className="bg-[#181818] p-6 rounded-lg w-[90%] max-w-lg flex flex-col gap-4"
          >
            <h2 className="text-2xl font-bold">Edit Song</h2>

            <input
              type="text"
              className="auth-input"
              value={editSongTitle}
              onChange={(e) => setEditSongTitle(e.target.value)}
              required
            />

            <input
              type="text"
              className="auth-input"
              value={editSongDescription}
              onChange={(e) => setEditSongDescription(e.target.value)}
              required
            />

            <select
              className="auth-input"
              value={editSongAlbum}
              onChange={(e) => setEditSongAlbum(e.target.value)}
              required
            >
              <option value="">Choose Album</option>

              {albums?.map((album: any, i: number) => {
                return (
                  <option value={album.id} key={i}>
                    {album.title}
                  </option>
                );
              })}
            </select>

            <label className="auth-input cursor-pointer">
  <span>
    {editSongThumbnail
      ? editSongThumbnail.name
      : "Choose new thumbnail optional"}
  </span>

  <input
    type="file"
    accept="image/*"
    hidden
    onChange={(e) =>
      setEditSongThumbnail(
        e.target.files?.[0] || null
      )
    }
  />
</label>

            <label className="auth-input cursor-pointer">
              <span>
                {editSongFile ? editSongFile.name : "Choose new audio optional"}
              </span>

              <input
                type="file"
                onChange={editSongFileChangeHandler}
                accept="audio/*"
                className="hidden"
              />
            </label>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-gray-500 rounded"
                onClick={() => setEditingSong(null)}
              >
                Cancel
              </button>

              <button
                disabled={editBtnLoading}
                className="px-4 py-2 bg-green-500 text-black rounded"
              >
                {editBtnLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Admin;
