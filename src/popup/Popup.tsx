import React, { useState, useEffect } from 'react';
import '../popup/popup.css';
import AudioPlayer from './AudioPlayer';

const Popup: React.FC = () => {
  const [text, setText] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [audioDataUrl, setAudioDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [audioDataUrl, audioElement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAudioDataUrl(null);
    if (audioElement) audioElement.pause();

    chrome.runtime.sendMessage(
      {
        type: 'TTS_REQUEST',
        payload: { text, gender },
      },
      (response) => {
        setLoading(false);
        if (chrome.runtime.lastError) {
          console.error("TTS Request failed:", chrome.runtime.lastError.message);
          setError(`Error: ${chrome.runtime.lastError.message}`);
          return;
        }

        if (response?.success && response.dataUrl) {
          setAudioDataUrl(response.dataUrl);
        } else {
          console.error("TTS Response error:", response?.error);
          setError(response?.error || 'Unknown error from background script');
        }
      }
    );
  };

  return (
    <div className="p-4 text-white bg-[#141612] border border-primary/40 w-[412.08px]" >
      <h1 className="text-2xl font-semibold mb-2">Nihongo Speech</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          className="rounded-xl focus:outline-none focus:ring-1 focus:ring-primary bg-[#1F221E] text-white p-2 w-full resize-none"
          rows={3}
          placeholder="日本語の文を入力..."
          value={text}
          onChange={e => setText(e.target.value)}
          required
        />
        <div className="flex gap-4 mt-2 items-center">
          <label className="custom-radio flex items-center gap-1">
            <input
              id="female-gender"
              type="radio"
              name="gender"
              value="female"
              checked={gender === 'female'}
              onChange={() => setGender('female')}
            />
            <span className="radio-checkmark"></span>
            女性
          </label>
          <label className="custom-radio text-sm flex items-center gap-1">
            <input
              id="male-gender"
              type="radio"
              name="gender"
              value="male"
              checked={gender === 'male'}
              onChange={() => setGender('male')}
            />
            <span className="radio-checkmark"></span>
            男性
          </label>
        </div>
        <button
          type="submit"
          className="bg-primary text-secondary focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-xl px-4 py-2 mt-2 hover:bg-primary/80 disabled:opacity-50"
          disabled={loading || !text.trim()}
        >
          {loading ? '生成中...' : '音声を生成'}
        </button>
      </form>
      {error && <div className="text-red-600 mt-2">{error || 'エラーが発生しました'}</div>}
      
      {/* Preview Audio Player - Remove this when you're done testing */}
      <AudioPlayer preview={true} />
      
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