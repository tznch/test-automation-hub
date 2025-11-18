import { useState, useRef, useEffect } from 'react';

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
  };

  const handlePlaybackRateChange = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const skipTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Custom Video Player</h2>

      <div
        ref={containerRef}
        className="relative bg-black rounded-lg overflow-hidden group"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
        data-testid="video-container"
      >
        <video
          ref={videoRef}
          className="w-full h-auto"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          data-testid="video-element"
        />

        {/* Controls Overlay */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 transition-opacity ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #4f46e5 0%, #4f46e5 ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%, #4b5563 100%)`,
              }}
              data-testid="progress-bar"
            />
            <div className="flex justify-between text-xs text-white mt-1">
              <span data-testid="current-time">{formatTime(currentTime)}</span>
              <span data-testid="duration">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-indigo-400 transition"
                data-testid="play-pause-button"
              >
                {isPlaying ? (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 4l10 6-10 6V4z" />
                  </svg>
                )}
              </button>

              {/* Skip Buttons */}
              <button
                onClick={() => skipTime(-10)}
                className="text-white hover:text-indigo-400 text-sm"
                data-testid="skip-backward"
              >
                -10s
              </button>
              <button
                onClick={() => skipTime(10)}
                className="text-white hover:text-indigo-400 text-sm"
                data-testid="skip-forward"
              >
                +10s
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 3.75a.75.75 0 00-1.264-.546L4.703 7H3.167a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h1.536l4.033 3.796A.75.75 0 0010 16.25V3.75zM12.5 10a1.5 1.5 0 01-.712-2.82l.212-.106a.75.75 0 11.712 1.32l-.212.106A1.5 1.5 0 0112.5 10z" />
                </svg>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  data-testid="volume-slider"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Playback Speed */}
              <div className="flex gap-1">
                {[0.5, 1, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handlePlaybackRateChange(rate)}
                    className={`px-2 py-1 text-xs rounded ${
                      playbackRate === rate
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    data-testid={`speed-${rate}x`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-indigo-400"
                data-testid="fullscreen-button"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      <div className="mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Player Info</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Status</p>
            <p className="font-medium text-gray-900 dark:text-white" data-testid="status">
              {isPlaying ? 'Playing' : 'Paused'}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Speed</p>
            <p className="font-medium text-gray-900 dark:text-white" data-testid="playback-speed">
              {playbackRate}x
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">Volume</p>
            <p className="font-medium text-gray-900 dark:text-white" data-testid="volume-level">
              {Math.round(volume * 100)}%
            </p>
          </div>
          <div>
            <p className="text-gray-600">Fullscreen</p>
            <p className="font-medium text-gray-900">{isFullscreen ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
