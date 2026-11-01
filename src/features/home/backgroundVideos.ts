/**
 * Background videos inside `.cvid` wrappers: a group of several videos plays in
 * sequence with a crossfade; each group only plays while its section is on screen;
 * with reduced motion only the still poster is shown. Returns a cleanup function.
 */
export function setupBackgroundVideos(reducedMotion: boolean): () => void {
  const cleanups: Array<() => void> = [];

  document.querySelectorAll<HTMLElement>('.cvid').forEach((group) => {
    const videos = Array.from(group.querySelectorAll('video'));
    const section = group.closest('section');
    if (!videos.length || !section) return;
    let current = 0;

    videos.forEach((v, k) => {
      if (k) v.classList.add('off');
      if (videos.length > 1) v.removeAttribute('loop');
      const onError = () => console.warn('Video failed to load:', v.getAttribute('src'));
      const onEnded = () => {
        if (videos.length < 2) return;
        v.classList.add('off');
        current = (current + 1) % videos.length;
        const next = videos[current];
        next.currentTime = 0;
        next.classList.remove('off');
        next.play().catch(() => {});
      };
      v.addEventListener('error', onError);
      v.addEventListener('ended', onEnded);
      cleanups.push(() => {
        v.removeEventListener('error', onError);
        v.removeEventListener('ended', onEnded);
      });
    });

    if (reducedMotion) {
      videos.forEach((v) => {
        v.removeAttribute('autoplay');
        v.pause();
      });
      return;
    }

    const play = () => videos[current].play().catch(() => {});
    const io = new IntersectionObserver((e) => (e[0].isIntersecting ? play() : videos[current].pause()), { threshold: 0.1 });
    io.observe(section);
    cleanups.push(() => io.disconnect());

    // Autoplay may be blocked until the visitor interacts.
    const resume = () => {
      const r = section.getBoundingClientRect();
      if (videos[current].paused && r.top < window.innerHeight && r.bottom > 0) play();
    };
    (['pointerdown', 'touchstart', 'keydown', 'scroll'] as const).forEach((t) => {
      window.addEventListener(t, resume, { once: true, passive: true });
      cleanups.push(() => window.removeEventListener(t, resume));
    });
  });

  return () => cleanups.forEach((fn) => fn());
}
