// src/components/GlobalAudio.jsx
import React, { useRef, useEffect } from "react";
import { useSettings } from "../context/SettingsContext.jsx";

export default function GlobalAudio() {
  const audioRef = useRef(null);
  const { settings } = useSettings();

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = settings.volume;
    audioRef.current.muted = settings.muted;
  }, [settings.volume, settings.muted]);

  return (
    <audio
      ref={audioRef}
      src="/assets/audio/bg-music.mp3"
      loop
      autoPlay
    />
  );
}
