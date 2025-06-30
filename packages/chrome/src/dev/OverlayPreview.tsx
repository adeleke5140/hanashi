import React, { useState, useRef, useEffect } from 'react';

interface OverlayPreviewProps {
  initialText?: string;
  initialGender?: 'male' | 'female';
}

const OverlayPreview: React.FC<OverlayPreviewProps> = ({
  initialText = "こんにちは、世界！これは日本語のテストテキストです。長いテキストでも適切に表示されることを確認しています。",
  initialGender = 'male'
}) => {
  const [text, setText] = useState(initialText);
  const [gender, setGender] = useState<'male' | 'female'>(initialGender);
  const [loading, setLoading] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Simulate TTS generation
  const handleGenerateSpeech = async () => {
    if (!text.trim()) {
      setError('テキストが入力されていません');
      return;
    }

    setLoading(true);
    setError(null);
    setHasAudio(false);
    setIsPlaying(false);

    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      setHasAudio(true);
      console.log(`Generated speech for: "${text}" with ${gender} voice`);
    }, 2000);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    console.log('Playing audio...');
    
    // Simulate audio duration
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  const handlePause = () => {
    setIsPlaying(false);
    console.log('Paused audio');
  };

  const handleClose = () => {
    setIsVisible(false);
    setIsPlaying(false);
    setHasAudio(false);
  };

  const clearError = () => {
    setError(null);
  };

  if (!isVisible) {
    return (
      <div className="p-8">
        <button 
          onClick={() => setIsVisible(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Show Overlay
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 relative">
      {/* Background content to simulate a webpage */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Sample Webpage</h1>
        <p className="text-gray-600 mb-4">
          This is a sample webpage to demonstrate how the overlay appears on top of existing content.
          You can select text and use the context menu to trigger the overlay.
        </p>
        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
          <h2 className="text-xl font-semibold mb-3">Japanese Text Examples</h2>
          <p className="mb-2">こんにちは、世界！</p>
          <p className="mb-2">私の名前は田中です。</p>
          <p className="mb-2">今日は良い天気ですね。</p>
        </div>
      </div>

      {/* Nihongo Speech Overlay */}
      <div 
        id="nihongo-speech-overlay" 
        className="fixed top-5 right-5 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 text-white font-sans"
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-3">
            <h3 className="text-lg font-semibold">日本語音声</h3>
            <button 
              onClick={handleClose}
              className="text-white hover:bg-gray-700 p-1 rounded transition-colors text-xl leading-none w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          {/* Text Display */}
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 mb-4 min-h-[60px]">
            <p className="text-lg leading-relaxed break-words m-0">
              {text}
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-3">
            {/* Gender Selection */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input 
                  type="radio" 
                  name="gender" 
                  value="female" 
                  checked={gender === 'female'}
                  onChange={() => setGender('female')}
                  className="text-blue-500" 
                />
                <span>女性</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input 
                  type="radio" 
                  name="gender" 
                  value="male" 
                  checked={gender === 'male'}
                  onChange={() => setGender('male')}
                  className="text-blue-500" 
                />
                <span>男性</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={handleGenerateSpeech}
                disabled={loading || !text.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {loading ? '生成中...' : '音声を生成'}
              </button>
              
              {hasAudio && !isPlaying && (
                <button 
                  onClick={handlePlay}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  再生
                </button>
              )}
              
              {hasAudio && isPlaying && (
                <button 
                  onClick={handlePause}
                  className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  一時停止
                </button>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-3 text-sm text-gray-300">
              <div className="inline-flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                生成中...
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-600 text-white p-3 rounded-md text-sm mt-3 flex justify-between items-center">
              <span>{error}</span>
              <button 
                onClick={clearError}
                className="text-white hover:bg-red-700 px-2 py-1 rounded text-xs"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Development Controls */}
      <div className="fixed bottom-5 left-5 bg-white p-4 rounded-lg shadow-lg border max-w-sm">
        <h4 className="font-semibold mb-3 text-gray-800">Development Controls</h4>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test Text:
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
              rows={3}
              placeholder="Enter Japanese text to test..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Test States:
            </label>
            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={() => setError('テストエラーメッセージ')}
                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
              >
                Show Error
              </button>
              <button 
                onClick={() => setLoading(!loading)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
              >
                Toggle Loading
              </button>
              <button 
                onClick={() => setHasAudio(!hasAudio)}
                className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
              >
                Toggle Audio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverlayPreview;