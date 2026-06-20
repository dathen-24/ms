import React, { useEffect, useRef, useState } from "react";
import { useSongData } from "../context/SongContext";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { FaPause, FaPlay } from "react-icons/fa";

const Player = () => {
  const {
    currentSong,
    isPlaying,
    setIsPlaying,
    prevSong,
    nextSong,
  } = useSongData();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [volume, setVolume] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  

useEffect(() => {
  if (!audioRef.current) return;

if (isPlaying) {
  audioRef.current
    .play()
    .catch(() => {});
} else {
    audioRef.current.pause();
  }
}, [isPlaying, currentSong]);

  useEffect(() => {
  const audio = audioRef.current;

  if (!audio) return;

  const handleLoadedMetaData = () => {
    setDuration(audio.duration || 0);
  };

  const handleTimeUpdate = () => {
    setProgress(audio.currentTime || 0);
  };

  audio.addEventListener(
    "loadedmetadata",
    handleLoadedMetaData
  );

  audio.addEventListener(
    "timeupdate",
    handleTimeUpdate
  );

  return () => {
    audio.removeEventListener(
      "loadedmetadata",
      handleLoadedMetaData
    );

    audio.removeEventListener(
      "timeupdate",
      handleTimeUpdate
    );
  };
}, [currentSong]);

useEffect(() => {
  setProgress(0);
}, [currentSong]);

useEffect(() => {
  if (audioRef.current) {
    audioRef.current.volume = volume;
  }
}, [volume]);

const handlePlayPause = () => {
  setIsPlaying(!isPlaying);
};

const volumeChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  setVolume(
    parseFloat(e.target.value) / 100
  );
};

  const durationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setProgress(newTime);
  };

  return (
    <div>
      {currentSong && (
        <div
  className="
  h-20
  sm:h-24
  bg-zinc-900
  border-t
  border-zinc-800
  px-4
  flex
  justify-between
  items-center
  "
>
          {/* Left */}
          <div className="w-1/4 flex items-center gap-4">
            <img
              src={currentSong.thumbnail || "/download.jpeg"}
              alt=""
              className="w-14 h-14 object-cover rounded-md"
            />

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate hover:underline cursor-pointer">
                {currentSong.title}
              </p>

              <p className="text-sm text-zinc-400 truncate hover:underline cursor-pointer">
                {currentSong.description}
              </p>
            </div>
          </div>

          {/* Center */}

          <div className="flex flex-col items-center flex-1 max-w-full sm:max-w-[45%]">
            {currentSong.audio && (
              <audio ref={audioRef} src={currentSong.audio} autoPlay onEnded={nextSong} />
            )}
            <div className="flex items-center gap-6 mb-2">
              <button
                onClick={prevSong}
                className="text-zinc-400 hover:text-white transition"
              >
                <GrChapterPrevious size={18} />
              </button>

              <button
                onClick={handlePlayPause}
                className="
      w-10
      h-10
      rounded-full
      bg-white
      text-black
      flex
      items-center
      justify-center
      hover:scale-105
      transition
    "
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>

              <button
                onClick={nextSong}
                className="text-zinc-400 hover:text-white transition"
              >
                <GrChapterNext size={18} />
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 w-full">
              <span className="text-xs text-zinc-400">
                {Math.floor(progress / 60)}:
                {String(Math.floor(progress % 60)).padStart(2, "0")}
              </span>

              <input
                type="range"
                min="0"
                max="100"
                value={
  duration > 0
    ? (progress / duration) * 100
    : 0
}
                onChange={durationChange}
                className="flex-1"
              />

              <span className="text-xs text-zinc-400">
                {Math.floor(duration / 60)}:
                {String(Math.floor(duration % 60)).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Right */}

          <div className="w-1/4 flex justify-end items-center gap-3">
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={volume * 100}
              onChange={volumeChange}
              className="w-24 md:w-32"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
