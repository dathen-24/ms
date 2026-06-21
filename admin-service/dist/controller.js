import TryCatch from "./TryCatch.js";
import getBuffer from "./config/dataUri.js";
import cloudinary from "cloudinary";
import { sql } from "./config/db.js";
import { redisClient } from "./index.js";
export const addAlbum = TryCatch(async (req, res) => {
    if (req.user?.role !== "admin") {
        res.status(401).json({
            message: "You are not admin",
        });
        return;
    }
    const { title, description } = req.body;
    const files = req.files;
    const file = files?.file?.[0];
    if (!file) {
        res.status(400).json({
            message: "No file to upload",
        });
        return;
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
        res.status(500).json({
            message: "Failed to generate file buffer",
        });
        return;
    }
    const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
        folder: "albums",
    });
    const result = await sql `
    INSERT INTO albums (title, description, thumbnail)
    VALUES (${title}, ${description}, ${cloud.secure_url})
    RETURNING *
  `;
    if (redisClient.isReady) {
        await redisClient.del("albums");
        console.log("Cache invalidated for albums");
    }
    res.json({
        message: "Album Created",
        album: result[0],
    });
});
export const addSong = TryCatch(async (req, res) => {
    if (req.user?.role !== "admin") {
        res.status(401).json({
            message: "You are not admin",
        });
        return;
    }
    const { title, description, album } = req.body;
    const isAlbum = await sql `SELECT * FROM albums WHERE id = ${album}`;
    if (isAlbum.length === 0) {
        res.status(404).json({
            message: "No album with this id",
        });
        return;
    }
    const audioFile = req.files?.file?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];
    if (!audioFile) {
        res.status(400).json({
            message: "No audio file to upload",
        });
        return;
    }
    const fileBuffer = getBuffer(audioFile);
    if (!fileBuffer || !fileBuffer.content) {
        res.status(500).json({
            message: "Failed to generate file buffer",
        });
        return;
    }
    const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
        folder: "songs",
        resource_type: "video",
    });
    let thumbnailUrl = null;
    if (thumbnailFile) {
        const thumbnailBuffer = getBuffer(thumbnailFile);
        if (!thumbnailBuffer?.content) {
            res.status(400).json({
                message: "Invalid thumbnail",
            });
            return;
        }
        const cloud = await cloudinary.v2.uploader.upload(thumbnailBuffer.content, {
            folder: "song-thumbnails",
        });
        thumbnailUrl = cloud.secure_url;
    }
    const result = await sql `
    INSERT INTO songs (title, description, thumbnail, audio, album_id)
    VALUES (${title}, ${description}, ${thumbnailUrl}, ${cloud.secure_url}, ${album})
    RETURNING *
  `;
    if (redisClient.isReady) {
        await redisClient.del("songs");
        await redisClient.del(`album_songs_${album}`);
        console.log("Cache invalidated for songs and album songs");
    }
    res.json({
        message: "Song Added",
        song: result[0],
    });
});
export const addThumbnail = TryCatch(async (req, res) => {
    if (req.user?.role !== "admin") {
        res.status(401).json({
            message: "You are not admin",
        });
        return;
    }
    const song = await sql `SELECT * FROM songs WHERE id = ${req.params.id}`;
    if (song.length === 0) {
        res.status(404).json({
            message: "No song with this id",
        });
        return;
    }
    const files = req.files;
    const file = files?.file?.[0];
    if (!file) {
        res.status(400).json({
            message: "No file to upload",
        });
        return;
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
        res.status(500).json({
            message: "Failed to generate file buffer",
        });
        return;
    }
    const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content);
    const result = await sql `
    UPDATE songs
    SET thumbnail = ${cloud.secure_url}
    WHERE id = ${req.params.id}
    RETURNING *
  `;
    if (redisClient.isReady) {
        await redisClient.del("songs");
        await redisClient.del(`album_songs_${song[0].album_id}`);
        console.log("Cache invalidated for songs and album songs");
    }
    res.json({
        message: "Thumbnail added",
        song: result[0],
    });
});
export const deleteAlbum = TryCatch(async (req, res) => {
    if (req.user?.role !== "admin") {
        res.status(401).json({
            message: "You are not admin",
        });
        return;
    }
    const { id } = req.params;
    const isAlbum = await sql `SELECT * FROM albums WHERE id = ${id}`;
    if (isAlbum.length === 0) {
        res.status(404).json({
            message: "No album with this id",
        });
        return;
    }
    await sql `DELETE FROM songs WHERE album_id = ${id}`;
    await sql `DELETE FROM albums WHERE id = ${id}`;
    if (redisClient.isReady) {
        await redisClient.del("albums");
        await redisClient.del("songs");
        await redisClient.del(`album_songs_${id}`);
        console.log("Cache invalidated for albums, songs and album songs");
    }
    res.json({
        message: "Album deleted successfully",
    });
});
export const deleteSong = TryCatch(async (req, res) => {
    if (req.user?.role !== "admin") {
        res.status(401).json({
            message: "You are not admin",
        });
        return;
    }
    const { id } = req.params;
    const song = await sql `SELECT * FROM songs WHERE id = ${id}`;
    if (song.length === 0) {
        res.status(404).json({
            message: "No song with this id",
        });
        return;
    }
    const albumId = song[0].album_id;
    await sql `DELETE FROM songs WHERE id = ${id}`;
    if (redisClient.isReady) {
        await redisClient.del("songs");
        await redisClient.del(`album_songs_${albumId}`);
        console.log("Cache invalidated for songs and album songs");
    }
    res.json({
        message: "Song deleted successfully",
    });
});
export const updateAlbum = TryCatch(async (req, res) => {
    if (req.user?.role !== "admin") {
        res.status(401).json({
            message: "You are not admin",
        });
        return;
    }
    const { id } = req.params;
    const { title, description } = req.body;
    const album = await sql `SELECT * FROM albums WHERE id = ${id}`;
    if (album.length === 0) {
        res.status(404).json({
            message: "No album with this id",
        });
        return;
    }
    let thumbnail = album[0].thumbnail;
    const files = req.files;
    const file = files?.file?.[0];
    if (file) {
        const fileBuffer = getBuffer(file);
        if (!fileBuffer || !fileBuffer.content) {
            res.status(500).json({
                message: "Failed to generate file buffer",
            });
            return;
        }
        const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
            folder: "albums",
        });
        thumbnail = cloud.secure_url;
    }
    const result = await sql `
    UPDATE albums
    SET title = ${title},
        description = ${description},
        thumbnail = ${thumbnail}
    WHERE id = ${id}
    RETURNING *
  `;
    if (redisClient.isReady) {
        await redisClient.del("albums");
        await redisClient.del(`album_songs_${id}`);
        console.log("Cache invalidated for albums and album songs");
    }
    res.json({
        message: "Album updated successfully",
        album: result[0],
    });
});
export const updateSong = TryCatch(async (req, res) => {
    if (req.user?.role !== "admin") {
        res.status(401).json({
            message: "You are not admin",
        });
        return;
    }
    const { id } = req.params;
    const { title, description, album } = req.body;
    const song = await sql `SELECT * FROM songs WHERE id = ${id}`;
    if (song.length === 0) {
        res.status(404).json({
            message: "No song with this id",
        });
        return;
    }
    const oldAlbumId = song[0].album_id;
    const isAlbum = await sql `SELECT * FROM albums WHERE id = ${album}`;
    if (isAlbum.length === 0) {
        res.status(404).json({
            message: "No album with this id",
        });
        return;
    }
    let audio = song[0].audio;
    let thumbnail = song[0].thumbnail;
    const files = req.files;
    const audioFile = files?.audio?.[0];
    const thumbnailFile = files?.thumbnail?.[0];
    if (audioFile) {
        const fileBuffer = getBuffer(audioFile);
        if (!fileBuffer || !fileBuffer.content) {
            res.status(500).json({
                message: "Failed to generate file buffer",
            });
            return;
        }
        const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
            folder: "songs",
            resource_type: "video",
        });
        audio = cloud.secure_url;
    }
    if (thumbnailFile) {
        const thumbnailBuffer = getBuffer(thumbnailFile);
        if (!thumbnailBuffer || !thumbnailBuffer.content) {
            res.status(500).json({
                message: "Failed to generate thumbnail buffer",
            });
            return;
        }
        const cloud = await cloudinary.v2.uploader.upload(thumbnailBuffer.content, {
            folder: "song-thumbnails",
        });
        thumbnail = cloud.secure_url;
    }
    const result = await sql `
    UPDATE songs
SET title = ${title},
    description = ${description},
    thumbnail = ${thumbnail},
    audio = ${audio},
    album_id = ${album}
    WHERE id = ${id}
    RETURNING *
  `;
    if (redisClient.isReady) {
        await redisClient.del("songs");
        await redisClient.del(`album_songs_${oldAlbumId}`);
        await redisClient.del(`album_songs_${album}`);
        console.log("Cache invalidated for songs and album songs");
    }
    res.json({
        message: "Song updated successfully",
        song: result[0],
    });
});
