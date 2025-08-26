import { useEffect, useState } from "react";
import "./global.css";
import AudioPlayer from "./audio-player";
import { ErrorUI } from "./components/error";
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
		<div className="grid border bg-gradient-to-r from-blue-300 to-blue-200 py-40 grid-cols-2 gap-16">
			<h1
				style={{
					fontFamily: "InterVariable",
				}}
				className="text-[48px] tracking-tighter leading-[110%] pl-[20%]"
			>
				Generate realistic Japanese voices for sentences.
			</h1>
			<main className="p-4 text-white rounded-lg bg-gray-100/50 border w-[343.08px]">
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
		</div>
	);
};

export default Popup;
