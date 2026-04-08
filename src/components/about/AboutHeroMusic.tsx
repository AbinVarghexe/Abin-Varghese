"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ElasticVolumeSlider } from "@/components/ui/elastic-volume-slider";
import { cn } from "@/lib/utils";

const LOCAL_AUDIO_URL =
  "/music/Am%20I%20Dreaming%20(Metro%20Boomin%20%26%20A%24AP%20Rocky%2C%20Roisee).mp3";

export default function AboutHeroMusic() {
  const controlRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousVolumeRef = useRef(24);
  const volumeRef = useRef(24);
  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volumePercent, setVolumePercent] = useState(24);

  useEffect(() => {
    const audio = new Audio(LOCAL_AUDIO_URL);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = volumeRef.current / 100;
    audioRef.current = audio;

    const handleCanPlay = () => {
      setIsReady(true);
    };

    if (audio.readyState >= 2) {
      setIsReady(true);
    }

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.pause();
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    volumeRef.current = volumePercent;
    if (volumePercent > 0) {
      previousVolumeRef.current = volumePercent;
    }

    if (audioRef.current) {
      audioRef.current.volume = volumePercent / 100;
    }
  }, [volumePercent]);

  const attemptPlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !isVisible || volumeRef.current <= 0) return;

    try {
      audio.volume = volumeRef.current / 100;
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }, [isVisible]);

  useEffect(() => {
    const observedElement =
      document.getElementById("about-page-audio-root") ?? controlRef.current;
    if (!observedElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);

        if (!entry.isIntersecting) {
          audioRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(observedElement);

    return () => {
      observer.disconnect();
      audioRef.current?.pause();
      setIsPlaying(false);
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !isReady) return;
    void attemptPlayback();
  }, [attemptPlayback, isReady, isVisible]);

  useEffect(() => {
    if (!isVisible || !isReady) return;

    const handleFirstInteraction = () => {
      void attemptPlayback();
    };

    document.addEventListener("pointerdown", handleFirstInteraction);

    return () => {
      document.removeEventListener("pointerdown", handleFirstInteraction);
    };
  }, [attemptPlayback, isReady, isVisible]);

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (volumeRef.current === 0) {
      const restoredVolume = previousVolumeRef.current || 24;
      setVolumePercent(restoredVolume);
      audio.volume = restoredVolume / 100;
      if (isVisible) {
        void attemptPlayback();
      }
      return;
    }

    previousVolumeRef.current = volumeRef.current;
    setVolumePercent(0);
    audio.volume = 0;
    audio.pause();
    setIsPlaying(false);
  };

  const handleSliderChange = (nextVolume: number) => {
    const audio = audioRef.current;
    setVolumePercent(nextVolume);

    if (!audio) return;

    audio.volume = nextVolume / 100;

    if (nextVolume > 0) {
      if (isVisible) {
        void attemptPlayback();
      }
      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  const nudgeVolume = (delta: number) => {
    const nextVolume = Math.max(0, Math.min(100, volumeRef.current + delta));
    handleSliderChange(nextVolume);
  };

  return (
    <div
      ref={controlRef}
      className="absolute bottom-20 left-4 md:left-16 z-[100] flex flex-col items-center gap-2"
    >
      <button
        type="button"
        onClick={() => nudgeVolume(10)}
        disabled={!isReady}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full border border-[#b99776] bg-[rgba(255,250,243,0.92)] text-[#5f432e] shadow-[0_4px_10px_rgba(94,67,46,0.12)] transition hover:scale-[1.04] hover:bg-[rgba(255,247,237,0.98)] disabled:cursor-not-allowed disabled:opacity-45",
        )}
        aria-label="Increase volume"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 fill-none stroke-current"
          aria-hidden="true"
        >
          <path d="M12 6v12" strokeWidth="2" strokeLinecap="round" />
          <path d="M6 12h12" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <button
        type="button"
        onClick={toggleMute}
        disabled={!isReady}
        className="flex h-9 w-9 items-center justify-center text-[#3a2a1b] transition hover:scale-[1.05] disabled:cursor-not-allowed disabled:opacity-45"
        aria-label={volumePercent === 0 ? "Unmute background music" : "Mute background music"}
      >
        {volumePercent === 0 ? (
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 fill-none stroke-current"
            aria-hidden="true"
          >
            <path
              d="M5 10h3l4-4v12l-4-4H5z"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M16 9l5 6" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M21 9l-5 6" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 fill-none stroke-current"
            aria-hidden="true"
          >
            <path
              d="M5 10h3l4-4v12l-4-4H5z"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M16 9a4.5 4.5 0 0 1 0 6"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M18.5 6.5a8 8 0 0 1 0 11"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>

      <ElasticVolumeSlider
        value={volumePercent}
        onChange={handleSliderChange}
        disabled={!isReady}
      />

      <button
        type="button"
        onClick={() => nudgeVolume(-10)}
        disabled={!isReady}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full border border-[#b99776] bg-[rgba(255,250,243,0.92)] text-[#5f432e] shadow-[0_4px_10px_rgba(94,67,46,0.12)] transition hover:scale-[1.04] hover:bg-[rgba(255,247,237,0.98)] disabled:cursor-not-allowed disabled:opacity-45",
        )}
        aria-label="Decrease volume"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 fill-none stroke-current"
          aria-hidden="true"
        >
          <path d="M6 12h12" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
