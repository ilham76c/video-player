const playPauseButton = document.querySelector('.play-pause-btn');
const videoContainer = document.querySelector('.video-container');
const video = document.querySelector('video');

document.addEventListener('keydown', (e) => {
  switch (e.key.toLocaleLowerCase()) {
    case ' ':
    case 'k':
      togglePlay();
      break;
    default:
      break;
  }
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