// src/components/GlobalAudio.jsx
import React, { useRef, useEffect, useState } from "react";
import { useSettings } from "../context/SettingsContext.jsx";

export default function GlobalAudio() {
  const audioRef = useRef(null);
  const { settings } = useSettings();
  const [isInteracted, setIsInteracted] = useState(false);
  const [audioError, setAudioError] = useState(false);

  // Handle user interaction to enable autoplay
  useEffect(() => {
    const handleInteraction = () => {
      setIsInteracted(true);
      // Remove the event listener after first interaction
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", handleInteraction);
    };

    // Add event listeners for user interaction
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
    
    // Try to play after user interaction
    if (isInteracted && audioRef.current.paused) {
      audioRef.current.play().catch(e => {
        console.log("Audio play failed:", e);
      });
    }
  }, [settings.volume, settings.muted, isInteracted]);

  // Handle audio loading errors
  const handleError = () => {
    console.error("Audio file could not be loaded");
    setAudioError(true);
  };

  // Don't render the audio element if there was an error
  if (audioError) {
    return null;
  }

  return (
    <audio
      ref={audioRef}
      src="/assets/audio/bg-music.mp3"
      loop
      onError={handleError}
      style={{ display: "none" }}
    />
  );
}