/* ===========================================================
   Come to My Window — interaction
   - lock screen (passphrase: "window")
   - scroll drives a 0–180° horizontal turn of the wall
   - audio toggle (starts on unlock)
   =========================================================== */

(function () {
  "use strict";

  var PASSPHRASE = "window";

  var body = document.body;
  var lock = document.getElementById("lock");
  var form = document.getElementById("lock-form");
  var input = document.getElementById("passphrase");
  var hint = document.getElementById("lock-hint");

  var wall = document.getElementById("wall");
  var track = document.querySelector(".scroll-track");
  var experience = document.getElementById("experience");
  var scrollHint = document.getElementById("scroll-hint");

  var frontShade = document.querySelector(".face--front .face__shade");
  var backShade = document.querySelector(".face--back .face__shade");
  var labelFront = document.getElementById("label-front");
  var labelBack = document.getElementById("label-back");

  var audio = document.getElementById("audio");
  var audioToggle = document.getElementById("audio-toggle");

  /* --------------------------------------------------------
     LOCK
     -------------------------------------------------------- */
  function unlock() {
    if (!body.classList.contains("is-locked")) return;
    body.classList.remove("is-locked");
    experience.setAttribute("aria-hidden", "false");
    lock.setAttribute("aria-hidden", "true");

    // the form submit is a user gesture — safe to start audio here
    startAudio();

    // make sure we begin at the top so the turn reads front -> back
    window.scrollTo(0, 0);
    requestAnimationFrame(update);

    // remove lock from the tab order once hidden
    window.setTimeout(function () {
      lock.style.display = "none";
    }, 1200);
  }

  function rejectPass() {
    lock.classList.add("is-wrong");
    hint.textContent = "Not quite. Listen for the word in the title.";
    input.value = "";
    input.focus();
    window.setTimeout(function () {
      lock.classList.remove("is-wrong");
    }, 700);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var value = (input.value || "").trim().toLowerCase();
    if (value === PASSPHRASE) {
      unlock();
    } else {
      rejectPass();
    }
  });

  window.addEventListener("DOMContentLoaded", function () {
    input.focus();
  });

  /* --------------------------------------------------------
     AUDIO
     -------------------------------------------------------- */
  var audioReady = true;

  function reflectAudioState(playing) {
    audioToggle.classList.toggle("is-playing", playing);
    audioToggle.setAttribute("aria-pressed", playing ? "true" : "false");
  }

  function startAudio() {
    if (!audioReady) return;
    var p = audio.play();
    if (p && typeof p.then === "function") {
      p.then(function () {
        reflectAudioState(true);
      }).catch(function () {
        // No file yet, or autoplay blocked — leave it paused, user can toggle.
        reflectAudioState(false);
      });
    }
  }

  audioToggle.addEventListener("click", function () {
    if (audio.paused) {
      var p = audio.play();
      if (p && typeof p.then === "function") {
        p.then(function () {
          reflectAudioState(true);
        }).catch(function () {
          reflectAudioState(false);
        });
      }
    } else {
      audio.pause();
      reflectAudioState(false);
    }
  });

  audio.addEventListener("playing", function () { reflectAudioState(true); });
  audio.addEventListener("pause", function () { reflectAudioState(false); });
  audio.addEventListener("error", function () { audioReady = false; });

  /* --------------------------------------------------------
     SCROLL -> ROTATION
     -------------------------------------------------------- */
  var progress = 0;       // 0 .. 1
  var ticking = false;
  var hintHidden = false;

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }

  function computeProgress() {
    var rect = track.getBoundingClientRect();
    var range = rect.height - window.innerHeight;
    if (range <= 0) return 0;
    return clamp(-rect.top / range, 0, 1);
  }

  function update() {
    progress = computeProgress();
    var angle = progress * 180;

    wall.style.transform = "rotateY(" + angle.toFixed(3) + "deg)";

    // shading: darken whichever face is turning away from the light/viewer
    var rad = (angle * Math.PI) / 180;
    var facingFront = Math.cos(rad);       //  1 at 0°, -1 at 180°
    var facingBack = -facingFront;         // -1 at 0°,  1 at 180°

    // map facing [-1..1] -> shade opacity [~0.72 .. 0]
    frontShade.style.opacity = (clamp(1 - facingFront, 0, 2) * 0.42).toFixed(3);
    backShade.style.opacity = (clamp(1 - facingBack, 0, 2) * 0.42).toFixed(3);

    if (labelFront && labelBack) {
      labelFront.style.opacity = clamp(facingFront, 0, 1).toFixed(2);
      labelBack.style.opacity = clamp(facingBack, 0, 1).toFixed(2);
    }

    // hide the scroll hint once the user has begun turning the wall
    if (!hintHidden && progress > 0.04) {
      hintHidden = true;
      scrollHint.classList.add("is-hidden");
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  // initial paint
  update();
})();
