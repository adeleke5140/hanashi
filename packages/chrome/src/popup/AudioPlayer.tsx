import type React from "react";
import { useState, useRef, useEffect } from "react";

interface AudioPlayerProps {
  src?: string;
  autoPlay?: boolean;
  onAudioElement?: (element: HTMLAudioElement | null) => void;
  preview?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  autoPlay = false,
  onAudioElement,
  preview = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(preview ? 15 : 0);
  const [duration, setDuration] = useState(preview ? 45 : 0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (preview || !src) return;

    const audio = audioRef.current;
    if (!audio) return;

    // Pass audio element to parent component
    if (onAudioElement) {
      onAudioElement(audio);
    }

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    if (autoPlay) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [src, autoPlay, onAudioElement, preview]);

  const togglePlayPause = () => {
    if (preview) {
      setIsPlaying(!isPlaying);
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (Number.parseFloat(e.target.value) / 100) * duration;

    if (preview) {
      setCurrentTime(newTime);
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value) / 100;
    setVolume(newVolume);

    if (preview) return;

    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = newVolume;
  };

  const formatTime = (time: number) => {
    if (Number.isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-[#1F221E] rounded-xl p-4 mt-4">
      {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
      {src && !preview && <audio ref={audioRef} src={src} preload="metadata" />}

      <div className="flex flex-col gap-4">
        {/* Play Button - Centered */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={togglePlayPause}
            className="flex items-center justify-center w-8 h-8 bg-primary text-secondary rounded-full hover:bg-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-lg"
          >
            {isPlaying ? (
              <svg
                className="shrink-0"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                role="img"
                focusable="false"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3.5 3.5a1 1 0 0 1 1-1H6a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1v-9ZM9 3.5a1 1 0 0 1 1-1h1.5a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-9Z" />
              </svg>
            ) : (
              <svg
                className="shrink-0"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
                role="img"
                focusable="false"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m5.604 2.41 7.23 4.502a1.375 1.375 0 0 1-.02 2.345L5.585 13.6a1.375 1.375 0 0 1-2.083-1.18V3.576A1.375 1.375 0 0 1 5.604 2.41Z" />
              </svg>
            )}
          </button>
          <div className="flex flex-1 items-center gap-3">
            <span className="text-white text-sm font-mono min-w-[2.5rem]">
              {formatTime(currentTime)}
            </span>

            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="100"
                value={progressPercentage}
                onChange={handleProgressChange}
                className="w-full h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer audio-progress"
                style={{
                  background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${progressPercentage}%, rgba(253, 255, 121, 0.1) ${progressPercentage}%, rgba(253, 255, 121, 0.1) 100%)`,
                }}
              />
            </div>

            <span className="text-white text-sm font-mono min-w-[2.5rem]">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <svg
            aria-label="Volume"
            role="img"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="white"
            className="flex-shrink-0"
          >
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>

          <div className="flex-1">
            <input
              type="range"
              min="0"
              max="100"
              value={volume * 100}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer audio-volume"
              style={{
                background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${volume * 100}%, rgba(253, 255, 121, 0.1) ${volume * 100}%, rgba(253, 255, 121, 0.1) 100%)`,
              }}
            />
          </div>

          <span className="text-white text-sm font-mono min-w-[1.5rem] text-right">
            {Math.round(volume * 100)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
