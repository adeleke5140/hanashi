import React, { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  src?: string;
  autoPlay?: boolean;
  onAudioElement?: (element: HTMLAudioElement | null) => void;
  preview?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, autoPlay = false, onAudioElement, preview = false }) => {
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

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    if (autoPlay) {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
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
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;

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
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);

    if (preview) return;

    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = newVolume;
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-[#1F221E] rounded-xl p-3 mt-4">
      {src && !preview && <audio ref={audioRef} src={src} preload="metadata" />}

      <div className="flex items-center flex-col gap-3">
       <div className='flex items-center gap-2'>
         {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="flex items-center justify-center w-10 h-10 bg-primary text-secondary rounded-full hover:bg-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Time Display */}
        <span className="text-white text-sm font-mono min-w-[4rem]">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
       </div>

        <div>
          <div className="flex-1 relative">
            <input
              type="range"
              min="0"
              max="100"
              value={progressPercentage}
              onChange={handleProgressChange}
              className="w-full h-2  bg-primary/20 rounded-lg appearance-none cursor-pointer audio-progress"
            />
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
            <input
              type="range"
              min="0"
              max="100"
              value={volume * 100}
              onChange={handleVolumeChange}
              className="w-16 h-2 bg-primary/20 rounded-lg appearance-none cursor-pointer audio-volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer; 