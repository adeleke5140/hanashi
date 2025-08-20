import { fetchResponse, type TTSOptions } from "../utils/tts-provider";

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

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "TTS_REQUEST") {
    const options: TTSOptions = message.payload;
    fetchResponse(options)
      .then((blob) => blobToDataURL(blob))
      .then((dataUrl) => {
        sendResponse({ success: true, dataUrl });
      })
      .catch((error) => {
        console.error("Error in background script TTS request:", error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
});

// TODO: Add context menu support
// const ID = "hanashi";
// chrome.runtime.onInstalled.addListener(() => {
//   chrome.contextMenus.create({
//     id: ID,
//     title: "Generate Speech in hanashi",
//     contexts: ["selection"],
//   });
// });
