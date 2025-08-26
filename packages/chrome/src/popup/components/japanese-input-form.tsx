import { useRef, useState } from "react";

export const JapaneseInputForm = ({
	setError,
	setAudioDataUrl,
	audioElement,
}: {
	setError: (error: string | null) => void;
	setAudioDataUrl: (audioDataUrl: string | null) => void;
	audioElement: HTMLAudioElement | null;
}) => {
	const [text, setText] = useState("");
	const [gender, setGender] = useState<"male" | "female">("male");
	const [loading, setLoading] = useState(false);
	const formRef = useRef<HTMLFormElement>(null);
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setLoading(true);
		setError(null);
		setAudioDataUrl(null);
		chrome.storage.local.remove(["savedAudioUrl"]);
		if (audioElement) audioElement.pause();
		if (!chrome || !chrome.runtime || !chrome.runtime.sendMessage) {
			setLoading(false);
			setError("Cannot send TTS request outside of extension context.");
			console.warn(
				"chrome.runtime.sendMessage not available. Running in dev mode?",
			);
			return;
		}

		chrome.runtime.sendMessage(
			{
				type: "TTS_REQUEST",
				payload: { text, gender },
			},
			(response) => {
				setLoading(false);
				if (chrome.runtime.lastError) {
					console.error(
						"TTS Request failed:",
						chrome.runtime.lastError.message,
					);
					setError(`Error: ${chrome.runtime.lastError.message}`);
					return;
				}

				if (!response?.success) {
					console.error("TTS Response error:", response?.error);
					setError(response?.error || "Unknown error from background script");
					return;
				}

				setAudioDataUrl(response.dataUrl);
				chrome.storage.local.set({ savedAudioUrl: response.dataUrl });
			},
		);
	};
	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col relative gap-2"
			ref={formRef}
		>
			<textarea
				className={`rounded-xl  bg-white text-base  focus:outline-none focus-visible:ring-2 focus:ring-[var(--button-border)] border border-[var(--border)] h-[144px] bg-[var(--background)] text-[var(--primary)] p-2 w-full resize-none`}
				rows={3}
				placeholder="日本語の文を入力..."
				value={text}
				onChange={(e) => setText(e.target.value)}
				required
				onKeyDown={async (e) => {
					if (e.metaKey && e.key === "Enter") {
						await handleSubmit(e);
					}
				}}
			/>
			<div className="flex gap-4 mt-2 items-center">
				<label className="custom-radio font-stick text-[var(--primary)] flex items-center gap-1">
					<input
						id="female-gender"
						type="radio"
						name="gender"
						value="female"
						checked={gender === "female"}
						onChange={() => setGender("female")}
					/>
					<span className="radio-checkmark" />
					女性
				</label>
				<label className="custom-radio font-stick text-[var(--primary)]  text-sm flex items-center gap-1">
					<input
						id="male-gender"
						type="radio"
						name="gender"
						value="male"
						checked={gender === "male"}
						onChange={() => setGender("male")}
					/>
					<span className="radio-checkmark" />
					男性
				</label>
			</div>
			<button
				type="submit"
				className="form-button focus:outline-none font-stick text-base focus-visible:ring-[3px] rounded-lg px-3 py-1.5 mt-2  disabled:opacity-50"
				disabled={loading}
			>
				{loading ? "Creating..." : "Create Audio"}
			</button>
		</form>
	);
};
