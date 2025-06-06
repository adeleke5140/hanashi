import type React from "react";
import { useState, useEffect } from "react";
import "../popup/popup.css";
import AudioPlayer from "./audio-player";
import { Header } from "./components/header";
import { ApiSettings } from "./components/api-settings";
import { JapaneseInputForm } from "./components/japanese-input-form";
import { ErrorUI } from "./components/error";

const Popup = () => {
  const [audioDataUrl, setAudioDataUrl] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null,
  );
  const [apiKey, setApiKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    if (!chrome || !chrome.storage || !chrome.storage.local) {
      console.warn("chrome.storage.local not available. Running in dev mode?");
      const localApiKey = localStorage.getItem("elevenLabsApiKey_dev");
      if (localApiKey) {
        setApiKey(localApiKey);
        setHasApiKey(true);
      } else {
        setShowSettings(true);
      }

      return;
    }

    chrome.storage.local.get(["elevenLabsApiKey"]).then((result) => {
      if (result.elevenLabsApiKey) {
        setApiKey(result.elevenLabsApiKey);
        setHasApiKey(true);
      } else {
        setShowSettings(true);
      }
    });

    return () => {
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [audioElement]);

  const saveApiKey = () => {
    if(!apiKey){
      return setError("Please enter your ElevenLabs API key first.");
    }
    if (apiKey.trim()) {
      if (!chrome || !chrome.storage || !chrome.storage.local) {
        localStorage.setItem("elevenLabsApiKey_dev", apiKey.trim());
        setHasApiKey(true);
        setShowSettings(false);
        setError(null);
        console.warn("Saved API key to localStorage for dev mode.");
        return;
      }

      chrome.storage.local.set({ elevenLabsApiKey: apiKey.trim() }).then(() => {
        setHasApiKey(true);
        setShowSettings(false);
        setError(null);
      });
    }
  };

  const clearApiKey = () => {
    if (!chrome || !chrome.storage || !chrome.storage.local) {
      localStorage.removeItem("elevenLabsApiKey_dev");
      setApiKey("");
      setHasApiKey(false);
      setShowSettings(true);
      console.warn("Cleared API key from localStorage for dev mode.");
      return;
    }

    chrome.storage.local.remove(["elevenLabsApiKey"]).then(() => {
      setApiKey("");
      setHasApiKey(false);
      setShowSettings(true);
    });
  };

  return (
    <div className="p-4 text-white bg-[var(--background)] border w-[412.08px]">
      <Header
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        hasApiKey={hasApiKey}
      />

      <ApiSettings
        showSettings={showSettings}
        hasApiKey={hasApiKey}
        apiKey={apiKey}
        setApiKey={setApiKey}
        saveApiKey={saveApiKey}
        clearApiKey={clearApiKey}
      />

      <JapaneseInputForm
        hasApiKey={hasApiKey}
        setError={setError}
        setShowSettings={setShowSettings}
        setAudioDataUrl={setAudioDataUrl}
        audioElement={audioElement}
      />

      {error && (
        <ErrorUI error={error || "エラーが発生しました"} />
    )}
    <AudioPlayer preview={true}/>
    {audioDataUrl && (
        <AudioPlayer
          src={audioDataUrl}
          autoPlay={true}
          onAudioElement={setAudioElement}
        />
      )}
    </div>
  );
};


export default Popup;
