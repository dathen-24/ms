import React, { useState } from "react";
import { FaBookmark } from "react-icons/fa";
import { useUserData } from "../context/UserContext";
import { useSongData, Song } from "../context/SongContext";
import AddToPlaylistModal from "./AddToPlaylistModal";
import { Play } from "lucide-react";

interface SongCardProps {
  image: string;
  name: string;
  desc: string;
  id: string;
}

const SongCard: React.FC<SongCardProps> = ({ image, name, desc, id }) => {
  const { isAuth } = useUserData();
  const {
  songs,
  setQueue,
  setCurrentIndex,
  setIsPlaying,
} = useSongData();

  const [selectedPlaylistSong, setSelectedPlaylistSong] = useState<Song | null>(
    null,
  );

const playSongHandler = (
  e: React.MouseEvent<HTMLButtonElement>
) => {
  e.stopPropagation();

  setQueue(songs);

const index = songs.findIndex(
  (s) => s.id === id
);

setCurrentIndex(index);

setIsPlaying(true);
};

  const saveToPlayListHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const song = songs.find((item) => item.id.toString() === id.toString());

    if (!song) {
      console.log("Song not found:", id);
      return;
    }

    setSelectedPlaylistSong(song);
  };

  return (
    <>
      <div
        className="
group
min-w-[190px]
max-w-[190px]
p-4
rounded-xl
bg-zinc-900/40
hover:bg-zinc-800/70
transition-all
duration-300
cursor-pointer
"
      >
        <div className="relative group">
          <img
            src={image}
            alt={name}
            className="
         w-full
         aspect-square
         object-cover
         rounded-lg
         shadow-xl
         transition-transform
         duration-300
         group-hover:scale-[1.03]
       "
          />

          <button
            onClick={playSongHandler}
            className="
        absolute
        bottom-2
        right-2
        w-12
        h-12
        rounded-full
        bg-green-500
        text-black
        font-bold
        shadow-xl
        opacity-0
        translate-y-2
        group-hover:opacity-100
        group-hover:translate-y-0
        transition-all
        duration-300
      "
          >
            <Play size={20} fill="black" stroke="black" className="ml-3.5" />
          </button>

          {isAuth && (
            <button
              type="button"
              onClick={saveToPlayListHandler}
              className="absolute top-2 right-2 z-30 bg-black text-white p-2 rounded-full opacity-0 group-hover:opacity-100 hover:scale-105 transition"
            >
              <FaBookmark />
            </button>
          )}
        </div>

        <p className="font-bold mt-2 mb-1">{name}</p>
        <p className="text-slate-200 text-sm">{desc.slice(0, 20)}</p>
      </div>

      <AddToPlaylistModal
        song={selectedPlaylistSong}
        onClose={() => setSelectedPlaylistSong(null)}
      />
    </>
  );
};

export default SongCard;
