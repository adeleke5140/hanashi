interface TTSOptions {
	text: string;
	gender: "male" | "female";
}

interface TTSResponse {
	success: boolean;
	dataUrl?: string;
	error?: string;
}

class NihongoSpeechOverlay {
	private overlayElement: HTMLDivElement | null = null;
	private audioElement: HTMLAudioElement | null = null;
	private currentText = "";
	private currentGender: "male" | "female" = "male";

	constructor() {
		this.init();
	}

	private init(): void {
		this.createOverlay();
		this.setupMessageListener();
		this.loadSettings();
	}

	private createOverlay(): void {
		if (this.overlayElement) return;

		this.overlayElement = document.createElement("div");
		this.overlayElement.id = "nihongo-speech-overlay";
		this.overlayElement.innerHTML = `
      <div class="nihongo-overlay-container">
        <div class="nihongo-overlay-header">
          <h3>日本語音声</h3>
          <button class="nihongo-close-btn" type="button">×</button>
        </div>
        <div class="nihongo-overlay-content">
          <div class="nihongo-text-display">
            <p class="nihongo-text"></p>
          </div>
          <div class="nihongo-controls">
            <div class="nihongo-gender-controls">
              <label class="nihongo-radio-label">
                <input type="radio" name="gender" value="female" class="nihongo-gender-radio">
                <span>女性</span>
              </label>
              <label class="nihongo-radio-label">
                <input type="radio" name="gender" value="male" class="nihongo-gender-radio" checked>
                <span>男性</span>
              </label>
            </div>
            <div class="nihongo-action-buttons">
              <button class="nihongo-generate-btn" type="button">音声を生成</button>
              <button class="nihongo-play-btn" type="button" style="display: none;">再生</button>
              <button class="nihongo-pause-btn" type="button" style="display: none;">一時停止</button>
            </div>
          </div>
          <div class="nihongo-loading" style="display: none;">
            <span>生成中...</span>
          </div>
          <div class="nihongo-error" style="display: none;"></div>
        </div>
      </div>
    `;

		this.addStyles();
		this.setupEventListeners();
		document.body.appendChild(this.overlayElement);
	}

	private addStyles(): void {
		if (document.getElementById("nihongo-overlay-styles")) return;

		const style = document.createElement("style");
		style.id = "nihongo-overlay-styles";
		style.textContent = `
      #nihongo-speech-overlay {
        position: fixed;
        top: 20px;
        right: 20px;
        width: 350px;
        background: #1a1a1a;
        border: 1px solid #333;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #fff;
        display: none;
      }

      .nihongo-overlay-container {
        padding: 16px;
      }

      .nihongo-overlay-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        border-bottom: 1px solid #333;
        padding-bottom: 12px;
      }

      .nihongo-overlay-header h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      .nihongo-close-btn {
        background: none;
        border: none;
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: background-color 0.2s;
      }

      .nihongo-close-btn:hover {
        background-color: #333;
      }

      .nihongo-text-display {
        background: #2a2a2a;
        border: 1px solid #444;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 16px;
        min-height: 60px;
      }

      .nihongo-text {
        margin: 0;
        font-size: 18px;
        line-height: 1.5;
        word-break: break-word;
      }

      .nihongo-gender-controls {
        display: flex;
        gap: 16px;
        margin-bottom: 12px;
      }

      .nihongo-radio-label {
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        font-size: 14px;
      }

      .nihongo-gender-radio {
        margin: 0;
      }

      .nihongo-action-buttons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .nihongo-generate-btn,
      .nihongo-play-btn,
      .nihongo-pause-btn {
        background: #0066cc;
        border: none;
        color: white;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.2s;
      }

      .nihongo-generate-btn:hover,
      .nihongo-play-btn:hover,
      .nihongo-pause-btn:hover {
        background: #0052a3;
      }

      .nihongo-generate-btn:disabled {
        background: #666;
        cursor: not-allowed;
      }

      .nihongo-loading {
        text-align: center;
        padding: 12px;
        font-size: 14px;
        color: #ccc;
      }

      .nihongo-error {
        background: #cc0000;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        margin-top: 8px;
      }
    `;
		document.head.appendChild(style);
	}

