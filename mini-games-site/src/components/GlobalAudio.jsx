// src/components/GlobalAudio.jsx
import React, { useRef, useEffect, useState } from "react";
import { useSettings } from "../context/SettingsContext.jsx";
//import bgMusic from "../assets/audio/bg-music.mp3";

export default function GlobalAudio() {
  const audioRef = useRef(null);
  const { settings } = useSettings();
  const [isInteracted, setIsInteracted] = useState(false);
  const [audioError, setAudioError] = useState(false);

  // Handle user interaction to enable autoplay
  useEffect(() => {
    const handleInteraction = () => {
      setIsInteracted(true);
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    document.addEventListener("keydown", handleInteraction);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };
  }, []);

  // Update audio settings when they change
  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.volume = settings.volume;
    audioRef.current.muted = settings.muted;

    if (isInteracted && audioRef.current.paused) {
      audioRef.current.play().catch((e) => {
        console.log("Audio play failed:", e);
      });
    }
  }, [settings.volume, settings.muted, isInteracted]);

  const handleError = () => {
    console.error("Audio file could not be loaded");
    setAudioError(true);
  };

  if (audioError) {
    return null;
  }

  return (
  <audio
    ref={audioRef}
    src="/assets/audio/bg-music.mp3"  // note the leading slash and _assets
    loop
    onError={handleError}
    style={{ display: "none" }}
  />
);

}
