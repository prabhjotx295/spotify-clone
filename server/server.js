import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve tracks folder properly
app.use("/tracks", express.static(path.join(__dirname, "tracks")));

// (Optional) serve client if you have one
app.use(express.static(path.join(__dirname, "../client")));

app.get("/", (req, res) => {
  res.send("Spotify clone backend is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