	private setupEventListeners(): void {
		if (!this.overlayElement) return;

		const closeBtn = this.overlayElement.querySelector(".nihongo-close-btn");
		const generateBtn = this.overlayElement.querySelector(
			".nihongo-generate-btn",
		);
		const playBtn = this.overlayElement.querySelector(".nihongo-play-btn");
		const pauseBtn = this.overlayElement.querySelector(".nihongo-pause-btn");
		const genderRadios = this.overlayElement.querySelectorAll(
			".nihongo-gender-radio",
		);

		closeBtn?.addEventListener("click", () => this.hide());
		generateBtn?.addEventListener("click", () => this.generateSpeech());
		playBtn?.addEventListener("click", () => this.playAudio());
		pauseBtn?.addEventListener("click", () => this.pauseAudio());

		genderRadios.forEach((radio) => {
			radio.addEventListener("change", (e) => {
				const target = e.target as HTMLInputElement;
				if (target.checked) {
					this.currentGender = target.value as "male" | "female";
					this.saveSettings();
				}
			});
		});
	}

	private setupMessageListener(): void {
		chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
			if (message.type === "SHOW_TTS_OVERLAY") {
				this.showWithText(message.text);
				sendResponse({ success: true });
			}
			return true;
		});
	}

	private async loadSettings(): Promise<void> {
		try {
			const result = await chrome.storage.local.get(["savedGender"]);
			if (result.savedGender) {
				this.currentGender = result.savedGender;
				this.updateGenderSelection();
			}
		} catch (error) {
			console.warn("Failed to load settings:", error);
		}
	}

	private async saveSettings(): Promise<void> {
		try {
			await chrome.storage.local.set({ savedGender: this.currentGender });
		} catch (error) {
			console.warn("Failed to save settings:", error);
		}
	}

	private updateGenderSelection(): void {
		if (!this.overlayElement) return;

		const genderRadios = this.overlayElement.querySelectorAll(
			".nihongo-gender-radio",
		) as NodeListOf<HTMLInputElement>;
		genderRadios.forEach((radio) => {
			radio.checked = radio.value === this.currentGender;
		});
	}

	public showWithText(text: string): void {
		this.currentText = text;
		this.updateTextDisplay();
		this.show();
	}

	public show(): void {
		if (!this.overlayElement) return;

		this.overlayElement.style.display = "block";
		this.clearError();
	}

	public hide(): void {
		if (!this.overlayElement) return;

		this.overlayElement.style.display = "none";
		this.stopAudio();
	}

	private updateTextDisplay(): void {
		if (!this.overlayElement) return;

		const textElement = this.overlayElement.querySelector(".nihongo-text");
		if (textElement) {
			textElement.textContent = this.currentText;
		}
	}

	private async generateSpeech(): Promise<void> {
		if (!this.currentText.trim()) {
			this.showError("テキストが入力されていません");
			return;
		}

		this.showLoading(true);
		this.clearError();
		this.hideAudioControls();

		try {
			const response = await this.requestTTS({
				text: this.currentText,
				gender: this.currentGender,
			});

			if (response.success && response.dataUrl) {
				this.setupAudio(response.dataUrl);
				this.showAudioControls();
			} else {
				this.showError(response.error || "Unknown error occurred");
			}
		} catch (error) {
			this.showError(
				error instanceof Error ? error.message : "Failed to generate speech",
			);
		} finally {
			this.showLoading(false);
		}
	}

	private requestTTS(options: TTSOptions): Promise<TTSResponse> {
		return new Promise((resolve) => {
			chrome.runtime.sendMessage(
				{
					type: "TTS_REQUEST",
					payload: options,
				},
				(response) => {
					if (chrome.runtime.lastError) {
						resolve({
							success: false,
							error: chrome.runtime.lastError.message,
						});
					} else {
						resolve(response);
					}
				},
			);
		});
	}

	private setupAudio(dataUrl: string): void {
		this.stopAudio();

		this.audioElement = new Audio(dataUrl);
		this.audioElement.addEventListener("ended", () => {
			this.updatePlayPauseButtons(false);
		});
		this.audioElement.addEventListener("error", () => {
			this.showError("Audio playback failed");
		});
	}

	private playAudio(): void {
		if (this.audioElement) {
			this.audioElement
				.play()
				.then(() => {
					this.updatePlayPauseButtons(true);
				})
				.catch(() => {
					this.showError("Failed to play audio");
				});
		}
	}

	private pauseAudio(): void {
		if (this.audioElement) {
			this.audioElement.pause();
			this.updatePlayPauseButtons(false);
		}
	}

	private stopAudio(): void {
		if (this.audioElement) {
			this.audioElement.pause();
			this.audioElement.currentTime = 0;
			this.audioElement = null;
			this.updatePlayPauseButtons(false);
		}
	}

	private updatePlayPauseButtons(isPlaying: boolean): void {
		if (!this.overlayElement) return;

		const playBtn = this.overlayElement.querySelector(
			".nihongo-play-btn",
		) as HTMLElement;
		const pauseBtn = this.overlayElement.querySelector(
			".nihongo-pause-btn",
		) as HTMLElement;

		if (playBtn && pauseBtn) {
			playBtn.style.display = isPlaying ? "none" : "inline-block";
			pauseBtn.style.display = isPlaying ? "inline-block" : "none";
		}
	}

	private showAudioControls(): void {
		if (!this.overlayElement) return;

		const playBtn = this.overlayElement.querySelector(
			".nihongo-play-btn",
		) as HTMLElement;
		if (playBtn) {
			playBtn.style.display = "inline-block";
		}
	}

	private hideAudioControls(): void {
		if (!this.overlayElement) return;

		const playBtn = this.overlayElement.querySelector(
			".nihongo-play-btn",
		) as HTMLElement;
		const pauseBtn = this.overlayElement.querySelector(
			".nihongo-pause-btn",
		) as HTMLElement;

		if (playBtn) playBtn.style.display = "none";
		if (pauseBtn) pauseBtn.style.display = "none";
	}

	private showLoading(show: boolean): void {
		if (!this.overlayElement) return;

		const loadingElement = this.overlayElement.querySelector(
			".nihongo-loading",
		) as HTMLElement;
		const generateBtn = this.overlayElement.querySelector(
			".nihongo-generate-btn",
		) as HTMLButtonElement;

		if (loadingElement) {
			loadingElement.style.display = show ? "block" : "none";
		}
		if (generateBtn) {
			generateBtn.disabled = show;
		}
	}

	private showError(message: string): void {
		if (!this.overlayElement) return;

		const errorElement = this.overlayElement.querySelector(
			".nihongo-error",
		) as HTMLElement;
		if (errorElement) {
			errorElement.textContent = message;
			errorElement.style.display = "block";
		}
	}

	private clearError(): void {
		if (!this.overlayElement) return;

		const errorElement = this.overlayElement.querySelector(
			".nihongo-error",
		) as HTMLElement;
		if (errorElement) {
			errorElement.style.display = "none";
			errorElement.textContent = "";
		}
	}

	public destroy(): void {
		this.stopAudio();
		if (this.overlayElement) {
			this.overlayElement.remove();
			this.overlayElement = null;
		}

		const styles = document.getElementById("nihongo-overlay-styles");
		if (styles) {
			styles.remove();
		}
	}
}

const _nihongoOverlay = new NihongoSpeechOverlay();
