import axios from "axios";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import { Song } from "./SongContext";

const playlistServer = "http://localhost:5003";

export interface PlaylistSong {
  songId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  audio?: string;
}

export interface Playlist {
  _id: string;
  name: string;
  description: string;
  user: string;

  isPublic: boolean;
  coverImage: string;

  songs: PlaylistSong[];
}

interface PlaylistContextType {
  playlists: Playlist[];
  playlistLoading: boolean;
  fetchMyPlaylists: () => Promise<void>;
  createPlaylist: (
    name: string,
  description: string,
  isPublic?: boolean,
  coverImage?: string
) => Promise<Playlist | null>;
  addSongToDefaultPlaylist: (song: Song) => Promise<void>;
  addSongToPlaylist: (playlistId: string, song: Song) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
  updatePlaylist: (playlistId: string, name: string, description: string, isPublic: boolean, coverImage: string) => Promise<void>;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(
  undefined,
);

interface PlaylistProviderProps {
  children: ReactNode;
}

export const PlaylistProvider: React.FC<PlaylistProviderProps> = ({children,}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistLoading, setPlaylistLoading] = useState(false);

  const getTokenHeader = () => {
    return {
      headers: {
        token: localStorage.getItem("token"),
      },
    };
  };

  async function fetchMyPlaylists() {
    const token = localStorage.getItem("token");

    if (!token) {
      setPlaylists([]);
      return;
    }

    setPlaylistLoading(true);

    try {
      const { data } = await axios.get(
        `${playlistServer}/api/v1/playlist/my`,
        getTokenHeader(),
      );

      console.log("PLAYLIST DATA:", data);

      setPlaylists(data.playlists || []);
    } catch (error: any) {
      console.log("FETCH PLAYLIST ERROR:", error.response?.data || error);
      setPlaylists([]);
    } finally {
      setPlaylistLoading(false);
    }
  }

  async function createPlaylist(
  name: string,
  description: string,
  isPublic = false,
  coverImage = ""
): Promise<Playlist | null> {
    try {
      const { data } = await axios.post(
        `${playlistServer}/api/v1/playlist/new`,
        {
          name,
  description,
  isPublic,
  coverImage,
        },
        getTokenHeader(),
      );

      toast.success(data.message || "Playlist created");

      const newPlaylist = data.playlist;

      setPlaylists((prev) => [newPlaylist, ...prev]);

      return newPlaylist;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An Error Occured");
      return null;
    }
  }

  async function addSongToPlaylist(playlistId: string, song: Song) {
    try {
      const { data } = await axios.post(
        `${playlistServer}/api/v1/playlist/${playlistId}/song`,
        {
          songId: song.id.toString(),
          title: song.title,
          description: song.description,
          thumbnail: song.thumbnail,
          audio: song.audio,
        },
        getTokenHeader(),
      );

      toast.success(data.message || "Song added to playlist");

      await fetchMyPlaylists();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An Error Occured");
    }
  }

  async function addSongToDefaultPlaylist(song: Song) {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      let currentPlaylists = playlists;

      if (currentPlaylists.length === 0) {
        const { data } = await axios.get(
          `${playlistServer}/api/v1/playlist/my`,
          getTokenHeader(),
        );

        currentPlaylists = data.playlists || [];
        setPlaylists(currentPlaylists);
      }

      let defaultPlaylist = currentPlaylists[0];

      if (!defaultPlaylist) {
        const createdPlaylist = await createPlaylist(
          "My Playlist",
          "Default playlist",
        );

        if (!createdPlaylist) return;

        defaultPlaylist = createdPlaylist;
      }

      await addSongToPlaylist(defaultPlaylist._id, song);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An Error Occured");
    }
  }

  async function removeSongFromPlaylist(playlistId: string, songId: string) {
    try {
      const { data } = await axios.delete(
        `${playlistServer}/api/v1/playlist/${playlistId}/song`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
          data: {
            songId,
          },
        },
      );

      toast.success(data.message || "Song removed from playlist");

      await fetchMyPlaylists();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An Error Occured");
    }
  }

  async function deletePlaylist(playlistId: string) {
    try {
      const { data } = await axios.delete(
        `${playlistServer}/api/v1/playlist/${playlistId}`,
        getTokenHeader(),
      );

      toast.success(data.message || "Playlist deleted");

      setPlaylists((prev) =>
        prev.filter((playlist) => playlist._id !== playlistId),
      );
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An Error Occured");
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchMyPlaylists();
    }
  }, []);

async function updatePlaylist(
  playlistId: string,
  name: string,
  description: string,
  isPublic: boolean,
  coverImage: string
) {
  try {
    const { data } = await axios.put(
      `${playlistServer}/api/v1/playlist/${playlistId}`,
      {
        name,
        description,
        isPublic,
        coverImage,
      },
      getTokenHeader()
    );

    toast.success(
      data.message || "Playlist updated"
    );

    await fetchMyPlaylists();
  } catch (error: any) {
    toast.error(
      error.response?.data?.message ||
      "An Error Occured"
    );
  }
}

return (
  <PlaylistContext.Provider
    value={{
      playlists,
      playlistLoading,
      fetchMyPlaylists,
      createPlaylist,
      updatePlaylist,
      addSongToDefaultPlaylist,
      addSongToPlaylist,
      removeSongFromPlaylist,
      deletePlaylist,
    }}
  >
    {children}
  </PlaylistContext.Provider>
);
};

export const usePlaylistData = (): PlaylistContextType => {
  const context = useContext(PlaylistContext);

  if (!context) {
    throw new Error("usePlaylistData must be used within a PlaylistProvider");
  }

  return context;
};
