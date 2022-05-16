const playPauseButton = document.querySelector('.play-pause-btn');
const theaterButton = document.querySelector('.theater-btn');
const fullScreenButton = document.querySelector('.full-screen-btn');
const miniPlayerButton = document.querySelector('.mini-player-btn');
const muteBtn = document.querySelector('.mute-btn');
const volumeSlider = document.querySelector('.volume-slider');
const currentTime = document.querySelector('.current-time');
const totalTime = document.querySelector('.total-time');
const videoContainer = document.querySelector('.video-container');
const video = document.querySelector('video');

document.addEventListener('keydown', (e) => {
  switch (e.key.toLocaleLowerCase()) {
    case ' ':
    case 'k':
      togglePlay();
      break;
    case 'f':
      toggleFullScreenMode();
      break;
    case 't':
      toggleTheaterMode();
      break;
    case 'i':
      toggleMiniPlayerMode();
      break;
    case 'm':
      toggleMute();
      break;
    case 'arrowright':
    case 'l':
      skip(5);
      break;
    default:
      break;
  }
})

// Duration
video.addEventListener('loadeddata', () => {
  totalTime.textContent = formatDuration(video.duration);
});

video.addEventListener('timeupdate', () => {
  currentTime.textContent = formatDuration(video.currentTime);
});

const loadingZeroFormatter = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2
});

function formatDuration(time) {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600);

  if (hours === 0) {
    return `${minutes}:${loadingZeroFormatter.format(seconds)}`
  } else {
    return `${hours}:${loadingZeroFormatter.format(minutes)}:${loadingZeroFormatter.format(seconds)}`
  }
}

function skip(duration) {
  video.currentTime += duration;
}

// Volume
muteBtn.addEventListener('click', toggleMute);

volumeSlider.addEventListener('input', (e) => {
  video.volume = e.target.value;
  video.muted = e.target.value === 0;
})

function toggleMute() {
  video.muted = !video.muted;
}

video.addEventListener('volumechange', () => {
  volumeSlider.value = video.volume;
  let volumeLevel;
  if (video.muted || video.volume === 0) {
    volumeSlider.value = 0;
    volumeLevel = 'muted';
  } else if (video.volume >= .5) {
    volumeLevel = 'high';
  } else {
    volumeLevel = 'low';
  }
  videoContainer.dataset.volumeLevel = volumeLevel;
});

// View Modes
theaterButton.addEventListener('click', toggleTheaterMode);
fullScreenButton.addEventListener('click', toggleFullScreenMode);
miniPlayerButton.addEventListener('click', toggleMiniPlayerMode);

function toggleTheaterMode() {
  videoContainer.classList.toggle('theater');
}

function toggleFullScreenMode() {
  if (document.fullscreenElement == null) {
    videoContainer.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function toggleMiniPlayerMode() {
  if (videoContainer.classList.contains('mini-player')) {
    document.exitPictureInPicture();
  } else {
    video.requestPictureInPicture();
  }
}

document.addEventListener('fullscreenchange', () => {
  videoContainer.classList.toggle('full-screen', document.fullscreenElement);
});

video.addEventListener('enterpictureinpicture', () => {
  videoContainer.classList.add('mini-player');
});

video.addEventListener('leavepictureinpicture', () => {
  videoContainer.classList.remove('mini-player');
})

// Play or Pause
playPauseButton.addEventListener('click', togglePlay);

video.addEventListener('click', togglePlay());

function togglePlay() {
  video.paused ? video.play() : video.pause();
}

video.addEventListener('play', () => {
  videoContainer.classList.remove('paused');
});

video.addEventListener('pause', () => {
  videoContainer.classList.add('paused');
})