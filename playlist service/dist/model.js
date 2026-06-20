import mongoose from "mongoose";
const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    user: {
        type: String,
        required: true,
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    coverImage: {
        type: String,
        default: "",
    },
    songs: [
        {
            songId: {
                type: String,
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                default: "",
            },
            thumbnail: {
                type: String,
                default: "",
            },
            audio: {
                type: String,
                default: "",
            },
        },
    ],
}, {
    timestamps: true,
});
export const Playlist = mongoose.model("Playlist", playlistSchema);
