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
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['elevenLabsApiKey']).then((result) => {
        if (result.elevenLabsApiKey) {
          setApiKey(result.elevenLabsApiKey);
          setHasApiKey(true);
        } else {
          setShowSettings(true);
        }
      });
    } else {
      console.warn('chrome.storage.local not available. Running in dev mode?');
      const localApiKey = localStorage.getItem('elevenLabsApiKey_dev');
      if (localApiKey) {
        setApiKey(localApiKey);
        setHasApiKey(true);
      } else {
        setShowSettings(true);
      }
    }

    return () => {
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [audioDataUrl, audioElement]);

  const saveApiKey = () => {
    if (apiKey.trim()) {
      if (chrome && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ elevenLabsApiKey: apiKey.trim() }).then(() => {
          setHasApiKey(true);
          setShowSettings(false);
          setError(null);
        })
      } else {
        localStorage.setItem('elevenLabsApiKey_dev', apiKey.trim());
        setHasApiKey(true);
        setShowSettings(false);
        setError(null);
        console.warn('Saved API key to localStorage for dev mode.');
      }
    }
  };

  const clearApiKey = () => {
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.remove(['elevenLabsApiKey']).then(() => {
        setApiKey('');
        setHasApiKey(false);
        setShowSettings(true);
      });
    } else {
      localStorage.removeItem('elevenLabsApiKey_dev');
      setApiKey('');
      setHasApiKey(false);
      setShowSettings(true);
      console.warn('Cleared API key from localStorage for dev mode.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasApiKey) {
      setError('Please set your ElevenLabs API key first.');
      setShowSettings(true);
      return;
    }

    setLoading(true);
    setError(null);
    setAudioDataUrl(null);
    if (audioElement) audioElement.pause();

    if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
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
    } else {
      setLoading(false);
      setError('Cannot send TTS request outside of extension context.');
      console.warn('chrome.runtime.sendMessage not available. Running in dev mode?');
    }
  };

  return (
    <div className="p-4 text-white bg-[#141612] border border-primary/40 w-[412.08px]" >
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold select-none">Nihongo Speech</h1>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-primary hover:text-primary/80 text-sm focus:outline-none focus:ring-1 focus:ring-primary rounded-lg px-1"
        >
          {hasApiKey ? 
           <span>
            <svg 
             xmlns="http://www.w3.org/2000/svg" 
             width="24"
             height="24" 
             viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             strokeWidth="2"
             strokeLinecap="round"
             strokeLinejoin="round" 
             className='w-4 h-4'
             >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
            <circle cx="12" cy="12" r="3"/></svg>
           </span> 
           : 
            <span className='flex items-center gap-1'>
            <svg 
               xmlns="http://www.w3.org/2000/svg"
               className='w-4 h-4'
               width="24"
               height="24"
               viewBox="0 0 24 24"
               fill="none" 
               stroke="currentColor"
               strokeWidth="2"
               strokeLinecap="round"
               strokeLinejoin="round"
               >
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
                <path d="M12 8v4"/><path d="M12 16h.01"/>
              </svg>
              Setup Required
            </span>
          }
        </button>
      </div>
      

      {showSettings && (
        <form className="mb-4 p-3 bg-[#1F221E] rounded-xl border border-primary/20">
          <label htmlFor='api-key' className="text-sm block font-medium mb-2 selection:bg-primary/10">ElevenLabs API Key</label>
          <input
            id='api-key'
            type="password"
            placeholder="Enter your ElevenLabs API key..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full p-2 text-sm bg-[#141612] border border-primary/20 focus:border-transparent rounded-lg text-white placeholder-gray-50/50 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="flex gap-2 mt-2">
            <button
              type='submit'
              onClick={saveApiKey}
              disabled={!apiKey.trim()}
              className="flex-1 bg-primary text-secondary text-sm py-1 px-3 rounded-lg hover:bg-primary/80 disabled:opacity-50"
            >
              Save
            </button>
            {hasApiKey && (
              <button
                onClick={clearApiKey}
                className="bg-[rgba(144,144,144,0.18)] text-white text-sm py-1 px-3 rounded-lg hover:bg-[rgba(144,144,144,0.30)]"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          className="rounded-xl selection:bg-primary/10 text-base border border-primary/20 h-[144px] focus:outline-none focus:ring-1 focus:ring-primary bg-[#1F221E] text-white p-2 w-full resize-none"
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
          disabled={loading || !text.trim() || !hasApiKey}
        >
          {loading ? '生成中...' : '音声を生成'}
        </button>
      </form>
      {error && <div className="text-red-600 mt-2">{error || 'エラーが発生しました'}</div>}
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