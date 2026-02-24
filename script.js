
const playlist = [
  {
    title: "Kabhi Kabhi Aditi",
    artist: "Rashid Ali",
    duration: "4:21",
    color: "#e8c547",
    src: "audio/kabhi-kabhi-aditi.mp3"
  },
  {
    title: "Ambarsariya",
    artist: "Sona Mohapatra",
    duration: "4:08",
    color: "#e8c547",
    src: "audio/ambarsariya.mp3"
  },
  {
    title: "Tu kabhi Janegi",
    artist: "Sonu Nigam",
    duration: "4:26",
    color: "#47b8e8",
    src: "audio/tu.mp3"
  },
  {
    title: "Teri Yaadein",
    artist: "Atif Aslam",
    duration: "4:34",
    color: "#e85447",
    src: "audio/teri-yaadein.mp3"
  },
  {
    title: "Rozana",
    artist: "Shreya Ghoshal",
    duration: "4:34",
    color: "#a8e847",
    src: "audio/rozana.mp3"
  },
  {
    title: "Ride It",
    artist: "Jay Sean",
    duration: "3:13",
    color: "#b447e8",
    src: "audio/ride-it.mp3"
  },
  {
    title: "Pehle Bhi Main",
    artist: "Vishal Mishra",
    duration: "4:10",
    color: "#e88a47",
    src: "audio/pehle-bhi-main.mp3"
  },
  {
    title: "Paaro",
    artist: "Aditya Rikhari",
    duration: "2:33",
    color: "#47e8c5",
    src: "audio/paaro.mp3"
  },
  {
    title: "Mere Rang Mein Rangne Wali",
    artist: "S. P. Balasubrahmanyam",
    duration: "6:54",
    color: "#e8478a",
    src: "audio/mere-rang-mein-rangne-wali.mp3"
  },
  {
    title: "Maine Payal Hai Chhankai",
    artist: "Falguni Pathak",
    duration: "4:39",
    color: "#e8a147",
    src: "audio/maine-payal-hai-chhankai.mp3"
  },
  {
    title: "Labon Ko",
    artist: "KK",
    duration: "5:43",
    color: "#6a47e8",
    src: "audio/labon-ko.mp3"
  },
  {
    title: "Ishq Bulaava",
    artist: "Arijit Singh",
    duration: "4:04",
    color: "#e8d247",
    src: "audio/ishq-bulaava.mp3"
  },
  {
    title: "Humnava Mere",
    artist: "Jubin Nautiyal",
    duration: "5:29",
    color: "#47c8e8",
    src: "audio/humnava-mere.mp3"
  },
  {
    title: "Dil To Bachcha Hai Ji",
    artist: "Rahat Fateh Ali Khan",
    duration: "5:36",
    color: "#c0c0c0",
    src: "audio/dil-to-bachcha-hai.mp3"
  },
  {
    title: "Buzz",
    artist: "Aastha Gill",
    duration: "3:13",
    color: "#e86847",
    src: "audio/buzz.mp3"
  },
  
];

/* ── DOM refs ── */
const audio        = document.getElementById('audioPlayer');
const btnPlay      = document.getElementById('btnPlay');
const btnPrev      = document.getElementById('btnPrev');
const btnNext      = document.getElementById('btnNext');
const iconPlay     = document.getElementById('iconPlay');
const iconPause    = document.getElementById('iconPause');
const songTitle    = document.getElementById('songTitle');
const songArtist   = document.getElementById('songArtist');
const labelTitle   = document.getElementById('labelTitle');
const labelArtist  = document.getElementById('labelArtist');
const currentTime  = document.getElementById('currentTime');
const totalTime    = document.getElementById('totalTime');
const progressFill = document.getElementById('progressFill');
const seekSlider   = document.getElementById('seekSlider');
const volumeSlider = document.getElementById('volumeSlider');
const volFill      = document.getElementById('volFill');
const playlistBody = document.getElementById('playlistBody');
const vinylDisk    = document.getElementById('vinylDisk');
const vinylLabel   = document.getElementById('vinylLabel');
const eqBars       = document.getElementById('eqBars');
const btnShuffle   = document.getElementById('btnShuffle');
const btnRepeat    = document.getElementById('btnRepeat');

/* ── State ── */
let currentIndex = 0;
let isPlaying    = false;
let isShuffle    = false;
let isRepeat     = false;
let eqInterval   = null;

/* ── Build playlist ── */
function buildPlaylist() {
  playlistBody.innerHTML = '';
  document.getElementById('trackCount').textContent = `${playlist.length} tracks`;
  playlist.forEach((track, i) => {
    const item = document.createElement('div');
    item.className = 'track-item' + (i === currentIndex ? ' active' : '');
    item.dataset.index = i;
    item.innerHTML = `
      <div class="track-num">
        <span class="track-num-static">${String(i + 1).padStart(2,'0')}</span>
        <div class="playing-bars">
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </div>
      </div>
      <div class="track-meta">
        <div class="track-name">${track.title}</div>
        <div class="track-artist">${track.artist}</div>
      </div>
      <div class="track-dur" id="dur-${i}">${track.duration}</div>
    `;
    item.addEventListener('click', () => loadTrack(i, true));
    playlistBody.appendChild(item);
  });
}

