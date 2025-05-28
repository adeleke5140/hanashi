// Ensure @types/chrome is installed in your devDependencies
import { fetchTTS, type TTSOptions } from "../utils/ttsProviders";

// Helper function to convert Blob to Data URL
async function blobToDataURL(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => {
			if (typeof reader.result === "string") {
				resolve(reader.result);
			} else {
				reject(new Error("Failed to convert blob to data URL."));
			}
		};
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "TTS_REQUEST") {
		const options: TTSOptions = message.payload;
		fetchTTS(options)
			.then((blob) => blobToDataURL(blob)) // Convert blob to data URL
			.then((dataUrl) => {
				sendResponse({ success: true, dataUrl }); // Send the data URL
			})
			.catch((error) => {
				console.error("Error in background script TTS request:", error);
				sendResponse({ success: false, error: error.message });
			});
		return true; // Keep the message channel open for async response
	}
});
