const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.static(path.join(__dirname, "../client")));
app.use("/tracks", express.static(path.join(__dirname, "tracks")));

// endpoint to list all songs
app.get("/api/songs", (req, res) => {
  const dirPath = path.join(__dirname, "tracks");
  fs.readdir(dirPath, (err, files) => {
    if (err) return res.status(500).send("Error reading tracks folder");
    const songs = files
      .filter(f => f.endsWith(".mp3"))
      .map(f => {
        const [artist, name, genre, year] = f.replace(".mp3", "").split("_");
        return {
          title: name.replace(/-/g, " "),
          artist: artist.replace(/-/g, " "),
          genre,
          year,
          url: `/tracks/${f}`
        };
      });
    res.json(songs);
  });
});

// start server
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
