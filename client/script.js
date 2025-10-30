const BASE_URL = window.location.origin;
const songList = document.getElementById("songList");
const player = document.getElementById("player");
const npTitle = document.getElementById("np-title");
const npArtist = document.getElementById("np-artist");
const npCover = document.getElementById("np-cover");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressBar = document.getElementById("progressBar");

let songs = [];
let currentIndex = -1;

async function loadSongs() {
  const res = await fetch(`${BASE_URL}/api/songs`);
  songs = await res.json();

  songList.innerHTML = "";
  songs.forEach((song, index) => {
    const div = document.createElement("div");
    div.className = "song";
    div.innerHTML = `
      <img src="${BASE_URL}${song.cover}" alt="cover">
      <div class="song-title">${song.title}</div>
      <div class="song-artist">${song.artist}</div>
    `;
    div.onclick = () => playSong(index);
    songList.appendChild(div);
  });
}

function playSong(index) {
  currentIndex = index;
  const song = songs[index];
  player.src = `${BASE_URL}${song.url}`;
  npTitle.textContent = song.title;
  npArtist.textContent = song.artist;
  npCover.src = `${BASE_URL}${song.cover}`;
  player.play();
  playPauseBtn.textContent = "⏸️";
}

playPauseBtn.onclick = () => {
  if (player.paused) {
    player.play();
    playPauseBtn.textContent = "⏸️";
  } else {
    player.pause();
    playPauseBtn.textContent = "▶️";
  }
};

nextBtn.onclick = () => {
  if (songs.length === 0) return;
  currentIndex = (currentIndex + 1) % songs.length;
  playSong(currentIndex);
};

prevBtn.onclick = () => {
  if (songs.length === 0) return;
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  playSong(currentIndex);
};

player.addEventListener("timeupdate", () => {
  if (player.duration) {
    progressBar.value = (player.currentTime / player.duration) * 100;
  }
});

progressBar.addEventListener("input", () => {
  if (player.duration) {
    player.currentTime = (progressBar.value / 100) * player.duration;
  }
});

player.addEventListener("ended", () => {
  nextBtn.click();
});

loadSongs();
