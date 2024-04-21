const userRecomendation = "./api/api.json";
let genereateHTML = "";
let genereateHT = "";
let generateHT3 = "";
let playBackPostion = 0;
let previousPlayPauseBtn = null;
let generatePlaylist = "";
let currentlySongPlayIdis;
fetch(userRecomendation)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    const songs = data.album[0].NewRelese.songs;
    const jsHeading1 = data.album[0].NewRelese.Playlist;
    const jsHeading2 = data.album[0].Trending.Playlist;
    const trendingInd = data.album[0].Trending.songs;
    const trendingInd2 = data.album[0].EnglishHits.songs;
    trendingInd.forEach((trendingInd) => {
      genereateHT += generateImageHTML(
        trendingInd.image,
        trendingInd.songname,
        trendingInd.artist,
        trendingInd.id,
        trendingInd.song
      );
    });
    songs.forEach((song) => {
      genereateHTML += generateImageHTML(
        song.image,
        song.songname,
        song.artist,
        song.id,
        song.song
      );
    });
    trendingInd2.forEach((song) => {
      generateHT3 += generateImageHTML(
        song.image,
        song.songname,
        song.artist,
        song.id,
        song.song
      );
    });
    document.querySelector(".show-container-js").innerHTML = genereateHTML;
    document.querySelector(".show-container-js-2").innerHTML = genereateHT;
    document.querySelector(".show-container-js-3").innerHTML = generateHT3;
    document.querySelector(".js-playlist-header1").innerText = jsHeading1;
    document.querySelector(".js-playlist-header2").innerText = jsHeading2;
    document.querySelector('.js-playlist-header3').innerText = data.album[0].EnglishHits.Playlist;
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

function generateImageHTML(image, name, artist, id, song) {
  let storArt = name.length > 14 ? name.slice(0, 14) + "..." : name;

  return `
    <div class="inside-container-element">
      <div class="show-1">
        <img
          src="${image}"
          alt=""
        />
        <div class="icons-play js-icons-play" data-song-id='${id}'>
          <div class="play-pause-main"><img src="https://img.icons8.com/ios-filled/100/FFFFFF/circled-play.png"/></div>
        </div>
      </div>
      <div class="inside-show">
        <p class="show-text-2">${storArt}</p>
        <p class="show-text-3">
          ${artist}
        </p>
      </div>
    </div>`;
}
const playPauseBtn = document.getElementById("play-pause");
const progressBar = document.querySelector(".progress");
const progressBarContainer = document.getElementById("progress-bar");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const audio = document.getElementById("audio");
const songBTn = document.querySelector(".play-pause-main");
const currentDuration = document.getElementById("currentDuration");
const songDuration = document.getElementById("songDuration");

