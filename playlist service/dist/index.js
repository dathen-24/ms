import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import playlistRoutes from "./route.js";
import cloudinary from "cloudinary";
dotenv.config();
cloudinary.v2.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_Api_Key,
    api_secret: process.env.Cloud_Api_Secret,
});
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1", playlistRoutes);
app.get("/", (req, res) => {
    res.send("Playlist Service is working");
});
const port = process.env.PORT || 5003;
mongoose
    .connect(`${process.env.MONGO_URI}`, {
    dbName: "SpotifyPlaylist",
})
    .then(() => console.log("Playlist MongoDB Connected"))
    .catch((err) => console.log(err));
app.listen(port, () => {
    console.log(`Playlist service is running on port ${port}`);
});
