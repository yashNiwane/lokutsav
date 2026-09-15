'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Maximize2,
  Minimize2,
  ExternalLink,
  Download,
  PictureInPicture2,
  Smartphone,
  Monitor,
  RotateCcw,
  AlertCircle,
  Film,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface JuryVideoPlayerProps {
  videoUrl: string;
  title?: string;
  participantName?: string;
  district?: string;
  compact?: boolean;
  className?: string;
  onOpenModal?: () => void;
}

type AspectRatioMode = 'auto' | 'portrait' | 'landscape';

export function parseVideoSource(url: string) {
  if (!url) return { type: 'empty' as const, url: '' };

  const clean = url.trim();
  const lower = clean.toLowerCase();

  // YouTube detection
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
    let videoId = '';
    if (lower.includes('/shorts/')) {
      videoId = clean.split('/shorts/')[1]?.split('?')[0]?.split('/')[0] || '';
    } else if (lower.includes('youtu.be/')) {
      videoId = clean.split('youtu.be/')[1]?.split('?')[0]?.split('/')[0] || '';
    } else if (lower.includes('watch?v=')) {
      videoId = clean.split('watch?v=')[1]?.split('&')[0]?.split('#')[0] || '';
    } else if (lower.includes('/embed/')) {
      videoId = clean.split('/embed/')[1]?.split('?')[0]?.split('/')[0] || '';
    }

    if (videoId) {
      return {
        type: 'youtube' as const,
        embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`,
        originalUrl: clean,
        isShorts: lower.includes('/shorts/'),
      };
    }
  }

  // Google Drive detection
  if (lower.includes('drive.google.com')) {
    const match = clean.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return {
        type: 'drive' as const,
        embedUrl: `https://drive.google.com/file/d/${match[1]}/preview`,
        originalUrl: clean,
      };
    }
  }

  // Instagram detection
  if (lower.includes('instagram.com/reel/') || lower.includes('instagram.com/p/')) {
    return {
      type: 'instagram' as const,
      originalUrl: clean,
    };
  }

  // Direct video file (local upload, mp4, mov, webm, etc.)
  return {
    type: 'direct' as const,
    url: clean,
    originalUrl: clean,
  };
}

