// import musicPlayoverPlaylist from "../desktop.js"

const playPauseBtn = document.getElementById("play-pause");
const progressBar = document.querySelector(".progress");
const progressBarContainer = document.getElementById("progress-bar");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const audio = document.getElementById("audio");

let isPlaying = false;
let currentSongIndex = 0;
fetch(getapi)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    let songs = data.album[0].NewRelese.songs;
    let trendingInd = data.album[0].Trending.songs;
    const findIdx = document.querySelectorAll(".js-icons-play");

    findIdx.forEach((button, index) => {
      button.addEventListener("click", () => {
        const songId = button.getAttribute("data-song-id");
        const indexis = trendingInd.findIndex((song) => song.id === songId);
        console.log(trendingInd[indexis]);

        if (indexis !== -1) {
          songs = data.album[0].Trending.songs;
        } else {
          songs = data.album[0].NewRelese.songs;
        }

        updateSongInfo();
        if (isPlaying) {
          playSong();
        }
      });
    });
    updateSongInfo();
    playPauseBtn.addEventListener("click", togglePlayPause);
    nextBtn.addEventListener("click", playNextSong);
    prevBtn.addEventListener("click", playPreviousSong);
    progressBarContainer.addEventListener("click", setSongProgress);
    audio.addEventListener("timeupdate", updateProgressBar);
    audio.addEventListener("ended", playNextSong);

    function togglePlayPause() {
      isPlaying = !isPlaying;
      if (isPlaying) {
        playPauseBtn.innerHTML =
          '<img class="play-pause-img" src="https://img.icons8.com/ios-filled/100/FFFFFF/circled-pause.png"/>';
        playSong();
      } else {
        playPauseBtn.innerHTML =
          '<img class="play-pause-img" src="https://img.icons8.com/ios-filled/100/FFFFFF/circled-play.png"/>';
        pauseSong();
      }
    }

    function playSong() {
      const currentSong = songs[currentSongIndex];
      audio.src = currentSong.song;
      audio.play();
    }

    function pauseSong() {
      audio.pause();
    }

    function playNextSong() {
      currentSongIndex = (currentSongIndex + 1) % songs.length;
      updateSongInfo();
      if (isPlaying) {
        playSong();
      }
    }

    function playPreviousSong() {
      currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
      updateSongInfo();
      if (isPlaying) {
        playSong();
      }
    }

    function updateSongInfo() {
      const currentSong = songs[currentSongIndex];
      document.querySelector(".song-title").textContent = currentSong.songname;
      document.querySelector(".song-artist").textContent = currentSong.artist;
      document.querySelector(".song-image").src = currentSong.image;
      progressBar.style.width = "0%";
      const addStyleFullscreen = document.querySelector(".playmusic");
      const imageRationChange = document.querySelector(".img-footer");
      const leftSiderMusic = document.querySelector(".left-side-music");
      const songTitle = document.querySelector(".song-title");
      const songArtist = document.querySelector(".song-artist");
      const RightSideHide = document.querySelector(".right-side-music");
      const progressBr = document.querySelector(".progress-bar");
      const middleMusic = document.querySelector(".middle-music");
      const ControlBtn = document.querySelector(".controls");
      const playPause = document.getElementById("play-pause");
      const fullscreenButton = document.getElementById("fullscreenButton");
      const elementToFullscreen = document.getElementById(
        "elementToFullscreen"
      );

      // Function to handle changing background image
      function changeBackgroundImage(imageUrl) {
        elementToFullscreen.style.backgroundImage = `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${imageUrl}')`;
        elementToFullscreen.classList.add("fullscreen-mode");
      }
      function isElementFullscreen() {
        return (
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        );
      }

      fullscreenButton.addEventListener("click", () => {
        if (elementToFullscreen.requestFullscreen) {
          elementToFullscreen.requestFullscreen();
        } else if (elementToFullscreen.webkitRequestFullscreen) {
          /* Safari */
          elementToFullscreen.webkitRequestFullscreen();
        } else if (elementToFullscreen.msRequestFullscreen) {
          /* IE11 */
          elementToFullscreen.msRequestFullscreen();
        }

        // Change background image when entering fullscreen
        changeBackgroundImage(`${currentSong.image}`); // Change the URL as needed
        addStyleFullscreen.classList.add("playmusic-ud");
        imageRationChange.classList.add("new-side-image");
        leftSiderMusic.classList.add("left-side-music-ud");
        songTitle.classList.add("songTitle-ud");
        songArtist.classList.add("songArtist-ud");
        RightSideHide.style.display = "none";
        progressBr.style.width = "80vw";
        middleMusic.style.marginBottom = "-19vw";
        ControlBtn.classList.add("controls-btn-ud");
        playPause.classList.add("play-pause-ud");
      });
      document.addEventListener("fullscreenchange", () => {
        if (!isElementFullscreen()) {
          // Remove background image when exiting fullscreen
          changeBackgroundImage("");
          elementToFullscreen.classList.remove("fullscreen-mode");
          addStyleFullscreen.classList.remove("playmusic-ud");
          imageRationChange.classList.remove("new-side-image");
          leftSiderMusic.classList.remove("left-side-music-ud");
          songTitle.classList.remove("songTitle-ud");
          songArtist.classList.remove("songArtist-ud");
          RightSideHide.style.display = "flex";
          progressBr.style.width = "40vw";
          middleMusic.style.marginBottom = "";
          ControlBtn.classList.remove("controls-btn-ud");
          playPause.classList.remove("play-pause-ud");
        }
      });
      // document.addEventListener('webkitfullscreenchange', () => {
      //   if (!isElementFullscreen()) {
      //     // Remove background image when exiting fullscreen
      //     changeBackgroundImage('');
      //   }
      // });

      // document.addEventListener('mozfullscreenchange', () => {
      //   if (!isElementFullscreen()) {
      //     // Remove background image when exiting fullscreen
      //     changeBackgroundImage('');
      //   }
      // });

      // document.addEventListener('MSFullscreenChange', () => {
      //   if (!isElementFullscreen()) {
      //     // Remove background image when exiting fullscreen
      //     changeBackgroundImage('');
      //   }
      // });
      if (!isElementFullscreen()) {
        changeBackgroundImage("");
      } else {
        changeBackgroundImage(`${currentSong.image}`);
      }
    }

    function updateProgressBar() {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
      const progressPercentage = (currentTime / duration) * 100;
      progressBar.style.width = `${progressPercentage}%`;
    }

    function setSongProgress(event) {
      const clickedPositionX =
        event.clientX - progressBarContainer.getBoundingClientRect().left;
      const progressBarWidth = progressBarContainer.offsetWidth;
      const newProgressPercentage = (clickedPositionX / progressBarWidth) * 100;
      const duration = audio.duration;
      const newCurrentTime = (newProgressPercentage / 100) * duration;
      audio.currentTime = newCurrentTime;
      progressBar.style.width = `${newProgressPercentage}%`;
    }
    const songStates = {};

    // Function to toggle play/pause for a specific song
    function togglePlayPauseForSong(songId) {
      const index = songs.findIndex((song) => song.id === songId);
      if (index !== -1) {
        const playPauseBtn = document.querySelector(
          `.js-icons-play[data-song-id="${songId}"] .play-pause-main`
        );
        console.log(playPauseBtn);
        // Toggle play/pause state for the current song
        songStates[songId] = !songStates[songId];

        if (songStates[songId]) {
          playPauseBtn.innerHTML =
            '<img src="https://img.icons8.com/ios-filled/100/FFFFFF/circled-pause.png"/>';
          currentSongIndex = index;
          updateSongInfo();
          playSong();
          togglePlayPause();
        } else {
          playPauseBtn.innerHTML =
            '<img src="https://img.icons8.com/ios-filled/100/FFFFFF/circled-play.png"/>';
          pauseSong();
          updateSongInfo();
          togglePlayPause();
        }
      }
    }

    // Add click event listener to each play/pause button
    const playPauseButtons = document.querySelectorAll(".js-icons-play");
    playPauseButtons.forEach((button) => {
      const songId = button.getAttribute("data-song-id");
      button.addEventListener("click", () => {
        togglePlayPauseForSong(songId);
      });
    });
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

//blockrightClick
function handleClick(event) {
  event.preventDefault();
}
// window.addEventListener("contextmenu", handleClick);
