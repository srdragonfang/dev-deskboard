// const APIURL = "tracks";

// getTracks(APIURL);
// function getTracks(APIURL) {
//   fetch(APIURL)
//     .then((res) => res.json())
//     .then((data) => showTracks(data));
// }
// function showTracks(tracks) {
//   console.log(tracks);
// }
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "MUSIC_PLAYER_2";
const playStatus = $(".player");
const playlist = $(".playlist");
const trackName = $(".album-info__name");
const trackSinger = $(".album-info__track");
const trackThumb = $(".player-cover__item");
const trackURL = $("#audio");

const playBtn = $("#play");
const playIcon = $(".fa-play");
const pauseIcon = $(".fa-pause");
const nextBtn = $("#next");
const prevBtn = $("#backward");
const randomBtn = $("#randomTrack");
const repeatBtn = $("#repeatTrack");
const favBtn = $("#favTrack");

const progress = $("#audioRange");
const progressTime = $(".progress__time");
const progressDuration = $(".progress__duration");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  isFav: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

  tracks: [
  {
            title: "γγΆγ",
            artist: "Yoasobi",
            path: "assets/audio/Tabun.mp3",
            imgUrl: "assets/image/Tabun.jpg"
        },

    {
      title: "Still Life",
      artist: "Big Bang",
      path: "assets/audio/1.mp3",
      imgUrl: "assets/image/1.jpg",
    },
    {
      title: "Unstopable",
      artist: "Sia",
      path: "assets/audio/2.mp3",
      imgUrl: "assets/image/2.jpg",
    },
    {
      title: "Runaway",
      artist: "Aurora",
      path: "assets/audio/3.mp3",
      imgUrl: "assets/image/3.jpg",
    },

    {
      title: "In The End",
      artist: "Linkin Park",
      path: "assets/audio/4.mp3",
      imgUrl: "assets/image/4.jpg",
    },
    {
      title: "Arcade",
      artist: "Duncan Laurence",
      path: "assets/audio/5.mp3",
      imgUrl: "assets/image/5.jpg",
    },
    {
      title: "Waiting For Love",
      artist: "Avicii",
      path: "assets/audio/6.mp3",
      imgUrl: "assets/image/6.jpg",
    },
    {
      title: "Life Goes On",
      artist: "Oliver Tree",
      path: "assets/audio/7.mp3",
      imgUrl: "assets/image/7.jpg",
    },
    {
      title: "Numb",
      artist: "Linkin Park",
      path: "assets/audio/8.mp3",
      imgUrl: "assets/image/8.jpg",
    },
    {
      title: "Counting Stars",
      artist: "OneRepublic",
      path: "assets/audio/9.mp3",
      imgUrl: "assets/image/9.jpg",
    },
    {
      title: "Warriors",
      artist: "Imagine Dragons",
      path: "assets/audio/10.mp3",
      imgUrl: "assets/image/10.jpg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },

  render: function () {
    const htmls = this.tracks.map((track, index) => {
      return `
      <div class="track ${
        index === this.currentIndex ? "active" : ""
      }" data-index="${index}">
      <p class="track-item">
      ${track.title} - ${track.artist}
      </p>
      </div>

      `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentTrack", {
      get: function () {
        return this.tracks[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const trackThumbAnimate = trackThumb.animate(
      [{ transform: "rotate(360deg)" }],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    trackThumbAnimate.pause();
    // track play/pause
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      audio.onplay = function () {
        _this.isPlaying = true;
        playIcon.style.display = "none";
        pauseIcon.style.display = "flex";
        playStatus.classList.add("playing");
        trackThumbAnimate.play();
      };
      audio.onpause = function () {
        _this.isPlaying = false;
        playIcon.style.display = "flex";
        pauseIcon.style.display = "none";
        playStatus.classList.remove("playing");
        trackThumbAnimate.pause();
      };
    };
    // track prev/next audio
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomTrack();
      } else {
        _this.prevTrack();
      }
      audio.play();
      _this.render();
      _this.scrollToAcitveSong();
    };
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomTrack();
      } else {
        _this.nextTrack();
      }
      audio.play();
      _this.render();
      _this.scrollToAcitveSong();
    };

    // track time bars
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // track end
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };
    // track random/repeat
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", this.isRandom);
    };
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", this.isRepeat);
    };
    favBtn.onclick = function (e) {
      _this.isFav = !_this.isFav;
      _this.setConfig("isFav", _this.isFav);
      favBtn.classList.toggle("active", this.isFav);
    };

    // playlist
    playlist.onclick = function (e) {
      const trackNode = e.target.closest(".track:not(.active)");
      if (trackNode) {
        _this.currentIndex = Number(trackNode.dataset.index);
        _this.loadCurrentTrack();
        _this.render();
        playBtn.click();
        audio.play();
      }
    };
  },
  prevTrack: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.tracks.length - 1;
    }
    this.loadCurrentTrack();
  },
  nextTrack: function () {
    this.currentIndex++;
    if (this.currentIndex > this.tracks.length - 1) {
      this.currentIndex = 0;
    }
    this.loadCurrentTrack();
  },
  playRandomTrack: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.tracks.length);
    } while (this.currentIndex === this.currentTrack);
    this.currentIndex = newIndex;
    this.loadCurrentTrack();
  },
  scrollToAcitveSong: function () {
    setTimeout(function () {
      $(".track.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
    this.isFav = this.config.isFav;
  },
  loadCurrentTrack: function () {
    trackName.textContent = this.currentTrack.title;
    trackSinger.textContent = this.currentTrack.artist;
    trackURL.src = this.currentTrack.path;
    trackThumb.style.backgroundImage = `url('${this.currentTrack.imgUrl}')`;
  },
  start: function () {
    this.loadConfig();
    this.handleEvents();
    this.defineProperties();
    this.loadCurrentTrack();
    this.render();

    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
    favBtn.classList.toggle("active", this.isFav);
  },
};
app.start();

