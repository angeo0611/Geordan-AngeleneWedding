document.addEventListener("DOMContentLoaded", () => {

  document.body.classList.add("no-scroll");

  const opening =
    document.getElementById("opening");

  const envelope =
    document.getElementById("envelope");

  const invitationCard =
    document.querySelector(".invitation-card");

  const openButton =
    document.getElementById("openInvitation");

  const musicToggle =
    document.getElementById("musicToggle");

  let musicContext,
      musicTimer,
      musicStep = 0;


  /* =====================================================
     ENVELOPE OPENING
  ===================================================== */

  function openInvitation() {

    if (!envelope || envelope.classList.contains("open")) {
      return;
    }


    /* -----------------------------------------------
       STEP 1
       OPEN THE ENVELOPE
    ----------------------------------------------- */

    envelope.classList.add("open");


    /* -----------------------------------------------
       STEP 2
       LET THE INSIDE FLAP FINISH ROTATING

       At this point the outside flap has disappeared
       and the inside flap has completed its rotation.
    ----------------------------------------------- */

    setTimeout(() => {

      if (!envelope) {
        return;
      }

      envelope.classList.add("flap-opened");

    }, 700);


    /* -----------------------------------------------
       STEP 3
       BRING THE INVITATION CARD TO THE FRONT

       This happens AFTER the inside flap is already
       behind the envelope.
    ----------------------------------------------- */

    setTimeout(() => {

      if (!envelope || !invitationCard) {
        return;
      }

      envelope.classList.add("card-in-front");

      invitationCard.classList.add("card-pull");

    }, 900);


    /* -----------------------------------------------
       STEP 4
       CENTER & ENLARGE INVITATION
    ----------------------------------------------- */

    setTimeout(() => {

      if (!invitationCard) {
        return;
      }

      invitationCard.classList.remove("card-pull");

      invitationCard.classList.add("card-display");

    }, 3500);


    /* -----------------------------------------------
       STEP 5
       FADE OPENING & UNLOCK SCROLL
    ----------------------------------------------- */

    setTimeout(() => {

      if (opening) {
        opening.classList.add("opening-away");
      }

      document.body.classList.remove("no-scroll");

      startMusic();

    }, 5000);


    /* -----------------------------------------------
       STEP 6
       SHOW HERO CONTENT & START PETALS
    ----------------------------------------------- */

    setTimeout(() => {

      if (opening) {
        opening.classList.add("opened");
      }

      createPetals(18);

    }, 13200);


    /* -----------------------------------------------
       STEP 7
       REMOVE TEMPORARY CARD
    ----------------------------------------------- */

    setTimeout(() => {

      if (invitationCard) {
        invitationCard.remove();
      }

    }, 13500);
  }


  /* =====================================================
     OPEN BUTTON
  ===================================================== */

  if (openButton) {

    openButton.addEventListener(
      "click",
      openInvitation
    );

  }


  /* =====================================================
     ENVELOPE CLICK / KEYBOARD
  ===================================================== */

  if (envelope) {

    envelope.addEventListener(
      "click",
      openInvitation
    );

    envelope.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          openInvitation();

        }

      }
    );

  }


  /* =====================================================
     MUSIC
  ===================================================== */

  const weddingMusic =
    document.getElementById("weddingMusic");

  let musicPlaying = false;


  function startMusic() {

    if (!weddingMusic) {

      console.warn(
        "weddingMusic was not found."
      );

      return;
    }


    weddingMusic.volume = 0.35;


    const playPromise =
      weddingMusic.play();


    if (playPromise !== undefined) {

      playPromise
        .then(() => {

          musicPlaying = true;


          if (musicToggle) {

            musicToggle.classList.add(
              "playing"
            );

            musicToggle.innerHTML = "♫";

          }

        })
        .catch(error => {

          console.log(
            "Music playback was blocked:",
            error
          );

        });

    }

  }


  function stopMusic() {

    if (!weddingMusic) {
      return;
    }


    weddingMusic.pause();

    musicPlaying = false;


    if (musicToggle) {

      musicToggle.classList.remove(
        "playing"
      );

      musicToggle.innerHTML = "♫";

    }

  }


  if (musicToggle) {

    musicToggle.addEventListener(
      "click",
      event => {

        event.stopPropagation();


        if (!weddingMusic) {
          return;
        }


        if (weddingMusic.paused) {

          startMusic();

        } else {

          stopMusic();

        }

      }
    );

  }


  /* =====================================================
     COUNTDOWN
  ===================================================== */

  const weddingDate =
    new Date(
      "September 28, 2026 8:30:00"
    ).getTime();


  function updateCountdown() {

    const distance =
      weddingDate - Date.now();


    if (distance <= 0) {

      const countdown =
        document.getElementById(
          "countdown"
        );


      if (countdown) {

        countdown.innerHTML =
          '<div style="grid-column:1/-1"><strong>Today is the day!</strong></div>';

      }

      return;
    }


    const days =
      Math.floor(
        distance / 86400000
      );


    const hours =
      Math.floor(
        (distance % 86400000) /
        3600000
      );


    const minutes =
      Math.floor(
        (distance % 3600000) /
        60000
      );


    const seconds =
      Math.floor(
        (distance % 60000) /
        1000
      );


    const daysElement =
      document.getElementById("days");

    const hoursElement =
      document.getElementById("hours");

    const minutesElement =
      document.getElementById("minutes");

    const secondsElement =
      document.getElementById("seconds");


    if (daysElement) {

      daysElement.textContent =
        String(days).padStart(2, "0");

    }


    if (hoursElement) {

      hoursElement.textContent =
        String(hours).padStart(2, "0");

    }


    if (minutesElement) {

      minutesElement.textContent =
        String(minutes).padStart(2, "0");

    }


    if (secondsElement) {

      secondsElement.textContent =
        String(seconds).padStart(2, "0");

    }

  }


  updateCountdown();

  setInterval(
    updateCountdown,
    1000
  );


  /* =====================================================
     SCROLL REVEAL
  ===================================================== */

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "visible"
            );

          }

        });

      },
      {
        threshold: 0.12
      }
    );


  document
    .querySelectorAll(".reveal")
    .forEach(el => {

      observer.observe(el);

    });


  /* =====================================================
     GALLERY
  ===================================================== */

  const gallery =
    document.getElementById(
      "gallerySlider"
    );


  const slides = [
    ...document.querySelectorAll(
      ".gallery-slide"
    )
  ];


  const progress =
    document.getElementById(
      "galleryProgress"
    );


  const current =
    document.getElementById(
      "currentSlide"
    );


  const total =
    document.getElementById(
      "totalSlides"
    );


  const nextButton =
    document.getElementById(
      "nextSlide"
    );


  const prevButton =
    document.getElementById(
      "prevSlide"
    );


  let index = 0;

  let timer = null;

  let startX = null;

  let startY = null;

  let moved = false;


  if (
    gallery &&
    slides.length > 0 &&
    progress &&
    current &&
    total
  ) {

    total.textContent =
      String(slides.length)
        .padStart(2, "0");


    function setGalleryImage(
      slide,
      slideIndex
    ) {

      const photo =
        slide.querySelector(
          ".gallery-placeholder"
        );


      if (!photo) {
        return;
      }


      const imageNumber =
        slideIndex + 1;


      const imagePath =
        `url("images/photo${imageNumber}.jpg")`;


      photo.style.backgroundImage =
        imagePath;


      photo.style.backgroundSize =
        "cover";


      photo.style.backgroundPosition =
        "center";


      photo.style.backgroundRepeat =
        "no-repeat";

    }


    function showSlide(nextIndex) {

      index =
        (
          nextIndex +
          slides.length
        ) %
        slides.length;


      slides.forEach(
        (slide, i) => {

          setGalleryImage(
            slide,
            i
          );


          slide.classList.toggle(
            "active",
            i === index
          );

        }
      );


      current.textContent =
        String(index + 1)
          .padStart(2, "0");


      progress.style.width =
        `${
          ((index + 1) /
          slides.length) *
          100
        }%`;

    }


    function resetTimer() {

      if (timer !== null) {

        clearInterval(timer);

      }


      timer =
        setInterval(() => {

          showSlide(index + 1);

        }, 6500);

    }


    function stopTimer() {

      if (timer !== null) {

        clearInterval(timer);

        timer = null;

      }

    }


    if (nextButton) {

      nextButton.addEventListener(
        "click",
        event => {

          event.stopPropagation();

          showSlide(index + 1);

          resetTimer();

        }
      );

    }


    if (prevButton) {

      prevButton.addEventListener(
        "click",
        event => {

          event.stopPropagation();

          showSlide(index - 1);

          resetTimer();

        }
      );

    }


    gallery.addEventListener(
      "pointerdown",
      event => {

        startX =
          event.clientX;

        startY =
          event.clientY;

        moved = false;

      }
    );


    gallery.addEventListener(
      "pointermove",
      event => {

        if (
          startX === null ||
          startY === null
        ) {

          return;

        }


        const deltaX =
          event.clientX -
          startX;


        const deltaY =
          event.clientY -
          startY;


        if (
          Math.abs(deltaX) > 10 ||
          Math.abs(deltaY) > 10
        ) {

          moved = true;

        }

      }
    );


    gallery.addEventListener(
      "pointerup",
      event => {

        if (
          startX === null ||
          startY === null
        ) {

          return;

        }


        const deltaX =
          event.clientX -
          startX;


        const deltaY =
          event.clientY -
          startY;


        const horizontalSwipe =
          Math.abs(deltaX) > 45 &&
          Math.abs(deltaX) >
            Math.abs(deltaY);


        if (horizontalSwipe) {

          if (deltaX < 0) {

            showSlide(index + 1);

          } else {

            showSlide(index - 1);

          }


          moved = true;

          resetTimer();

        }


        startX = null;

        startY = null;


        if (moved) {

          setTimeout(
            () => {

              moved = false;

            },
            50
          );

        }

      }
    );


    gallery.addEventListener(
      "pointercancel",
      () => {

        startX = null;

        startY = null;

        moved = false;

      }
    );


    gallery.addEventListener(
      "mouseenter",
      () => {

        stopTimer();

      }
    );


    gallery.addEventListener(
      "mouseleave",
      () => {

        resetTimer();

      }
    );


    showSlide(0);

    resetTimer();


    /* =================================================
       LIGHTBOX
    ================================================= */

    const lightbox =
      document.getElementById(
        "lightbox"
      );


    const lightboxImage =
      document.getElementById(
        "lightboxImage"
      );


    if (
      lightbox &&
      lightboxImage
    ) {

      slides.forEach(
        slide => {

          slide.addEventListener(
            "click",
            event => {

              if (moved) {

                moved = false;

                return;

              }


              if (
                event.target.closest(
                  ".gallery-arrow"
                )
              ) {

                return;

              }


              const placeholder =
                slide.querySelector(
                  ".gallery-placeholder"
                );


              if (!placeholder) {
                return;
              }


              const inlineBackground =
                placeholder.style
                  .backgroundImage;


              const match =
                inlineBackground.match(
                  /url\(["']?([^"')]+)["']?\)/
                );


              if (
                match &&
                match[1]
              ) {

                lightboxImage.style
                  .backgroundImage =
                    `url("${match[1]}")`;

              } else {

                lightboxImage.style
                  .backgroundImage =
                    "none";

              }


              lightbox.classList.add(
                "show"
              );


              lightbox.setAttribute(
                "aria-hidden",
                "false"
              );


              stopTimer();

            }
          );

        }
      );


      function closeLightbox() {

        lightbox.classList.remove(
          "show"
        );


        lightbox.setAttribute(
          "aria-hidden",
          "true"
        );


        lightboxImage.style
          .backgroundImage =
          "none";


        resetTimer();

      }


      const closeButton =
        document.getElementById(
          "closeLightbox"
        );


      if (closeButton) {

        closeButton.addEventListener(
          "click",
          event => {

            event.stopPropagation();

            closeLightbox();

          }
        );

      }


      lightbox.addEventListener(
        "click",
        event => {

          if (
            event.target ===
            lightbox
          ) {

            closeLightbox();

          }

        }
      );


      document.addEventListener(
        "keydown",
        event => {

          if (
            event.key ===
            "Escape"
          ) {

            if (
              lightbox.classList
                .contains("show")
            ) {

              closeLightbox();

            }

          }

        }
      );

    }

  }


  /* =====================================================
     RSVP
  ===================================================== */

  const rsvpForm =
    document.getElementById(
      "rsvpForm"
    );


  if (rsvpForm) {

    rsvpForm.addEventListener(
      "submit",
      e => {

        e.preventDefault();


        const form =
          e.currentTarget;


        const attendance =
          form.querySelector(
            'input[name="attendance"]:checked'
          );


        const guestNameElement =
          document.getElementById(
            "guestName"
          );


        const guestsElement =
          document.getElementById(
            "guests"
          );


        const messageElement =
          document.getElementById(
            "message"
          );


        const guestName =
          guestNameElement
            ? guestNameElement.value
            : "";


        const guests =
          guestsElement
            ? guestsElement.value
            : "";


        const guestMessage =
          messageElement
            ? messageElement.value
            : "";


        const status =
          attendance
            ? attendance.value
            : "Not specified";


        const details = [

          `Guest: ${guestName}`,

          `Status: ${status}`,

          `Guests: ${guests}`,

          `Message: ${
            guestMessage ||
            "No message"
          }`

        ].join("\n");


        const message =
          `Wedding RSVP\n\n${
            guestName
          } ${
            status.toLowerCase()
          }.`;



        const emailBody =
          `${message}\n\n${details}`;


        const mailto =
          `mailto:montalbangeordanlou@gmail.com?subject=${
            encodeURIComponent(
              `RSVP: ${guestName}`
            )
          }&body=${
            encodeURIComponent(
              emailBody
            )
          }`;


        const sms =
          `sms:+639639839550?body=${
            encodeURIComponent(
              message
            )
          }`;


        window.open(
          mailto,
          "_blank"
        );


        window.open(
          sms,
          "_blank"
        );


        e.currentTarget.hidden =
          true;


        const rsvpSuccess =
          document.getElementById(
            "rsvpSuccess"
          );


        if (rsvpSuccess) {

          rsvpSuccess.hidden =
            false;

        }

      }
    );

  }


  /* =====================================================
     COPY REGISTRY
  ===================================================== */

  document
    .querySelectorAll("[data-copy]")
    .forEach(button => {

      button.addEventListener(
        "click",
        async () => {

          try {

            await navigator.clipboard
              .writeText(
                button.dataset.copy
              );


            const copyStatus =
              document.getElementById(
                "copyStatus"
              );


            if (copyStatus) {

              copyStatus.textContent =
                "Copied to clipboard.";

            }

          } catch {

            const copyStatus =
              document.getElementById(
                "copyStatus"
              );


            if (copyStatus) {

              copyStatus.textContent =
                "Copy unavailable in this browser.";

            }

          }


          setTimeout(
            () => {

              const copyStatus =
                document.getElementById(
                  "copyStatus"
                );


              if (copyStatus) {

                copyStatus.textContent =
                  "";

              }

            },
            2500
          );

        }
      );

    });


  /* =====================================================
     PETALS
  ===================================================== */

  function createPetals(count) {

    const container =
      document.querySelector(
        ".petals"
      );


    if (!container) {
      return;
    }


    for (
      let i = 0;
      i < count;
      i++
    ) {

      const p =
        document.createElement(
          "span"
        );


      p.className =
        "petal";


      p.style.left =
        Math.random() * 100 +
        "%";


      p.style.top =
        -Math.random() * 20 +
        "%";


      p.style.setProperty(
        "--drift",
        (
          Math.random() * 160 -
          80
        ) + "px"
      );


      p.style.animationDuration =
        (
          7 +
          Math.random() * 7
        ) + "s";


      p.style.animationDelay =
        Math.random() * 5 +
        "s";


      container.appendChild(p);

    }

  }

});
