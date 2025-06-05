import { useState } from "react";

export const ApiSettings = ({
  showSettings,
  hasApiKey,
  apiKey,
  setApiKey,
  saveApiKey,
  clearApiKey,
}: {
  showSettings: boolean;
  hasApiKey: boolean;
  apiKey: string;
  setApiKey: (apiKey: string) => void;
  saveApiKey: () => void;
  clearApiKey: () => void;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      {showSettings && (
        <form className="mb-3 p-3 bg-[var(--background)] rounded-xl border border-[var(--border)]">
          <label
            htmlFor="api-key"
            className="text-sm block font-medium mb-2 text-[var(--primary)]"
          >
            ElevenLabs API Key
          </label>
          <div className="relative">
              <input
                id="api-key"
                type={isVisible ? "text" : "password"}
                placeholder="Enter your ElevenLabs API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full pr-9 p-2 text-sm bg-[var(--background)] font-mono border border-[var(--border)] rounded-lg text-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--button-border)]"
              />
              <button
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                onClick={toggleVisibility}
                aria-label={isVisible ? "Hide password" : "Show password"}
                aria-pressed={isVisible}
                aria-controls="password"
              >
                {isVisible ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                    className="size-3"
                  >
                    <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                    <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                    <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                    <path d="m2 2 20 20" />
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                    className="size-3"
                  >
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={saveApiKey}
              className="text-sm w-full *:focus:outline-none focus:ring-2 rounded-lg px-3 py-1 mt-2  disabled:opacity-50"
            >
              Save
            </button>
            {hasApiKey && (
              <button
                type="button"
                onClick={clearApiKey}
                className="text-sm py-1 px-3 rounded-lg destructive"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      )}
    </>
  );
};
