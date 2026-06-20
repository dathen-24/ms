import { Response } from "express";
import { Playlist } from "./model.js";
import TryCatch from "./TryCatch.js";
import { AuthenticatedRequest } from "./middleware.js";
import cloudinary from "cloudinary";
import getBuffer from "./config/dataUri.js";

export const createPlaylist = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const { name, description, isPublic, coverImage,} = req.body;

    if (!name) {
      res.status(400).json({
        message: "Playlist name is required",
      });
      return;
    }

    const playlist = await Playlist.create({
      name,
      description,
      user: req.user,
      isPublic,
      coverImage,
      songs: [],
    });

    res.status(201).json({
      message: "Playlist created",
      playlist,
    });
  },
);

export const getMyPlaylists = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const playlists = await Playlist.find({
      user: req.user,
    }).sort({ createdAt: -1 });

    res.json({
      playlists,
    });
  },
);

export const getPlaylistById = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const playlist = await Playlist.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!playlist) {
      res.status(404).json({
        message: "Playlist not found",
      });
      return ;
    }

    res.json({
      playlist,
    });
  },
);

export const addSongToPlaylist = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const { songId, title, description, thumbnail, audio } = req.body;

    if (!songId || !title) {
      res.status(400).json({
        message: "songId and title are required",
      });
      return;
    }

    const playlist = await Playlist.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!playlist) {
      res.status(404).json({
        message: "Playlist not found",
      });
      return ;
    }

    const alreadyAdded = playlist.songs.some(
      (song: any) => song.songId === songId,
    );

    if (alreadyAdded) {
      res.status(400).json({
        message: "Song already exists in playlist",
      });
      return;
    }

    playlist.songs.push({
      songId,
      title,
      description,
      thumbnail,
      audio,
    });

    await playlist.save();

    res.json({
      message: "Song added to playlist",
      playlist,
    });
  },
);

export const removeSongFromPlaylist = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const { songId } = req.body;

    const playlist = await Playlist.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!playlist) {
      res.status(404).json({
        message: "Playlist not found",
      });
      return ;
    }

    playlist.songs = playlist.songs.filter(
      (song: any) => song.songId !== songId,
    ) as any;

    await playlist.save();

    res.json({
      message: "Song removed from playlist",
      playlist,
    });
  },
);

export const deletePlaylist = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const playlist = await Playlist.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!playlist) {
      res.status(404).json({
        message: "Playlist not found",
      });
      return;
    }

    res.json({
      message: "Playlist deleted",
    });
  },
);

export const updatePlaylist = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    const { name, description, isPublic, coverImage } = req.body;

    const playlist = await Playlist.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!playlist) {
      res.status(404).json({
        message: "Playlist not found",
      });
      return;
    }

    playlist.name = name || playlist.name;
    playlist.description = description ?? playlist.description;
    playlist.isPublic = isPublic ?? playlist.isPublic;
    playlist.coverImage = coverImage ?? playlist.coverImage;

    await playlist.save();

    res.json({
      message: "Playlist updated",
      playlist,
    });
  },
);

export const uploadPlaylistCover = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const file = req.file;

    if (!file) {
      res.status(400).json({
        message: "No file uploaded",
      });
      return;
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer?.content) {
      res.status(500).json({
        message: "Failed to generate file buffer",
      });
      return;
    }

    const cloud =
      await cloudinary.v2.uploader.upload(
        fileBuffer.content,
        {
          folder: "playlist-covers",
        }
      );

    res.json({
      imageUrl: cloud.secure_url,
    });
  }
);