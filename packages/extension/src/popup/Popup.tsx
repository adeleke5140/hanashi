import { useEffect, useState } from "react";
import "./global.css";
import AudioPlayer from "./audio-player";
import { ErrorUI } from "./components/error";
import { Header } from "./components/header";
import { JapaneseInputForm } from "./components/japanese-input-form";

const Popup = () => {
	const [audioDataUrl, setAudioDataUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
		null,
	);


	useEffect(() => {
		return () => {
			if (audioElement) {
				audioElement.pause();
			}
		};
	}, [audioElement]);

	return (
		<main className="p-4 text-white bg-gray-100/50 border w-[343.08px]">
			<Header />

			<JapaneseInputForm
				setError={setError}
			
				setAudioDataUrl={setAudioDataUrl}
				audioElement={audioElement}
			/>

			{error && <ErrorUI error={error || "エラーが発生しました"} />}

			{audioDataUrl && (
				<AudioPlayer
					src={audioDataUrl}
					autoPlay={true}
					onAudioElement={setAudioElement}
				/>
			)}
		</main>
	);
};

export default Popup;
