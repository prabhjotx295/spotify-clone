const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.static(path.join(__dirname, "../client")));
app.use("/tracks", express.static(path.join(__dirname, "tracks")));
app.use("/tracks_cover", express.static(path.join(__dirname, "tracks_cover")));

app.get("/api/songs", (req, res) => {
  const tracksDir = path.join(__dirname, "tracks");
  const coversDir = path.join(__dirname, "tracks_cover");

  fs.readdir(tracksDir, (err, files) => {
    if (err) return res.status(500).send("Error reading tracks folder");

    const songs = files
      .filter(f => f.endsWith(".mp3"))
      .map(f => {
        const baseName = f.replace(".mp3", "");
        const [artist, title, genre, year] = baseName.split("_");

        const coverPath = path.join(coversDir, `${baseName}.jpg`);
        const coverExists = fs.existsSync(coverPath);

        return {
          title: title?.replace(/-/g, " ") || baseName,
          artist: artist?.replace(/-/g, " ") || "Unknown Artist",
          genre: genre || "Unknown",
          year: year || "Unknown",
          url: `/tracks/${f}`,
          cover: coverExists ? `/tracks_cover/${baseName}.jpg` : `/default-cover.jpg`
        };
      });

    res.json(songs);
  });
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
