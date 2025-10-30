const BASE_URL = window.location.origin;
const songList = document.getElementById("songList");
const player = document.getElementById("player");

async function loadSongs() {
  try {
    const res = await fetch(`${BASE_URL}/api/songs`);
    const songs = await res.json();

    if (songs.length === 0) {
      songList.innerHTML = "<p>No songs found 🎵</p>";
      return;
    }

    songs.forEach(song => {
      const div = document.createElement("div");
      div.className = "song";
      div.textContent = `${song.title} — ${song.artist}`;
      div.onclick = () => {
        player.src = `${BASE_URL}${song.url}`;
        player.play();
      };
      songList.appendChild(div);
    });
  } catch (err) {
    songList.innerHTML = "<p>Error loading songs 😢</p>";
    console.error(err);
  }
}

loadSongs();
