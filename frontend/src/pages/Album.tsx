import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { Song, useSongData } from "../context/SongContext";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { FaBookmark, FaPlay } from "react-icons/fa";
import { useUserData } from "../context/UserContext";
import AddToPlaylistModal from "../components/AddToPlaylistModal";

const Album = () => {
  const {
    fetchAlbumsongs,
    albumSong,
    albumData,
    setIsPlaying,
    loading,
    setQueue,
  setCurrentIndex,
  } = useSongData();

  const { isAuth } = useUserData();

  const [selectedPlaylistSong, setSelectedPlaylistSong] = useState<Song | null>(
    null,
  );

  const params = useParams<{ id: string }>();

  useEffect(() => {
    if (params.id) {
      fetchAlbumsongs(params.id);
    }
  }, [params.id]);
  return (
    <div>
      <Layout>
        {albumData && (
          <>
            {loading ? (
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
      {albumData.thumbnail ? (
        <img
          src={albumData.thumbnail}
          alt={albumData.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <FaBookmark className="text-8xl text-zinc-500" />
      )}
    </div>

    <div className="flex-1">
      <p className="uppercase text-sm tracking-widest">
        Album
      </p>

      <h1
        className="
          text-6xl
          md:text-6xl
          font-semibold
          mt-2
        "
      >
        {albumData.title}
      </h1>

      <p className="mt-4 text-zinc-300">
        {albumData.description}
      </p>

      <div className="flex items-center gap-3 mt-4 text-zinc-400">
        <img
          src="/logo.png"
          className="w-6 h-6 rounded-full"
          alt=""
        />

        <span>
          {albumSong?.length || 0} songs
        </span>
      </div>
    </div>
  </div>

  <div className="mt-8">
    <button
    onClick={() => {
  if (albumSong.length === 0) return;

  setQueue(albumSong);
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
                {albumSong &&
                  albumSong.map((song, index) => {
                    return (
                      <div
  key={index}
  onClick={() => {
setQueue(albumSong);

const index = albumSong.findIndex(
  (s) => s.id === song.id
);

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
      src={
        song.thumbnail
          ? song.thumbnail
          : "/download.jpeg"
      }
      className="
        w-12
        h-12
        rounded
        object-cover
      "
      alt=""
    />

    <div>
      <p className="text-white font-medium">
        {song.title}
      </p>
    </div>
  </div>

  <p className="truncate text-zinc-400">
    {song.description}
  </p>

  <div className="flex gap-4">
    {isAuth && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedPlaylistSong(song);
        }}
        className="
          text-zinc-300
          hover:text-green-500
        "
      >
        <FaBookmark />
      </button>
    )}
  </div>
</div>
                    );
                  })}
              </>
            )}
          </>
        )}
        <AddToPlaylistModal
          song={selectedPlaylistSong}
          onClose={() => setSelectedPlaylistSong(null)}
        />
      </Layout>
    </div>
  );
};

export default Album;