export default function JuryVideoPlayer({
  videoUrl,
  title,
  participantName,
  district,
  compact = false,
  className = '',
  onOpenModal,
}: JuryVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [aspectMode, setAspectMode] = useState<AspectRatioMode>('auto');
  const [isTheater, setIsTheater] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [detectedRatio, setDetectedRatio] = useState<'portrait' | 'landscape' | 'unknown'>('unknown');

  const parsed = parseVideoSource(videoUrl);

  // Auto-detect aspect ratio from video dimensions once loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const { videoWidth, videoHeight } = videoRef.current;
      if (videoWidth && videoHeight) {
        if (videoHeight > videoWidth * 1.15) {
          setDetectedRatio('portrait');
          // If in auto mode, portrait is naturally preserved
        } else {
          setDetectedRatio('landscape');
        }
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch((err) => {
        console.warn('Playback blocked:', err);
      });
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handlePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (videoRef.current.requestPictureInPicture) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('PiP error:', err);
    }
  };

  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch((e) => console.warn(e));
    } else {
      document.exitFullscreen?.().catch((e) => console.warn(e));
    }
  };

  // Determine container styling based on aspectMode and isTheater
  const getContainerClasses = () => {
    if (parsed.type === 'youtube' && parsed.isShorts) {
      return 'max-w-[340px] aspect-[9/16] mx-auto';
    }

    if (aspectMode === 'portrait') {
      return isTheater
        ? 'max-w-[420px] aspect-[9/16] mx-auto min-h-[500px]'
        : 'max-w-[320px] aspect-[9/16] mx-auto min-h-[420px]';
    }

    if (aspectMode === 'landscape') {
      return isTheater
        ? 'w-full aspect-video max-h-[580px]'
        : 'w-full aspect-video max-h-[420px]';
    }

    // 'auto' mode
    if (detectedRatio === 'portrait') {
      return isTheater
        ? 'max-w-[440px] aspect-[9/16] mx-auto'
        : 'max-w-[340px] aspect-[9/16] mx-auto';
    }

    return isTheater
      ? 'w-full min-h-[380px] max-h-[600px]'
      : 'w-full min-h-[280px] max-h-[460px]';
  };

  return (
    <div
      ref={containerRef}
      className={`bg-stone-950 rounded-2xl border border-stone-800 text-white overflow-hidden flex flex-col shadow-xl transition-all duration-200 ${className}`}
    >
      {/* Top Header Controls */}
      <div className="px-4 py-2.5 bg-stone-900/90 border-b border-stone-800/80 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#9B1B1E] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Film className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-stone-100 truncate">
              {title || 'सजावट व्हिडिओ देखावा'}
            </h4>
            {(participantName || district) && (
              <p className="text-[11px] text-stone-400 truncate">
                {participantName} {district && `• ${district}`}
              </p>
            )}
          </div>
        </div>

        {/* View Mode & Sizing Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Detected Ratio Badge */}
          {detectedRatio !== 'unknown' && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-800 text-stone-300 border border-stone-700">
              {detectedRatio === 'portrait' ? (
                <>
                  <Smartphone className="w-2.5 h-2.5 text-amber-400" />
                  <span>उभा (Reel)</span>
                </>
              ) : (
                <>
                  <Monitor className="w-2.5 h-2.5 text-blue-400" />
                  <span>आडवा (Landscape)</span>
                </>
              )}
            </span>
          )}

          {/* Aspect Ratio Switcher */}
          <div className="bg-stone-800/90 p-0.5 rounded-lg border border-stone-700 flex items-center gap-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => setAspectMode('auto')}
              title="स्वयंचलित आकार (Auto Aspect)"
              className={`px-2 py-1 rounded-md font-medium transition-colors ${
                aspectMode === 'auto'
                  ? 'bg-[#9B1B1E] text-white font-bold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              ऑटो
            </button>
            <button
              type="button"
              onClick={() => setAspectMode('portrait')}
              title="उभा स्मार्टफोन देखावा (Portrait 9:16)"
              className={`px-1.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                aspectMode === 'portrait'
                  ? 'bg-[#9B1B1E] text-white font-bold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span className="hidden md:inline">उभा</span>
            </button>
            <button
              type="button"
              onClick={() => setAspectMode('landscape')}
              title="आडवा टीव्ही/लॅपटॉप देखावा (Landscape 16:9)"
              className={`px-1.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                aspectMode === 'landscape'
                  ? 'bg-[#9B1B1E] text-white font-bold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span className="hidden md:inline">आडवा</span>
            </button>
          </div>

          {/* Theater Toggle */}
          {!compact && (
            <button
              type="button"
              onClick={() => setIsTheater(!isTheater)}
              title={isTheater ? 'सामान्य आकार' : 'विस्तारित आकार (Theater Mode)'}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                isTheater
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                  : 'bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-300'
              }`}
            >
              {isTheater ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Fullscreen Modal trigger if provided */}
          {onOpenModal && (
            <button
              type="button"
              onClick={onOpenModal}
              title="पूर्ण स्क्रीन पॉपअप उघडा"
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative bg-black flex items-center justify-center p-2 sm:p-4 min-h-[260px] overflow-hidden">
        <div className={`transition-all duration-300 flex items-center justify-center ${getContainerClasses()}`}>
          {parsed.type === 'direct' && (
            <div className="w-full h-full relative flex items-center justify-center">
              <video
                ref={videoRef}
                key={videoUrl}
                controls
                playsInline
                preload="metadata"
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={() => {
                  setHasError(true);
                  setErrorMessage('व्हिडिओ लोड करताना अडचण आली किंवा हा फॉरमॅट या ब्राउझरमध्ये थेट प्ले होत नाही.');
                }}
                className="w-full h-full max-h-[540px] object-contain rounded-lg shadow-2xl bg-black"
              >
                <source src={parsed.url} type="video/mp4" />
                <source src={parsed.url} type="video/webm" />
                <source src={parsed.url} type="video/quicktime" />
                <source src={parsed.url} />
                तुमच्या ब्राउझरमध्ये हा व्हिडिओ थेट प्ले होत नाही. कृपया खालील डाऊनलोड बटनावर क्लिक करा.
              </video>

              {hasError && (
                <div className="absolute inset-0 bg-stone-900/95 flex flex-col items-center justify-center p-6 text-center space-y-3 rounded-lg border border-red-900/50">
                  <AlertCircle className="w-10 h-10 text-amber-500" />
                  <div>
                    <h5 className="font-bold text-sm text-stone-100">व्हिडिओ थेट दाखवता येत नाही</h5>
                    <p className="text-xs text-stone-400 mt-1 max-w-sm">
                      हा व्हिडिओ मोबाईल फॉरमॅट (उदा. iPhone QuickTime/HEVC) मध्ये असू शकतो. तुम्ही हा व्हिडिओ थेट नवीन टॅबमध्ये किंवा VLC मध्ये उघडू शकता.
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#9B1B1E] hover:bg-[#781416] text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>नवीन टॅबमध्ये उघडा</span>
                    </a>
                    <a
                      href={videoUrl}
                      download
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-lg border border-stone-700 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>डाऊनलोड करा</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {parsed.type === 'youtube' && (
            <iframe
              src={parsed.embedUrl}
              title={title || 'सजावट व्हिडिओ देखावा'}
              className="w-full h-full min-h-[300px] border-0 rounded-lg shadow-2xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}

          {parsed.type === 'drive' && (
            <iframe
              src={parsed.embedUrl}
              title={title || 'सजावट व्हिडिओ देखावा'}
              className="w-full h-full min-h-[340px] border-0 rounded-lg shadow-2xl"
              allow="autoplay"
              allowFullScreen
            />
          )}

          {parsed.type === 'instagram' && (
            <div className="w-full py-10 px-6 bg-stone-900 border border-stone-800 rounded-xl flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Film className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-stone-100">Instagram Reel / Video</h5>
                <p className="text-xs text-stone-400 mt-1 max-w-sm">
                  स्पर्धकाने इन्स्टाग्राम रील लिंक दिली आहे. सुरक्षेच्या कारणास्तव ही रील नवीन विंडोमध्ये उघडा.
                </p>
              </div>
              <a
                href={parsed.originalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                <span>Instagram वर व्हिडिओ पहा</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls & Action Bar */}
      <div className="px-4 py-2.5 bg-stone-900/95 border-t border-stone-800 flex items-center justify-between gap-3 flex-wrap text-xs">
        {/* Playback Speed for direct videos */}
        {parsed.type === 'direct' ? (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-400 font-medium hidden sm:inline">गती:</span>
            <div className="flex items-center gap-1 bg-stone-800 p-0.5 rounded-lg border border-stone-700">
              {[0.75, 1.0, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => changePlaybackRate(rate)}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                    playbackRate === rate
                      ? 'bg-[#9B1B1E] text-white'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Picture-in-Picture */}
            <button
              type="button"
              onClick={handlePiP}
              title="Picture-in-Picture (इतर निकष तपासताना व्हिडिओ तरंगता ठेवा)"
              className="p-1.5 bg-stone-800 hover:bg-stone-700 rounded-lg border border-stone-700 text-stone-300 hover:text-white transition-colors"
            >
              <PictureInPicture2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="text-[11px] text-stone-400">
            {parsed.type === 'youtube' && 'YouTube अधिकृत प्लेअर'}
            {parsed.type === 'drive' && 'Google Drive पूर्वावलोकन'}
          </div>
        )}

        {/* Action Links */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Download Original File */}
          {parsed.type === 'direct' && (
            <a
              href={videoUrl}
              download
              target="_blank"
              rel="noreferrer"
              title="मूळ व्हिडिओ फाईल डाऊनलोड करा"
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 rounded-lg border border-stone-700 text-stone-300 hover:text-white text-[11px] font-semibold transition-colors"
            >
              <Download className="w-3 h-3 text-amber-400" />
              <span>डाऊनलोड</span>
            </a>
          )}

          {/* Open in New Tab */}
          <a
            href={videoUrl}
            target="_blank"
            rel="noreferrer"
            title="नवीन विंडोमध्ये पूर्ण आकारात उघडा"
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#9B1B1E]/90 hover:bg-[#9B1B1E] text-white rounded-lg text-[11px] font-bold shadow-xs transition-colors"
          >
            <span>मोठ्या पडद्यावर उघडा</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
