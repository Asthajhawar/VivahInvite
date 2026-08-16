"use client";

/**
 * BackgroundAudio
 * ---------------
 * Creates the shared Audio object and manages its lifecycle for the session.
 *
 * Audio unlock strategy:
 *  • The Audio element starts MUTED and attempts immediate autoplay
 *    (muted autoplay is widely permitted on desktop browsers).
 *  • On the first visit, the "Tap to Begin" indicator in HeroArch acts as the
 *    user-gesture gate: its click handler calls audio.unmute() + audio.play()
 *    synchronously — this is the valid gesture browsers require.
 *  • On return visits (sessionStorage flag already set), the audio starts
 *    unmuted directly since the policy gate has already been satisfied.
 *  • visibilitychange: resumes playback when the user returns to the tab.
 *
 * The audio object is shared via window.__vivahAudio so HeroArch can access it
 * without prop drilling through the component tree.
 */

import { useEffect } from "react";

const AUDIO_SRC   = "/audio/Piya-Ghar-Aayege.mp3";
const SESSION_KEY = "vivah_audio_unlocked";

export default function BackgroundAudio() {
  useEffect(() => {
    const alreadyUnlocked = !!sessionStorage.getItem(SESSION_KEY);

    const audio = new Audio(AUDIO_SRC);
    audio.loop    = true;
    audio.preload = "auto";
    audio.volume  = 0.65;

    // Expose globally so HeroArch's tap handler can unmute it
    (window as any).__vivahAudio = audio;

    if (alreadyUnlocked) {
      // Return visit: start unmuted straight away
      audio.muted = false;
      audio.play().catch(() => {
        // Some browsers still block on a fresh tab — stay muted until any gesture
        audio.muted = true;
        audio.play()
          .then(() => { audio.muted = false; })
          .catch(() => {});
      });
    } else {
      // First visit: start muted (gate tap in HeroArch will unmute)
      audio.muted = true;
      audio.play().catch(() => {
        // Autoplay blocked entirely — tap gate will call play() again
      });
    }

    const onVisibilityChange = () => {
      if (!document.hidden && audio.paused) {
        audio.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      audio.pause();
      delete (window as any).__vivahAudio;
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return null;
}
