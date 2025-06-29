// Ensure @types/chrome is installed in your devDependencies
import { fetchTTS, type TTSOptions } from "../utils/ttsProviders";

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

const ID = "nihongo-speech";
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: ID,
    title: "Generate Speech in nihongo-speech",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === ID && info.selectionText && tab?.id) {
    chrome.storage.local.set({ pendingText: info.selectionText });
    chrome.action.openPopup();
  }
});
