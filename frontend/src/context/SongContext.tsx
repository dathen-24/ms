import axios from "axios";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const server = "http://localhost:8000";

export interface Song {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  audio: string;
  album: string;
}

export interface Album {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

interface SongContextType {
  songs: Song[];

  currentSong: Song | null;

  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;

  loading: boolean;

  albums: Album[];

  nextSong: () => void;
  prevSong: () => void;

  albumSong: Song[];
  albumData: Album | null;

  fetchAlbumsongs: (id: string) => Promise<void>;
  fetchSongs: () => Promise<void>;
  fetchAlbums: () => Promise<void>;

  queue: Song[];
  setQueue: React.Dispatch<React.SetStateAction<Song[]>>;

  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

const SongContext = createContext<SongContextType | undefined>(undefined);

interface SongProviderProps {
  children: ReactNode;
}

export const SongProvider: React.FC<SongProviderProps> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [songs, setSongs] = useState<Song[]>([]);
const [loading, setLoading] = useState<boolean>(true);

const nextSong = useCallback(() => {
  if (queue.length === 0) return;

  const next =
    currentIndex === queue.length - 1
      ? 0
      : currentIndex + 1;

  setCurrentIndex(next);
  setIsPlaying(true);
}, [queue, currentIndex]);

const prevSong = useCallback(() => {
  if (queue.length === 0) return;

  const prev =
    currentIndex === 0
      ? queue.length - 1
      : currentIndex - 1;

  setCurrentIndex(prev);
  setIsPlaying(true);
}, [queue, currentIndex]);

 const fetchSongs = useCallback(async () => {
  setLoading(true);

  try {
    const { data } = await axios.get<Song[]>(
      `${server}/api/v1/song/all`
    );

    setSongs(data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
}, []);

  const fetchAlbums = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<Album[]>(`${server}/api/v1/album/all`);
      setAlbums(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const [albumSong, setAlbumSong] = useState<Song[]>([]);
  const [albumData, setAlbumData] = useState<Album | null>(null);

  const fetchAlbumsongs = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const { data } = await axios.get<{ songs: Song[]; album: Album }>(
        `${server}/api/v1/album/${id}`,
      );

      setAlbumData(data.album);
      setAlbumSong(data.songs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

const currentSong =
  queue.length > 0
    ? songs.find(
        (song) =>
          song.id ===
          queue[currentIndex]?.id
      ) || null
    : null;

    useEffect(() => {
  if (queue.length === 0) return;

  const updatedQueue = queue.filter((qSong) =>
    songs.some(
      (song) => song.id === qSong.id
    )
  );

  if (updatedQueue.length !== queue.length) {
    setQueue(updatedQueue);

    if (updatedQueue.length === 0) {
      setIsPlaying(false);
      setCurrentIndex(0);
      localStorage.removeItem(
        "currentSong"
      );
      return;
    }

    if (
      currentIndex >=
      updatedQueue.length
    ) {
      setCurrentIndex(0);
    }
  }
}, [songs]);

useEffect(() => {
  if (queue.length === 0) return;

  const syncedQueue = queue.map(
    (qSong) =>
      songs.find(
        (song) =>
          song.id === qSong.id
      ) || qSong
  );

  const changed =
    JSON.stringify(syncedQueue) !==
    JSON.stringify(queue);

  if (changed) {
    setQueue(syncedQueue);
  }
}, [songs]);

useEffect(() => {
  if (!currentSong) return;

  const exists = songs.find(
    (song) => song.id === currentSong.id
  );

  if (!exists) {
    setQueue([]);
    setCurrentIndex(0);
    setIsPlaying(false);

    localStorage.removeItem(
      "currentSong"
    );
  }
}, [songs, currentSong]);

useEffect(() => {
  if (
    queue.length > 0 &&
    currentIndex >= queue.length
  ) {
    setCurrentIndex(0);
  }
}, [queue, currentIndex]);

    useEffect(() => {
  if (!currentSong) return;

  localStorage.setItem(
    "currentSong",
    JSON.stringify(currentSong)
  );
}, [currentSong]);

useEffect(() => {
  const savedSong =
    localStorage.getItem("currentSong");

  if (!savedSong) return;

  const song = JSON.parse(savedSong);

  setQueue([song]);
  setCurrentIndex(0);
}, []);

  useEffect(() => {
    fetchSongs();
    fetchAlbums();
  }, []);
  return (
    <SongContext.Provider
value={{
  songs,

  currentSong,

  isPlaying,
  setIsPlaying,

  loading,

  albums,

  nextSong,
  prevSong,

  fetchAlbumsongs,
  albumData,
  albumSong,

  fetchSongs,
  fetchAlbums,

  queue,
  setQueue,

  currentIndex,
  setCurrentIndex,
}}
    >
      {children}
    </SongContext.Provider>
  );
};

export const useSongData = (): SongContextType => {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error("useSongData must be used within a songProvider");
  }
  return context;
};
