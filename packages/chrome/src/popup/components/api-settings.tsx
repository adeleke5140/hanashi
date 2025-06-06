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
              className="w-full pr-9 p-2 text-sm bg-[var(--background)] font-mono border border-[var(--border)] rounded-lg text-[var(--primary)] focus:outline-none focus-visible:ring-1 focus:ring-[var(--button-border)]"
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
                 
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                >
                  <title>eye-closed</title>
                  <g fill="currentColor">
                    <path
                      d="M1.85901 7.27C3.67401 9.121 6.20301 10.27 9.00001 10.27C11.797 10.27 14.326 9.122 16.141 7.27"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      fill="none"
                    />
                    <path
                      d="M4.021 8.942L2.75 11.019"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      fill="none"
                    />
                    <path
                      d="M7.3 10.126L6.823 12.5"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      fill="none"
                    />
                    <path
                      d="M13.979 8.942L15.25 11.019"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      fill="none"
                    />
                    <path
                      d="M10.7 10.126L11.177 12.5"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      fill="none"
                    />
                  </g>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <title>eye-open</title>
                  <g fill="currentColor">
                    <path
                      d="M9 13.25C10.5188 13.25 11.75 12.0188 11.75 10.5C11.75 8.98122 10.5188 7.75 9 7.75C7.48122 7.75 6.25 8.98122 6.25 10.5C6.25 12.0188 7.48122 13.25 9 13.25Z"
                      fill="currentColor"
                      fill-opacity="0.3"
                      data-stroke="none"
                      stroke="none"
                    />
                    <path
                      d="M1.85901 8C3.67401 6.149 6.20301 5 9.00001 5C11.797 5 14.326 6.148 16.141 8"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      fill="none"
                    />
                    <path
                      d="M9 13.25C10.5188 13.25 11.75 12.0188 11.75 10.5C11.75 8.98122 10.5188 7.75 9 7.75C7.48122 7.75 6.25 8.98122 6.25 10.5C6.25 12.0188 7.48122 13.25 9 13.25Z"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      fill="none"
                    />
                    <path
                      d="M4.021 6.328L2.75 4.25"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      fill="none"
                    />
                    <path
                      d="M7.3 5.144L6.823 2.769"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      fill="none"
                    />
                    <path
                      d="M13.979 6.328L15.25 4.25"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      fill="none"
                    />
                    <path
                      d="M10.7 5.144L11.177 2.769"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      fill="none"
                    />
                  </g>
                </svg>
              )}
            </button>
          </div>
          <div className="flex gap-2 items-center mt-2">
            <button
              type="button"
              onClick={saveApiKey}
              className="text-sm w-full focus:outline-none focus-visible:ring-[3px] rounded-lg px-3 py-1  disabled:opacity-50"
            >
              Save
            </button>
            {hasApiKey && (
              <button
                type="button"
                onClick={clearApiKey}
                className="text-sm py-1 px-3 focus:outline-none focus-visible:ring-[3px] rounded-lg destructive"
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
