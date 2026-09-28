const bgm = document.getElementById('bgm');
const toggle = document.getElementById('musicToggle');
const fill = document.getElementById('musicFill');
const vol = document.getElementById('musicVol');
const title = document.getElementById('musicTitle');

bgm.volume = 0.4;

// Daftar BGM (bisa lo tambah)
const playlist = [
  { title: 'Anime Shadow — Zero Theme', src: 'assets/bgm.mp3' }
];
title.textContent = playlist[0].title;

// AUTO PLAY saat interaksi pertama (browser policy)
function tryAutoPlay(){
  bgm.play().then(()=>{
    toggle.textContent = '❚❚';
  }).catch(()=>{
    // kalau diblokir, tunggu klik user
    document.body.addEventListener('click', firstPlay, { once:true });
    document.body.addEventListener('keydown', firstPlay, { once:true });
  });
}
function firstPlay(){
  bgm.play().then(()=> toggle.textContent = '❚❚').catch(()=>{});
}
tryAutoPlay();

// Toggle
toggle.addEventListener('click', ()=>{
  if (bgm.paused){ bgm.play(); toggle.textContent = '❚❚'; }
  else { bgm.pause(); toggle.textContent = '▶'; }
});

// Progress bar
bgm.addEventListener('timeupdate', ()=>{
  if (bgm.duration) fill.style.width = (bgm.currentTime / bgm.duration * 100) + '%';
});

// Volume
vol.addEventListener('input', e => bgm.volume = e.target.value);