let isPlaying = false;
let currentSongIndex = 0;
fetch(userRecomendation)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    let songs = data.album[0].NewRelese.songs;
    let trendingInd = data.album[0].Trending.songs;
    let trendingInd2 = data.album[0].EnglishHits.songs;
    const findIdx = document.querySelectorAll(".js-icons-play");

    findIdx.forEach((button, index) => {
      button.addEventListener("click", () => {
        const songId = button.getAttribute("data-song-id");
        const indexis = trendingInd.findIndex((song) => song.id === songId);
        const indexis2 = trendingInd2.findIndex((song) => song.id === songId);
    
        if (indexis !== -1) {
          songs = data.album[0].Trending.songs;
        } else if (indexis2 !== -1) {
          songs = data.album[0].EnglishHits.songs;
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

    function togglePlayPauseId(songId) {
      const playPauseBtnid = document.querySelector(
          `.js-icons-play[data-song-id="${songId}"] .play-pause-main`
      );
  
      // If the clicked button corresponds to the currently playing song
      if (currentlySongPlayIdis === songId) {
          isPlaying = !isPlaying; // Toggle play/pause state
  
          if (isPlaying) {
              playPauseBtnid.innerHTML =
                  '<img src="https://img.icons8.com/ios-filled/100/FFFFFF/circled-pause.png"/>';
              // playSong();
          } else {
              playPauseBtnid.innerHTML =
                  '<img src="https://img.icons8.com/ios-filled/100/FFFFFF/circled-play.png"/>';
              // pauseSong();
          }
      } else {
          // Pause the currently playing song (if any)
          if (currentlySongPlayIdis) {
              const prevPlayPauseBtn = document.querySelector(
                  `.js-icons-play[data-song-id="${currentlySongPlayIdis}"] .play-pause-main`
              );
              prevPlayPauseBtn.innerHTML =
                  '<img src="https://img.icons8.com/ios-filled/100/FFFFFF/circled-play.png"/>';
          }
  
          // Update the currently playing song
          currentlySongPlayIdis = songId;
  
          // Update the play/pause button for the new song
          playPauseBtnid.innerHTML =
              '<img src="https://img.icons8.com/ios-filled/100/FFFFFF/circled-pause.png"/>';
  
          isPlaying = true;
      }
  
      // Update the reference to the current play/pause button
      previousPlayPauseBtn = playPauseBtnid;
  }
  
  
    function currentlySongPlay(songId) {
      currentlySongPlayIdis = songId;
    }
    function toggleStatechange(){
      const playPauseBtnid = document.querySelector(
        `.js-icons-play[data-song-id="${currentlySongPlayIdis}"] .play-pause-main`
      );
      if (isPlaying) {
        playPauseBtnid.innerHTML =
          '<img  src="https://img.icons8.com/ios-filled/100/FFFFFF/circled-pause.png"/>';
    } else {
            playPauseBtnid.innerHTML =
          '<img src="https://img.icons8.com/ios-filled/100/FFFFFF/circled-play.png"/>';
    }
    }
    function togglePlayPause() {
      // let songState[currentSongIndex];
      // const isPlaying = songStates[songId] === true;
      // const currentlyPlayingSongId = Object.keys(songStates).find(id => songStates[id]);
    // const isPlaying = currentlyPlayingSongId ? true : false;
      // console.log(currentlyPlayingSongId);
      const playPauseBtnid = document.querySelector(
        `.js-icons-play[data-song-id="${currentlySongPlayIdis}"] .play-pause-main`
      );
      isPlaying = !isPlaying;
    if (isPlaying) {
        playPauseBtn.innerHTML =
            '<img class="play-pause-img" src="https://img.icons8.com/ios-filled/100/FFFFFF/circled-pause.png"/>';
        playPauseBtnid.innerHTML =
          '<img  src="https://img.icons8.com/ios-filled/100/FFFFFF/circled-pause.png"/>';
        playSong();
    } else {
        playPauseBtn.innerHTML =
            '<img class="play-pause-img" src="https://img.icons8.com/ios-filled/100/FFFFFF/circled-play.png"/>';
            playPauseBtnid.innerHTML =
          '<img src="https://img.icons8.com/ios-filled/100/FFFFFF/circled-play.png"/>';
        pauseSong();
    }
    }
    //audio funtion
    function audioTrack() {
      if (audio.volume === 0) {
        getimageData.innerHTML = `<img width="100" height="100" src="https://img.icons8.com/ios-filled/100/FFFFFF/mute--v1.png" alt="mute--v1"/>`;
      } else {
        getimageData.innerHTML = `<img width="100" height="100" src="https://img.icons8.com/ios-filled/100/FFFFFF/room-sound.png" alt="room-sound">`;
      }
    }
    
    const getimageData = document.getElementById("mute-btn");
    const valueManage = document.querySelector(".sound-bar");
    
    // Set initial volume to 50%
    audio.volume = 0.5;
    valueManage.value = 50;
    
    let previousVol = valueManage.value;
    
    valueManage.addEventListener("input", () => {
      let volumeGet = valueManage.value / 100;
      audio.volume = volumeGet;
      audioTrack();
    });
    
    getimageData.addEventListener("click", () => {
      if (audio.volume === 0) {
        valueManage.value = previousVol;
        audio.volume = previousVol / 100;
        audioTrack();
      } else {
        audio.volume = 0;
        valueManage.value = 0;
        audioTrack();
      }
    });
    
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") {
        if (valueManage.value < 100) {
          valueManage.value = parseInt(valueManage.value) + 10;
          audio.volume = valueManage.value / 100;
          audioTrack();
        }
      }
      if (e.key === "ArrowDown") {
        if (valueManage.value > 0) {
          valueManage.value = parseInt(valueManage.value) - 10;
          audio.volume = valueManage.value / 100;
          audioTrack();
        }
      }
      if (e.key === " " && isPlaying) {
        pauseSong();
        togglePlayPause();
      } else if (!isPlaying && e.key === " ") {
        playSong();
        togglePlayPause();
      }
    });
    
    function playSong() {
      const currentSong = songs[currentSongIndex];
      audio.src = currentSong.song;
      audio.currentTime = playBackPostion;
      audio.play();
      // audio.volume = valueManage;
    }

    function pauseSong() {
      audio.pause();
      playBackPostion = audio.currentTime;
    }

    function playNextSong() {
      if (previousPlayPauseBtn) {
        previousPlayPauseBtn.innerHTML =
            '<img src="https://img.icons8.com/ios-filled/100/FFFFFF/circled-play.png"/>';
    }
      currentSongIndex = (currentSongIndex + 1) % songs.length;
      updateSongInfo();
      playBackPostion = 0;
      if (isPlaying) {
        playSong();
      }
    }

    function playPreviousSong() {
      if (previousPlayPauseBtn) {
        previousPlayPauseBtn.innerHTML =
            '<img src="https://img.icons8.com/ios-filled/100/FFFFFF/circled-play.png"/>';
            pauseSong();
    }
      currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
      updateSongInfo();
      playBackPostion = 0;
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
      document.getElementById('currentDuration').textContent = '0:00';
      document.getElementById('songDuration').textContent = '0:00';
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
      function enterFullscreen() {
        if (elementToFullscreen.requestFullscreen) {
          elementToFullscreen.requestFullscreen();
        } else if (elementToFullscreen.webkitRequestFullscreen) {
          elementToFullscreen.webkitRequestFullscreen();
        } else if (elementToFullscreen.msRequestFullscreen) {
          elementToFullscreen.msRequestFullscreen();
        }

        // Change background image when entering fullscreen
        changeBackgroundImage(`${currentSong.image}`);
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
        currentDuration.classList.add("currentDuration-ud");
        songDuration.classList.add("songDuration-ud");
      }
      function exitFullscreen() {
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
        currentDuration.classList.remove("currentDuration-ud");
        songDuration.classList.remove("songDuration-ud");
      }
      //background image change
      if (!isElementFullscreen()) {
        changeBackgroundImage("");
      } else {
        changeBackgroundImage(`${currentSong.image}`);
      }
      // Event listener for fullscreenchange event
      document.addEventListener("fullscreenchange", () => {
        if (!isElementFullscreen()) {
          exitFullscreen();
        }
      });

      // Event listener for keydown event
      document.addEventListener("keydown", (event) => {
        if (event.key === "f" || event.key === "F") {
          enterFullscreen();
        }
        if (event.key==="F12"){
          event.preventDefault();
        }
      });
      fullscreenButton.addEventListener("click", () => {
        enterFullscreen();
      });
    }

    function updateProgressBar() {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
      if (!isNaN(duration)) {
        const progressPercentage = (currentTime / duration) * 100;
    
        // Update progress bar
        progressBar.style.width = `${progressPercentage}%`;
        const currentMinutes = Math.floor(currentTime / 60);
        const currentSeconds = Math.floor(currentTime % 60);
        document.getElementById('currentDuration').textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;
    
        // Update total duration
        const totalMinutes = Math.floor(duration / 60);
        const totalSeconds = Math.floor(duration % 60);
        document.getElementById('songDuration').textContent = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
      }
    }
    
    function setSongProgress(event) {
      const clickedPositionX =
        event.clientX - progressBarContainer.getBoundingClientRect().left;
      const progressBarWidth = progressBarContainer.offsetWidth;
      const newProgressPercentage = (clickedPositionX / progressBarWidth) * 100;
      const duration = audio.duration;
    
      // Check if duration is a valid number
      if (!isNaN(duration)) {
        const newCurrentTime = (newProgressPercentage / 100) * duration;
    
        audio.currentTime = newCurrentTime;
        progressBar.style.width = `${newProgressPercentage}%`;
    
        // Update current duration
        const currentMinutes = Math.floor(newCurrentTime / 60);
        const currentSeconds = Math.floor(newCurrentTime % 60);
        document.getElementById('currentDuration').textContent = `${currentMinutes}:${currentSeconds.toString().padStart(2, '0')}`;
      }
    }
    const songStates = {};

    let songPositions = {}; // Object to store playback position for each song

    function togglePlayPauseForSong(songId) {
      const index = songs.findIndex((song) => song.id === songId);
      if (index !== -1) {
        const isPlaying = songStates[songId] === true;
        
        // Pause the currently playing song (if any)
        const currentlyPlayingSongId = Object.keys(songStates).find(id => songStates[id]);
        if (currentlyPlayingSongId && currentlyPlayingSongId !== songId) {
          songStates[currentlyPlayingSongId] = false;
          pauseSong();
          updateSongInfo();
        }
        
        // Toggle play/pause state for the current song
        songStates[songId] = !isPlaying;
    
        if (!isPlaying) {
          // Resume from the saved playback position or start from 0 if not available
          const startPosition = songPositions[songId] || 0;
          playBackPostion = startPosition;
          
          playPauseBtn.innerHTML = '<img class="play-pause-img" src="https://img.icons8.com/ios-filled/100/FFFFFF/circled-pause.png"/>';
          currentSongIndex = index;
          updateSongInfo();
          playSong();
          togglePlayPauseId(songId);
        } else {
          // Save the current playback position
          songPositions[songId] = audio.currentTime;
    
          playPauseBtn.innerHTML = '<img class="play-pause-img" src="https://img.icons8.com/ios-filled/100/FFFFFF/circled-play.png"/>';
          pauseSong();
          updateSongInfo();
          togglePlayPauseId(songId);
        }
      }
    }
    
    
    
    
    
    // Add click event listener to each play/pause button
    const playPauseButtons = document.querySelectorAll(".js-icons-play");
    playPauseButtons.forEach((button) => {
      const songId = button.getAttribute("data-song-id");
      button.addEventListener("click", () => {
        togglePlayPauseForSong(songId);
        currentlySongPlay(songId);
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
window.addEventListener("contextmenu", handleClick);

//
// window.addEventListener('beforeunload',function (e){
//   e.preventDefault();
// })
