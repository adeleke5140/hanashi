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
		<div className="bg-[var(--background)] border border-[var(--border)] rounded-xl p-4 mt-4">
			{src && !preview && <audio ref={audioRef} src={src} preload="metadata" />}

			<div className="flex flex-col gap-4">
				{/* Play Button - Centered */}
				<div className="flex items-center justify-between gap-3">
					<button
						type="button"
						onClick={togglePlayPause}
						className="flex items-center focus:outline-none focus-visible:ring-[3px] justify-center w-8 h-8 bg-[var(--background)] text-[var(--secondary)] rounded-full  transition-colors"
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
						<span className="text-[var(--primary)] text-sm  min-w-[2.5rem]">
							{formatTime(currentTime)}
						</span>

						<div className="flex-1">
							<input
								type="range"
								min="0"
								max="100"
								value={progressPercentage}
								onChange={handleProgressChange}
								className="w-full h-2 rounded-[0.2rem] focus:outline-none focus-visible:ring-[3px] appearance-none cursor-pointer audio-progress"
								style={{
									background: `linear-gradient(to right, var(--gradient-stop-1) 0%, var(--gradient-stop-2) ${progressPercentage}%, var(--border) ${progressPercentage}%, var(--border) 100%)`,
								}}
							/>
						</div>

						<span className="text-[var(--primary)] text-sm  min-w-[2.5rem]">
							{formatTime(duration)}
						</span>
					</div>
				</div>

				<div className="flex text-[var(--primary)] items-center gap-3">
					<span className="inline-grid bg-gray-50/90 dark:bg-[hsla(0,0%,100%,.16)] backdrop-blur-[8px] p-2 pr-[0.2rem] rounded-lg place-items-center">
						<svg width="18" height="18" viewBox="0 0 24 18" className="size-6">
							<title>volume-up</title>
							<g fill="#212121">
								<path
									d="M5,5.75H2.25c-.828,0-1.5,.672-1.5,1.5v3.5c0,.828,.672,1.5,1.5,1.5h2.75l5.48,3.508c.333,.213,.77-.026,.77-.421V2.664c0-.395-.437-.634-.77-.421l-5.48,3.508Z"
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
								/>
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-width="1.25"
									d="m19 7-4 4m4 0-4-4"
									className={`transition-all origin-center delay-100 duration-300 ${Math.round(volume * 100) <= 0 ? "scale-100" : "scale-0 translate-x-1 opacity-0"}`}
								/>
								<path
									d="M13.914,7.586c.781,.781,.781,2.047,0,2.828"
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									className={`transition-all origin-center delay-100 duration-300 ${Math.round(volume * 100) > 0 ? "scale-100" : "scale-0 opacity-0"}`}
								/>
								<path
									d="M15.859,5.641c1.855,1.855,1.855,4.863,0,6.718"
									fill="none"
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									className={`transition-all origin-center duration-300 ${Math.round(volume * 100) > 50 ? "scale-100" : "scale-0 opacity-0"}`}
								/>
							</g>
						</svg>
					</span>

					<div className="flex-1">
						<input
							type="range"
							min="0"
							max="100"
							value={volume * 100}
							onChange={handleVolumeChange}
							className="w-full h-2 rounded-[0.2rem] focus:outline-none focus-visible:ring-[3px] appearance-none cursor-pointer audio-volume"
							style={{
								background: `linear-gradient(to right, var(--gradient-stop-1) 0%, var(--gradient-stop-2) ${volume * 100}%, var(--border) ${volume * 100}%, var(--border) 100%)`,
							}}
						/>
					</div>

					<span className="text-[var(--primary)] text-sm  min-w-[1.5rem] text-right">
						{Math.round(volume * 100)}
					</span>
				</div>
			</div>
		</div>
	);
};

export default AudioPlayer;