/* ── Load track ── */
function loadTrack(index, autoPlay = false) {
  currentIndex = index;
  const track = playlist[index];

  // Update display
  songTitle.textContent  = track.title;
  songArtist.textContent = track.artist;
  labelTitle.textContent = track.title.toUpperCase().substring(0,8);
  labelArtist.textContent = track.artist.split(' ')[0].toUpperCase();
  vinylLabel.style.background = track.color;

  // Show loading state on progress
  currentTime.textContent = '0:00';
  totalTime.textContent = '—:——';
  progressFill.style.width = '0%';
  seekSlider.value = 0;

  // Load audio
  audio.src = track.src;
  audio.load();

  updatePlaylistUI();

  if (autoPlay) {
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }

  // Scroll active track into view
  const activeEl = playlistBody.querySelector('.track-item.active');
  if (activeEl) activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function updatePlaylistUI() {
  document.querySelectorAll('.track-item').forEach((el, i) => {
    el.classList.toggle('active', i === currentIndex);
    el.classList.toggle('paused', i === currentIndex && !isPlaying);
  });
}

/* ── Play / Pause ── */
function setPlaying(state) {
  isPlaying = state;
  iconPlay.style.display  = state ? 'none'  : 'block';
  iconPause.style.display = state ? 'block' : 'none';
  vinylDisk.classList.toggle('spinning', state);
  updatePlaylistUI();
  animateEQ(state);
}

btnPlay.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause();
    setPlaying(false);
  } else {
    if (!audio.src) loadTrack(0, true);
    else audio.play().then(() => setPlaying(true)).catch(() => {});
  }
});

/* ── Prev / Next ── */
btnPrev.addEventListener('click', () => {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  let idx = isShuffle
    ? Math.floor(Math.random() * playlist.length)
    : (currentIndex - 1 + playlist.length) % playlist.length;
  loadTrack(idx, isPlaying);
});

btnNext.addEventListener('click', () => {
  let idx = isShuffle
    ? Math.floor(Math.random() * playlist.length)
    : (currentIndex + 1) % playlist.length;
  loadTrack(idx, isPlaying);
});

/* ── Auto-advance ── */
audio.addEventListener('ended', () => {
  if (isRepeat) {
    audio.currentTime = 0;
    audio.play();
  } else {
    let idx = isShuffle
      ? Math.floor(Math.random() * playlist.length)
      : (currentIndex + 1) % playlist.length;
    loadTrack(idx, true);
  }
});

/* ── Progress ── */
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = pct + '%';
  seekSlider.value = pct;
  currentTime.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
  const t = formatTime(audio.duration);
  totalTime.textContent = t;
  // Update duration chip in playlist row
  const durEl = document.getElementById(`dur-${currentIndex}`);
  if (durEl) durEl.textContent = t;
  // Cache it back so it's available after reload
  playlist[currentIndex].duration = t;
});

audio.addEventListener('play',  () => setPlaying(true));
audio.addEventListener('pause', () => setPlaying(false));

seekSlider.addEventListener('input', () => {
  if (audio.duration) {
    audio.currentTime = (seekSlider.value / 100) * audio.duration;
  }
});

/* ── Volume ── */
volumeSlider.addEventListener('input', () => {
  const v = volumeSlider.value;
  audio.volume = v / 100;
  volFill.style.width = v + '%';
});
volFill.style.width = '75%';
audio.volume = 0.75;

/* ── Shuffle / Repeat ── */
btnShuffle.addEventListener('click', () => {
  isShuffle = !isShuffle;
  btnShuffle.classList.toggle('on', isShuffle);
});

btnRepeat.addEventListener('click', () => {
  isRepeat = !isRepeat;
  btnRepeat.classList.toggle('on', isRepeat);
});

/* ── EQ animation ── */
function animateEQ(active) {
  const bars = eqBars.querySelectorAll('.eq-bar');
  if (active) {
    eqInterval = setInterval(() => {
      bars.forEach(b => {
        b.style.height = (4 + Math.random() * 14) + 'px';
        b.style.background = 'var(--accent)';
      });
    }, 120);
  } else {
    clearInterval(eqInterval);
    bars.forEach((b, i) => {
      b.style.height = [8,14,6,12,10][i] + 'px';
      b.style.background = 'var(--text-dim)';
    });
  }
}

/* ── Keyboard shortcuts ── */
document.addEventListener('keydown', (e) => {
  // Don't intercept if typing in an input
  if (e.target.tagName === 'INPUT') return;
  switch(e.code) {
    case 'Space':
      e.preventDefault();
      btnPlay.click();
      break;
    case 'ArrowRight':
      e.preventDefault();
      btnNext.click();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      btnPrev.click();
      break;
    case 'ArrowUp':
      e.preventDefault();
      volumeSlider.value = Math.min(100, Number(volumeSlider.value) + 5);
      volumeSlider.dispatchEvent(new Event('input'));
      break;
    case 'ArrowDown':
      e.preventDefault();
      volumeSlider.value = Math.max(0, Number(volumeSlider.value) - 5);
      volumeSlider.dispatchEvent(new Event('input'));
      break;
  }
});

/* ── Audio error handling ── */
audio.addEventListener('error', () => {
  totalTime.textContent = 'Error';
  currentTime.textContent = '–:––';
});

/* ── Utils ── */
function formatTime(s) {
  if (isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2,'0')}`;
}

/* ── Init ── */
buildPlaylist();
loadTrack(0, false);
