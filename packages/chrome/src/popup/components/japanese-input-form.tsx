import { useEffect, useRef, useState } from "react";

export const JapaneseInputForm = ({
  hasApiKey,
  setError,
  setShowSettings,
  setAudioDataUrl,
  audioElement,
}: {
  hasApiKey: boolean;
  setError: (error: string | null) => void;
  setShowSettings: (show: boolean) => void;
  setAudioDataUrl: (audioDataUrl: string | null) => void;
  audioElement: HTMLAudioElement | null;
}) => {
  const [text, setText] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [loading, setLoading] = useState(false);
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const chromeStorage = chrome?.storage;
    if(!chromeStorage) return

    chromeStorage?.local
      .get(["pendingText", "savedText", "savedGender", "savedAudioUrl"])
      .then((res) => {
        if (res.pendingText) {
          setText(res.pendingText);
          setShouldAutoSubmit(true);
          chrome.storage.local.remove(["pendingText"]);
        } else if (res.savedText) {
          setText(res.savedText);
        }

        if (res.savedGender) {
          setGender(res.savedGender);
        }
        if (res.savedAudioUrl) {
          setAudioDataUrl(res.savedAudioUrl);
        }
      });
  }, [setAudioDataUrl]);

  useEffect(() => {
    const chromeStorage = chrome?.storage as typeof chrome.storage;
    if(!chromeStorage) return 
    
    if (text) {
      chromeStorage.local.set({ savedText: text });
    }
  }, [text]);

  useEffect(() => {
    const chromeStorage = chrome?.storage;
    if(!chromeStorage) return 
    chrome.storage.local.set({ savedGender: gender });
  }, [gender]);

  useEffect(() => {
    if (text && shouldAutoSubmit) {
      const submitWhenVisible = () => {
        if (document.visibilityState === "visible" && !document.hidden) {
          const form = formRef.current;
          if (form) {
            form.requestSubmit();
          }
          setShouldAutoSubmit(false);
        } else {
          const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
              document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
              );
              const form = formRef.current;
              if (form) {
                form.requestSubmit();
              }
              setShouldAutoSubmit(false);
            }
          };
          document.addEventListener("visibilitychange", handleVisibilityChange);

          return () => {
            document.removeEventListener(
              "visibilitychange",
              handleVisibilityChange,
            );
          };
        }
      };

      const cleanup = submitWhenVisible();
      return cleanup;
    }
  }, [text, shouldAutoSubmit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasApiKey) {
      setError("Please set your ElevenLabs API key first.");
      setShowSettings(true);
      return;
    }

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

        if (response?.success && response.dataUrl) {
          setAudioDataUrl(response.dataUrl);
          chrome.storage.local.set({ savedAudioUrl: response.dataUrl });
        } else {
          console.error("TTS Response error:", response?.error);
          setError(response?.error || "Unknown error from background script");
        }
      },
    );
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2" ref={formRef}>
      <textarea
        className="rounded-xl text-base focus:outline-none focus-visible:ring-1 focus:ring-[var(--button-border)] border border-[var(--border)] h-[144px] bg-[var(--background)] text-[var(--primary)] p-2 w-full resize-none"
        rows={3}
        placeholder="日本語の文を入力..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <div className="flex gap-4 mt-2 items-center">
        <label className="custom-radio text-[var(--primary)] flex items-center gap-1">
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
        <label className="custom-radio text-[var(--primary)] text-sm flex items-center gap-1">
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
        className="focus:outline-none focus-visible:ring-[3px] rounded-lg px-3 py-1.5 mt-2  disabled:opacity-50"
        disabled={loading || !text.trim() || !hasApiKey}
      >
        {loading ? "生成中..." : "音声を生成"}
      </button>
    </form>
  );
};
