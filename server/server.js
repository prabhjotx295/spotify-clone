const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 4000;

// enable CORS + serve frontend
app.use(cors());
app.use(express.static(path.join(__dirname, "../client")));

// tracks directory
const musicDir = path.join(__dirname, "tracks");

// API: list all tracks
app.get("/api/tracks", (req, res) => {
  fs.readdir(musicDir, (err, files) => {
    if (err) return res.status(500).json({ error: "Failed to read tracks folder" });

    const tracks = files
      .filter(file => file.endsWith(".mp3"))
      .map(file => {
        const [title, artist] = file.replace(".mp3", "").split("_");
        return {
          id: file,
          title: title ? title.replace(/-/g, " ") : "Unknown",
          artist: artist ? artist.replace(/-/g, " ") : "Unknown",
          file: `/stream/${file}`,
        };
      });

    res.json(tracks);
  });
});

// API: stream a track
app.get("/stream/:filename", (req, res) => {
  const filePath = path.join(musicDir, req.params.filename);
  fs.stat(filePath, (err, stats) => {
    if (err) return res.status(404).send("File not found");

    const range = req.headers.range;
    if (!range) {
      res.writeHead(200, { "Content-Length": stats.size, "Content-Type": "audio/mpeg" });
      fs.createReadStream(filePath).pipe(res);
    } else {
      const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : stats.size - 1;
      const chunkSize = end - start + 1;

      const file = fs.createReadStream(filePath, { start, end });
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${stats.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "audio/mpeg",
      });
      file.pipe(res);
    }
  });
});

// start server
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
