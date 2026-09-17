document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("no-scroll");

  const opening = document.getElementById("opening");
  const envelope = document.getElementById("envelope");
  const invitationCard = document.querySelector(".invitation-card");
  const openButton = document.getElementById("openInvitation");
  const musicToggle = document.getElementById("musicToggle");
  const weddingMusic = document.getElementById("weddingMusic");

  /* =====================================================
     MUSIC CONTROL
  ===================================================== */
  let musicPlaying = false;

  function updateMusicUI(isPlaying) {
    musicPlaying = isPlaying;
    if (musicToggle) {
      musicToggle.classList.toggle("playing", isPlaying);
      musicToggle.innerHTML = "♫";
    }
  }

  function startMusic() {
    if (!weddingMusic) {
      console.warn("weddingMusic element was not found.");
      return;
    }

    weddingMusic.volume = 0.35;
    const playPromise = weddingMusic.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => updateMusicUI(true))
        .catch(error => {
          console.log("Music playback blocked by browser policy:", error);

          const unlockAudio = () => {
            weddingMusic
              .play()
              .then(() => updateMusicUI(true))
              .catch(e => console.log("Unlock failed:", e));
          };

          document.addEventListener("touchstart", unlockAudio, { once: true });
          document.addEventListener("click", unlockAudio, { once: true });
        });
    }
  }

  function stopMusic() {
    if (!weddingMusic) return;
    weddingMusic.pause();
    updateMusicUI(false);
  }

  if (musicToggle) {
    musicToggle.addEventListener("click", event => {
      event.stopPropagation();
      if (!weddingMusic) return;

      if (weddingMusic.paused) {
        startMusic();
      } else {
        stopMusic();
      }
    });
  }

  /* =====================================================
     ENVELOPE OPENING
  ===================================================== */
  function openInvitation() {
    if (!envelope || envelope.classList.contains("open")) {
      return;
    }

    // Trigger music on explicit gesture
    startMusic();

    envelope.classList.add("open");

    // Sequence timeouts
    setTimeout(() => {
      if (envelope) envelope.classList.add("flap-opened");
    }, 700);

    setTimeout(() => {
      if (envelope && invitationCard) {
        envelope.classList.add("card-in-front");
        invitationCard.classList.add("card-pull");
      }
    }, 900);

    setTimeout(() => {
      if (invitationCard) {
        invitationCard.classList.remove("card-pull");
        invitationCard.classList.add("card-display");
      }
    }, 3500);

    setTimeout(() => {
      if (opening) opening.classList.add("opening-away");
      document.body.classList.remove("no-scroll");
    }, 5000);

    setTimeout(() => {
      if (opening) opening.classList.add("opened");
      createPetals(18);
    }, 13200);

    setTimeout(() => {
      if (invitationCard) invitationCard.remove();
    }, 13500);
  }

  if (openButton) {
    openButton.addEventListener("click", openInvitation);
  }

  if (envelope) {
    envelope.addEventListener("click", openInvitation);
    envelope.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openInvitation();
      }
    });
  }

  /* =====================================================
     COUNTDOWN
  ===================================================== */
  const weddingDate = new Date("September 28, 2026 08:30:00").getTime();

  function updateCountdown() {
    const distance = weddingDate - Date.now();

    if (distance <= 0) {
      const countdown = document.getElementById("countdown");
      if (countdown) {
        countdown.innerHTML =
          '<div style="grid-column:1/-1"><strong>Today is the day!</strong></div>';
      }
      return;
    }

    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);

    const elements = {
      days: document.getElementById("days"),
      hours: document.getElementById("hours"),
      minutes: document.getElementById("minutes"),
      seconds: document.getElementById("seconds")
    };

    if (elements.days) elements.days.textContent = String(days).padStart(2, "0");
    if (elements.hours) elements.hours.textContent = String(hours).padStart(2, "0");
    if (elements.minutes) elements.minutes.textContent = String(minutes).padStart(2, "0");
    if (elements.seconds) elements.seconds.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* =====================================================
     SCROLL REVEAL
  ===================================================== */
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  /* =====================================================
     GALLERY & LIGHTBOX
  ===================================================== */
  const gallery = document.getElementById("gallerySlider");
  const slides = [...document.querySelectorAll(".gallery-slide")];
  const progress = document.getElementById("galleryProgress");
  const current = document.getElementById("currentSlide");
  const total = document.getElementById("totalSlides");
  const nextButton = document.getElementById("nextSlide");
  const prevButton = document.getElementById("prevSlide");

  let index = 0;
  let timer = null;
  let startX = null;
  let startY = null;
  let moved = false;

  if (gallery && slides.length > 0 && progress && current && total) {
    total.textContent = String(slides.length).padStart(2, "0");

    function setGalleryImage(slide, slideIndex) {
      const photo = slide.querySelector(".gallery-placeholder");
      if (!photo) return;

      const imageNumber = slideIndex + 1;
      photo.style.backgroundImage = `url("images/photo${imageNumber}.jpg")`;
      photo.style.backgroundSize = "cover";
      photo.style.backgroundPosition = "center";
      photo.style.backgroundRepeat = "no-repeat";
    }

    function showSlide(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;

      slides.forEach((slide, i) => {
        setGalleryImage(slide, i);
        slide.classList.toggle("active", i === index);
      });

      current.textContent = String(index + 1).padStart(2, "0");
      progress.style.width = `${((index + 1) / slides.length) * 100}%`;
    }

    function resetTimer() {
      if (timer !== null) clearInterval(timer);
      timer = setInterval(() => showSlide(index + 1), 6500);
    }

    function stopTimer() {
      if (timer !== null) {
        clearInterval(timer);
        timer = null;
      }
    }

    if (nextButton) {
      nextButton.addEventListener("click", event => {
        event.stopPropagation();
        showSlide(index + 1);
        resetTimer();
      });
    }

    if (prevButton) {
      prevButton.addEventListener("click", event => {
        event.stopPropagation();
        showSlide(index - 1);
        resetTimer();
      });
    }

    gallery.addEventListener("pointerdown", event => {
      startX = event.clientX;
      startY = event.clientY;
      moved = false;
    });

    gallery.addEventListener("pointermove", event => {
      if (startX === null || startY === null) return;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;

      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        moved = true;
      }
    });

    gallery.addEventListener("pointerup", event => {
      if (startX === null || startY === null) return;

      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      const horizontalSwipe =
        Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY);

      if (horizontalSwipe) {
        showSlide(deltaX < 0 ? index + 1 : index - 1);
        moved = true;
        resetTimer();
      }

      startX = null;
      startY = null;

      if (moved) {
        setTimeout(() => {
          moved = false;
        }, 50);
      }
    });

    gallery.addEventListener("pointercancel", () => {
      startX = null;
      startY = null;
      moved = false;
    });

    gallery.addEventListener("mouseenter", stopTimer);
    gallery.addEventListener("mouseleave", resetTimer);

    showSlide(0);
    resetTimer();

    // Lightbox Setup
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");

    if (lightbox && lightboxImage) {
      slides.forEach(slide => {
        slide.addEventListener("click", event => {
          if (moved) {
            moved = false;
            return;
          }

          if (event.target.closest(".gallery-arrow")) return;

          const placeholder = slide.querySelector(".gallery-placeholder");
          if (!placeholder) return;

          const inlineBackground = placeholder.style.backgroundImage;
          const match = inlineBackground.match(/url\(["']?([^"')]+)["']?\)/);

          if (match && match[1]) {
            lightboxImage.style.backgroundImage = `url("${match[1]}")`;
          } else {
            lightboxImage.style.backgroundImage = "none";
          }

          lightbox.classList.add("show");
          lightbox.setAttribute("aria-hidden", "false");
          stopTimer();
        });
      });

      function closeLightbox() {
        lightbox.classList.remove("show");
        lightbox.setAttribute("aria-hidden", "true");
        lightboxImage.style.backgroundImage = "none";
        resetTimer();
      }

      const closeButton = document.getElementById("closeLightbox");
      if (closeButton) {
        closeButton.addEventListener("click", event => {
          event.stopPropagation();
          closeLightbox();
        });
      }

      lightbox.addEventListener("click", event => {
        if (event.target === lightbox) closeLightbox();
      });

      document.addEventListener("keydown", event => {
        if (event.key === "Escape" && lightbox.classList.contains("show")) {
          closeLightbox();
        }
      });
    }
  }

  /* =====================================================
     RSVP FORM
  ===================================================== */
  const rsvpForm = document.getElementById("rsvpForm");

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", e => {
      e.preventDefault();

      const form = e.currentTarget;
      const attendance = form.querySelector('input[name="attendance"]:checked');
      const guestNameElement = document.getElementById("guestName");
      const guestsElement = document.getElementById("guests");
      const messageElement = document.getElementById("message");

      const guestName = guestNameElement ? guestNameElement.value : "";
      const guests = guestsElement ? guestsElement.value : "";
      const guestMessage = messageElement ? messageElement.value : "";
      const status = attendance ? attendance.value : "Not specified";

      const details = [
        `Guest: ${guestName}`,
        `Status: ${status}`,
        `Guests: ${guests}`,
        `Message: ${guestMessage || "No message"}`
      ].join("\n");

      const message = `Wedding RSVP\n\n${guestName} ${status.toLowerCase()}.`;
      const emailBody = `${message}\n\n${details}`;

      const mailto = `mailto:montalbangeordanlou@gmail.com?subject=${encodeURIComponent(
        `RSVP: ${guestName}`
      )}&body=${encodeURIComponent(emailBody)}`;

      // Open email link (SMS popup usually blocked when called simultaneously)
      window.location.href = mailto;

      e.currentTarget.hidden = true;
      const rsvpSuccess = document.getElementById("rsvpSuccess");
      if (rsvpSuccess) {
        rsvpSuccess.hidden = false;
      }
    });
  }

  /* =====================================================
     COPY REGISTRY
  ===================================================== */
  document.querySelectorAll("[data-copy]").forEach(button => {
    button.addEventListener("click", async () => {
      const copyStatus = document.getElementById("copyStatus");
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        if (copyStatus) copyStatus.textContent = "Copied to clipboard.";
      } catch {
        if (copyStatus) copyStatus.textContent = "Copy unavailable in this browser.";
      }

      setTimeout(() => {
        if (copyStatus) copyStatus.textContent = "";
      }, 2500);
    });
  });

  /* =====================================================
     PETALS ANIMATION
  ===================================================== */
  function createPetals(count) {
    const container = document.querySelector(".petals");
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "petal";
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${-Math.random() * 20}%`;
      p.style.setProperty("--drift", `${Math.random() * 160 - 80}px`);
      p.style.animationDuration = `${7 + Math.random() * 7}s`;
      p.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(p);
    }
  }
});
