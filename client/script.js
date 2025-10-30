const API_URL = "http://localhost:4000";

async function loadTracks() {
  const response = await fetch(`${API_URL}/api/tracks`);
  const tracks = await response.json();

  const playlist = document.getElementById("playlist");
  const audioPlayer = document.getElementById("audioPlayer");
  const nowPlaying = document.getElementById("now-playing");

  tracks.forEach(track => {
    const li = document.createElement("li");
    li.textContent = `${track.title} — ${track.artist}`;

    li.addEventListener("click", () => {
      audioPlayer.src = `${API_URL}${track.file}`;
      audioPlayer.play();
      nowPlaying.textContent = `Now Playing: ${track.title} — ${track.artist}`;
    });

    playlist.appendChild(li);
  });
}

loadTracks();
