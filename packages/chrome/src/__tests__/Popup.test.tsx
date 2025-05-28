import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Popup from "../popup/Popup"; // Adjust path if your Popup component is elsewhere
import * as ttsProviders from "../utils/ttsProviders"; // To mock fetchTTS

// Mock the ttsProviders module
vi.mock("../utils/ttsProviders", () => ({
	fetchTTS: vi.fn(),
}));

describe("Popup Component", () => {
	const originalCreateObjectURL = URL.createObjectURL;
	const originalRevokeObjectURL = URL.revokeObjectURL;

	beforeEach(() => {
		// Reset mocks before each test
		vi.mocked(ttsProviders.fetchTTS).mockReset();

		// Mock URL.createObjectURL and URL.revokeObjectURL
		URL.createObjectURL = vi
			.fn()
			.mockReturnValue("blob:http://localhost/mocked-object-url");
		URL.revokeObjectURL = vi.fn();
	});

	afterEach(() => {
		// Restore original URL methods after each test to avoid interference between tests or test files
		URL.createObjectURL = originalCreateObjectURL;
		URL.revokeObjectURL = originalRevokeObjectURL;
	});

	it("should render the Nihongo Speech title", () => {
		render(<Popup />);
		expect(screen.getByText(/Nihongo Speech/i)).toBeInTheDocument();
	});

	it("should have a textarea for text input", () => {
		render(<Popup />);
		const textarea = screen.getByRole("textbox");
		expect(textarea).toBeInTheDocument();
		fireEvent.change(textarea, { target: { value: "テストテキスト" } });
		expect(textarea).toHaveValue("テストテキスト");
	});

	it("should have gender selection radio buttons", () => {
		render(<Popup />);
		expect(screen.getByLabelText(/女性/i)).toBeInTheDocument(); // Female
		expect(screen.getByLabelText(/男性/i)).toBeInTheDocument(); // Male
	});

	it('should call fetchTTS and URL.createObjectURL when "音声を生成" button is clicked', async () => {
		const mockBlob = new Blob(["dummy audio data"], { type: "audio/mpeg" });
		vi.mocked(ttsProviders.fetchTTS).mockResolvedValue(mockBlob);

		render(<Popup />);
		const textarea = screen.getByRole("textbox");
		const femaleRadio = screen.getByLabelText(/女性/i);
		const generateButton = screen.getByRole("button", { name: /音声を生成/i });

		fireEvent.change(textarea, { target: { value: "こんにちは" } });
		fireEvent.click(femaleRadio);
		fireEvent.click(generateButton);

		await waitFor(() => {
			expect(ttsProviders.fetchTTS).toHaveBeenCalledTimes(1);
		});

		expect(ttsProviders.fetchTTS).toHaveBeenCalledWith({
			text: "こんにちは",
			gender: "female",
		});

		// Check if URL.createObjectURL was called with the blob from fetchTTS
		await waitFor(() => {
			expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
		});
		expect(URL.createObjectURL).toHaveBeenCalledWith(mockBlob);

		// Depending on your component's implementation, you might also check if an <audio> element
		// gets the 'blob:http://localhost/mocked-object-url' as its src
		// For example: expect(screen.getByTestId('audio-player')).toHaveAttribute('src', 'blob:http://localhost/mocked-object-url');
	});

	it("should display an error message if fetchTTS fails", async () => {
		vi.mocked(ttsProviders.fetchTTS).mockRejectedValue(
			new Error("TTS API error from test"),
		);

		render(<Popup />);
		const generateButton = screen.getByRole("button", { name: /音声を生成/i });
		fireEvent.change(screen.getByRole("textbox"), {
			target: { value: "エラーテスト" },
		});
		fireEvent.click(generateButton);

		// Wait for the error message to appear
		// The exact text and how it's rendered depends on your Popup component
		const errorMessage = await screen.findByText(/TTS API error/i);
		expect(errorMessage).toBeInTheDocument();
	});

	// Add more tests for other interactions, state changes, edge cases, etc.
});
