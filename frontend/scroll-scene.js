
(() => {
  if (!window.gsap || !window.ScrollTrigger) {
    console.warn("G13: GSAP or ScrollTrigger was not loaded.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const root = document.querySelector(".g13-scene");

  if (!root) return;

  const stage = root.querySelector(".g13-scene__stage");
  const character = root.querySelector(".g13-scene__character");
  const tilt = root.querySelector(".g13-scene__tilt");

  const motionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const mm = gsap.matchMedia();

  // Desktop / tablet cinematic scroll animation
  mm.add(
    "(min-width: 761px) and (prefers-reduced-motion: no-preference)",
    () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "+=1700",
          scrub: 1,
          pin: stage,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // markers: true, // Enable while debugging
        },
      });

      timeline.fromTo(
        character,
        {
          scale: 0.68,
          y: 130,
          rotationY: -24,
          rotationZ: -5,
          opacity: 0.45,
        },
        {
          scale: 1.2,
          y: -10,
          rotationY: 12,
          rotationZ: 0,
          opacity: 1,
          duration: 2,
          ease: "none",
        },
        0
      );

      timeline.fromTo(
        ".g13-scene__background",
        { scale: 1.15, y: 35 },
        { scale: 1.02, y: -35, duration: 3, ease: "none" },
        0
      );

      timeline.fromTo(
        ".g13-scene__ring",
        { rotation: -35, scale: 0.65, opacity: 0 },
        { rotation: 25, scale: 1.15, opacity: 0.65, duration: 2.5 },
        0.2
      );

      timeline.fromTo(
        ".g13-scene__card--left",
        { x: -240, y: 100, rotationY: 35, opacity: 0 },
        { x: 0, y: 0, rotationY: 12, opacity: 1, duration: 1 },
        1.1
      );

      timeline.fromTo(
        ".g13-scene__card--right",
        { x: 240, y: 100, rotationY: -35, opacity: 0 },
        { x: 0, y: 0, rotationY: -12, opacity: 1, duration: 1 },
        1.5
      );

      timeline.fromTo(
        ".g13-scene__caption",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        2.2
      );

      // Return cleanup for this media-query context.
      return () => timeline.scrollTrigger?.kill();
    }
  );

  // Mobile: avoid pinning and use a lighter reveal
  mm.add(
    "(max-width: 760px) and (prefers-reduced-motion: no-preference)",
    () => {
      gsap.fromTo(
        character,
        { opacity: 0, y: 45, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
            once: true,
          },
        }
      );

      gsap.from(".g13-scene__card", {
        opacity: 0,
        y: 25,
        stagger: 0.15,
        duration: 0.6,
        scrollTrigger: {
          trigger: ".g13-scene__cards",
          start: "top 85%",
          once: true,
        },
      });
    }
  );

  // Pointer-based tilt on desktop
  if (
    tilt &&
    !motionQuery.matches &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  ) {
    const setX = gsap.quickTo(tilt, "--pointer-x", {
      duration: 0.35,
      ease: "power2.out",
    });

    const setY = gsap.quickTo(tilt, "--pointer-y", {
      duration: 0.35,
      ease: "power2.out",
    });

    function onPointerMove(event) {
      const rect = stage.getBoundingClientRect();

      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      setX(`${x * 8}deg`);
      setY(`${y * -6}deg`);
    }

    function onPointerLeave() {
      setX("0deg");
      setY("0deg");
    }

    stage.addEventListener("pointermove", onPointerMove, {
      passive: true,
    });

    stage.addEventListener("pointerleave", onPointerLeave, {
      passive: true,
    });

    // Cleanup when the page context is removed
    window.addEventListener("pagehide", onPointerLeave, { once: true });
  }

  // Recalculate after images load
  if (character && !character.complete) {
    character.addEventListener("load", () => {
      ScrollTrigger.refresh();
    }, { once: true });
  }

  // Keep the page responsive to viewport changes
  window.addEventListener("load", () => {
    ScrollTrigger.refresh();
  }, { once: true });

  // Clean up when the user navigates away
  window.addEventListener("pagehide", () => {
    mm.revert();
  }, { once: true });
})();
