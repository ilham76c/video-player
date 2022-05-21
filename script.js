// video
const video = document.querySelector('video');
// button
const playPauseButton = document.querySelector('.play-pause-btn');
const theaterButton = document.querySelector('.theater-btn');
const fullScreenButton = document.querySelector('.full-screen-btn');
const miniPlayerButton = document.querySelector('.mini-player-btn');
const muteBtn = document.querySelector('.mute-btn');
const captionsBtn = document.querySelector('.captions-btn');
const speedBtn = document.querySelector('.speed-btn');
const volumeSlider = document.querySelector('.volume-slider');
// time
const currentTime = document.querySelector('.current-time');
const totalTime = document.querySelector('.total-time');
// image
const previewImg = document.querySelector('.preview-img');
const thumbnailImg = document.querySelector('.thumbnail-img');
// container
const videoContainer = document.querySelector('.video-container');
const timelineContainer = document.querySelector('.timeline-container');

document.addEventListener('keydown', (e) => {
  const tagName = document.activeElement.tagName.toLowerCase()

  if (tagName === "input") return

  switch (e.key.toLocaleLowerCase()) {
    case ' ':
      if (tagName === "button") return
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
    case 'c':
      toggleCaptions();
      break;
    default:
      break;
  }
});


/**
 * Timeline
 */
let isScrubbing = false;
let wasPaused;

timelineContainer.addEventListener('mousemove', handleTimelineUpdate);
timelineContainer.addEventListener('mousedown', toggleScrubbing);

document.addEventListener('mouseup', (e) => {
  if (isScrubbing) toggleScrubbing(e);
});

document.addEventListener('mousemove', (e) => {
  if (isScrubbing) handleTimelineUpdate(e);
});

function toggleScrubbing(e) {
  const rect = timelineContainer.getBoundingClientRect();
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
  isScrubbing = (e.buttons & 1) === 1;
  videoContainer.classList.toggle('scrubbing', isScrubbing);

  if (isScrubbing) {
    wasPaused = video.paused;
    video.pause();
  } else {
    video.currentTime = percent * video.duration;
    if (!wasPaused) video.play();
  }

  handleTimelineUpdate(e);
}

function handleTimelineUpdate(e) {
  const rect = timelineContainer.getBoundingClientRect();
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
  const previewImgNumber = Math.max(1, Math.floor((percent * video.duration) / 10));
  const previewImgSrc = `assets/previewImgs/preview${previewImgNumber}.jpg`;
  previewImg.src = previewImgSrc;
  timelineContainer.style.setProperty('--preview-position', percent);

  if (isScrubbing) {
    e.preventDefault();
    thumbnailImg.src = previewImgSrc;
    timelineContainer.style.setProperty('--preview-position', percent);
  }
}
/**
 * End Timeline
 */


/**
 * Playback Speed
 */
speedBtn.addEventListener('click', changePlaybackSpeed);

function changePlaybackSpeed() {
  let newPlaybackRate = video.playbackRate + 0.25;

  if (newPlaybackRate > 2) {
    newPlaybackRate = 0.25;
  }
  
  video.playbackRate = newPlaybackRate;
  speedBtn.textContent = `${newPlaybackRate}x`;
}
/**
 * End Playback Speed
 */


/**
 * Captions
 */
const captions = video.textTracks[0];

captions.mode = 'hidden';
captionsBtn.addEventListener('click', toggleCaptions);

function toggleCaptions() {
  const isHidden = captions.mode === 'hidden';
  videoContainer.classList.toggle('captions', isHidden);
  
  captions.mode = isHidden ? 'showing' : 'hidden';
}
/**
 * End Captions
 */


/**
 * Duration
 */
video.addEventListener('loadeddata', () => {
  totalTime.textContent = formatDuration(video.duration);
});

video.addEventListener('timeupdate', () => {
  currentTime.textContent = formatDuration(video.currentTime);
  const percent = video.currentTime / video.duration;
  timelineContainer.style.setProperty('--progress-position', percent);
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
/**
 * End Duration
 */


/**
 * Volume
 */
muteBtn.addEventListener('click', toggleMute);

function toggleMute() {
  video.muted = !video.muted;
}

volumeSlider.addEventListener('input', (e) => {
  video.volume = e.target.value;
  video.muted = e.target.value === 0;
});

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
/**
 * End Volume
 */


/**
 * View Modes
 */
document.addEventListener('fullscreenchange', () => {
  videoContainer.classList.toggle('full-screen', document.fullscreenElement);
});

video.addEventListener('enterpictureinpicture', () => {
  videoContainer.classList.add('mini-player');
});

video.addEventListener('leavepictureinpicture', () => {
  videoContainer.classList.remove('mini-player');
});

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
/**
 * End View Modes
 */


/**
 * Play or Pause
 */
video.addEventListener('click', togglePlay);

video.addEventListener('play', () => {
  videoContainer.classList.remove('paused');
});

video.addEventListener('pause', () => {
  videoContainer.classList.add('paused');
})

playPauseButton.addEventListener('click', togglePlay);

function togglePlay() {
  video.paused ? video.play() : video.pause();
}
/**
 * End Play or Pause
 */