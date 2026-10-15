'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Square,
  RefreshCw,
  Video,
  Download,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Activity,
  Radio,
  Settings2,
  Sliders,
  Laptop,
} from 'lucide-react';

interface AudioDeviceInfo {
  deviceId: string;
  label: string;
}

export function MicTestTool() {
  // Devices & Stream
  const [devices, setDevices] = useState<AudioDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Audio Stats
  const [volume, setVolume] = useState<number>(0);
  const [peakVolume, setPeakVolume] = useState<number>(0);
  const [sampleRate, setSampleRate] = useState<number>(0);
  const [channelCount, setChannelCount] = useState<number>(1);
  const [micLabel, setMicLabel] = useState<string>('');
  const [soundDetected, setSoundDetected] = useState<boolean>(false);

  // Echo Playback Test (Record & Listen)
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordTimeLeft, setRecordTimeLeft] = useState<number>(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingBack, setIsPlayingBack] = useState<boolean>(false);

  // Audio Context & Stream Refs
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animFrameIdRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Recording Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const playbackAudioRef = useRef<HTMLAudioElement | null>(null);

  /* ─── Enumerate Audio Devices ─── */
  const enumerateAudioDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = allDevices
        .filter((d) => d.kind === 'audioinput')
        .map((d, index) => ({
          deviceId: d.deviceId,
          label: d.label || `Microphone ${index + 1}`,
        }));
      setDevices(audioInputs);
      if (audioInputs.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(audioInputs[0].deviceId);
      }
    } catch (err) {
      console.warn('Unable to enumerate audio devices:', err);
    }
  }, [selectedDeviceId]);

  /* ─── Stop Microphone Stream ─── */
  const stopMicrophone = useCallback(() => {
    cancelAnimationFrame(animFrameIdRef.current);

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsListening(false);
    setVolume(0);
  }, []);

  /* ─── Real-Time Audio Visualizer & Level Meter ─── */
  const drawWaveformRef = useRef<() => void>(() => {});

  const drawWaveform = useCallback(() => {
    if (!analyserRef.current || !canvasRef.current) return;

    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const timeData = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(timeData);

    // Calculate RMS volume level (0 to 100)
    let sumSquares = 0;
    for (let i = 0; i < bufferLength; i++) {
      const normalized = (timeData[i] - 128) / 128;
      sumSquares += normalized * normalized;
    }
    const rms = Math.sqrt(sumSquares / bufferLength);
    // Amplify slightly for intuitive display
    const calculatedVolume = Math.min(100, Math.round(rms * 180));
    setVolume(calculatedVolume);

    if (calculatedVolume > 10) {
      setSoundDetected(true);
    }

    setPeakVolume((prev) => Math.max(prev, calculatedVolume));

    // Draw Smooth Oscilloscope Waveform
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Subtle background grid
    ctx.fillStyle = '#0F1117';
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = '#1E2333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Waveform line
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = calculatedVolume > 50 ? '#22c55e' : calculatedVolume > 15 ? '#414FA8' : '#64748b';
    ctx.beginPath();

    const sliceWidth = (width * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = timeData[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();

    animFrameIdRef.current = requestAnimationFrame(() => drawWaveformRef.current());
  }, []);

  useEffect(() => {
    drawWaveformRef.current = drawWaveform;
  }, [drawWaveform]);

  /* ─── Start Microphone ─── */
  const startMicrophone = useCallback(
    async (deviceIdToUse?: string) => {
      setError(null);
      setIsLoading(true);
      stopMicrophone();

      try {
        const constraints: MediaStreamConstraints = {
          audio: {
            deviceId: deviceIdToUse ? { exact: deviceIdToUse } : undefined,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        // Audio Context & Analyser
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        sourceRef.current = source;
        source.connect(analyser);

        const track = stream.getAudioTracks()[0];
        if (track) {
          setMicLabel(track.label || 'Default Microphone');
          const settings = track.getSettings ? track.getSettings() : null;
          setSampleRate(settings?.sampleRate || audioCtx.sampleRate || 48000);
          setChannelCount(settings?.channelCount || 1);
        }

        setIsListening(true);
        setIsLoading(false);
        setPeakVolume(0);
        setSoundDetected(false);

        // Start waveform animation
        animFrameIdRef.current = requestAnimationFrame(drawWaveform);

        // Re-enumerate to get full hardware names
        await enumerateAudioDevices();
      } catch (err: any) {
        setIsLoading(false);
        setIsListening(false);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Microphone permission was denied. Please allow microphone access in your browser address bar.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError('No microphone found on this device. Please connect a headset or mic.');
        } else {
          setError(`Microphone error: ${err.message || 'Unable to access microphone.'}`);
        }
      }
    },
    [drawWaveform, enumerateAudioDevices, stopMicrophone]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      enumerateAudioDevices();
    }, 0);
    return () => {
      clearTimeout(timer);
      stopMicrophone();
    };
  }, [enumerateAudioDevices, stopMicrophone]);

  const handleDeviceChange = (newDeviceId: string) => {
    setSelectedDeviceId(newDeviceId);
    if (isListening) {
      startMicrophone(newDeviceId);
    }
  };

  /* ─── Voice Echo Playback Test (Record 5s & Play) ─── */
  const startEchoTest = () => {
    if (!streamRef.current || !isListening) {
      setError('Please start the microphone first before running the playback echo test.');
      return;
    }

    try {
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        setIsRecording(false);
        setRecordTimeLeft(0);

        // Auto playback so user instantly hears themselves
        const audio = new Audio(url);
        playbackAudioRef.current = audio;
        setIsPlayingBack(true);
        audio.play().catch(() => {});
        audio.onended = () => setIsPlayingBack(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordTimeLeft(5);

      const interval = setInterval(() => {
        setRecordTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              mediaRecorderRef.current.stop();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError('Echo recording not supported on this browser.');
    }
  };

  const playRecordedVoice = () => {
    if (!recordedAudioUrl) return;
    if (playbackAudioRef.current) {
      playbackAudioRef.current.pause();
    }
    const audio = new Audio(recordedAudioUrl);
    playbackAudioRef.current = audio;
    setIsPlayingBack(true);
    audio.play().catch(() => {});
    audio.onended = () => setIsPlayingBack(false);
  };

  const stopPlayback = () => {
    if (playbackAudioRef.current) {
      playbackAudioRef.current.pause();
      setIsPlayingBack(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[4px] shadow-xs">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Microphone Access Error</p>
            <p className="mt-0.5 text-red-600">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-xs text-red-800 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Microphone Visualizer Card */}
      <div className="bg-[#0F1117] rounded-[6px] border border-gray-800 overflow-hidden shadow-md">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#171923] border-b border-gray-800 text-white">
          <div className="flex items-center gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                isListening ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'
              }`}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-200">
              {isListening ? 'Microphone Active' : 'Microphone Off'}
            </span>

            {isListening && soundDetected && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold rounded">
                <CheckCircle2 className="h-3 w-3" />
                Sound Detected
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isListening ? (
              <button
                type="button"
                onClick={() => startMicrophone(selectedDeviceId)}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] text-white text-xs font-bold rounded-[4px] transition-colors shadow-xs"
              >
                <Mic className="h-4 w-4" />
                <span>{isLoading ? 'Connecting...' : 'Test My Mic'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopMicrophone}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600/90 hover:bg-red-700 text-white text-xs font-bold rounded-[4px] transition-colors shadow-xs"
              >
                <MicOff className="h-4 w-4" />
                <span>Stop Mic</span>
              </button>
            )}
          </div>
        </div>

        {/* Waveform Canvas */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="relative rounded overflow-hidden border border-gray-800 bg-[#090A0F]">
            <canvas
              ref={canvasRef}
              width={700}
              height={140}
              className="w-full h-32 sm:h-36 block"
            />
            {!isListening && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black/40 backdrop-blur-xs">
                <Mic className="h-8 w-8 text-[#414FA8] mb-2" />
                <p className="text-xs font-bold text-white">Click &ldquo;Test My Mic&rdquo; to begin</p>
                <p className="text-[11px] text-gray-400">Speak into your microphone to view live voice waveform</p>
              </div>
            )}
          </div>

          {/* Real-time Volume Decibel Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-gray-300">
              <span className="flex items-center gap-1.5">
                <Volume2 className="h-4 w-4 text-[#414FA8]" />
                Input Volume Level
              </span>
              <span className="font-mono text-emerald-400">{volume}%</span>
            </div>

            <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden p-0.5 border border-gray-700">
              <div
                className="h-full rounded-full transition-all duration-75"
                style={{
                  width: `${volume}%`,
                  background:
                    volume > 80
                      ? 'linear-gradient(90deg, #22c55e 0%, #eab308 70%, #ef4444 100%)'
                      : volume > 40
                      ? 'linear-gradient(90deg, #22c55e 0%, #eab308 100%)'
                      : '#22c55e',
                }}
              />
            </div>

            <div className="flex justify-between text-[10px] text-gray-500 font-mono">
              <span>0% (Silent)</span>
              <span>25%</span>
              <span>50% (Normal Voice)</span>
              <span>75% (Loud)</span>
              <span>100% (Clipping)</span>
            </div>
          </div>
        </div>

        {/* Voice Echo Playback Test Strip */}
        <div className="px-4 sm:px-6 py-4 bg-[#141721] border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-[#414FA8]/20 border border-[#414FA8]/40 flex items-center justify-center text-[#414FA8] shrink-0">
              <Radio className="h-5 w-5" />
            </div>
            <div>
              <span className="text-xs font-bold block">Voice Playback & Echo Test</span>
              <span className="text-[11px] text-gray-400">
                Record 5 seconds of speaking to hear your actual voice clarity
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {isRecording ? (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded animate-pulse">
                <span className="h-2.5 w-2.5 rounded-full bg-white" />
                <span>Recording Voice ({recordTimeLeft}s)...</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={startEchoTest}
                disabled={!isListening}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#414FA8] hover:bg-[#343f88] disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-xs font-semibold rounded transition-colors shadow-xs"
              >
                <Play className="h-3.5 w-3.5" />
                <span>Record & Test Playback (5s)</span>
              </button>
            )}

            {recordedAudioUrl && !isRecording && (
              <button
                type="button"
                onClick={isPlayingBack ? stopPlayback : playRecordedVoice}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded transition-colors"
              >
                {isPlayingBack ? (
                  <>
                    <Square className="h-3.5 w-3.5" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5" />
                    <span>Listen Again</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Technical Diagnostics & Device Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Device Selection Card */}
        <div className="bg-white p-4 sm:p-5 rounded-[6px] border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
            <Settings2 className="h-4 w-4 text-[#414FA8]" />
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Microphone Device & Audio Specs
            </h4>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Select Microphone
            </label>
            <select
              value={selectedDeviceId}
              onChange={(e) => handleDeviceChange(e.target.value)}
              className="w-full text-xs font-medium bg-[#FAFAFC] border border-gray-200 rounded-[4px] p-2.5 text-gray-800 focus:outline-none focus:border-[#414FA8]"
            >
              {devices.length === 0 ? (
                <option value="">Default Microphone</option>
              ) : (
                devices.map((d) => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.label}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-gray-50 border border-gray-100 rounded">
              <span className="text-gray-400 text-[11px] block">Sample Rate</span>
              <span className="font-bold text-gray-800">
                {isListening && sampleRate > 0 ? `${(sampleRate / 1000).toFixed(1)} kHz` : '—'}
              </span>
            </div>
            <div className="p-2.5 bg-gray-50 border border-gray-100 rounded">
              <span className="text-gray-400 text-[11px] block">Channel Setup</span>
              <span className="font-bold text-gray-800">
                {isListening ? (channelCount === 2 ? 'Stereo (2 ch)' : 'Mono (1 ch)') : '—'}
              </span>
            </div>
            <div className="p-2.5 bg-gray-50 border border-gray-100 rounded">
              <span className="text-gray-400 text-[11px] block">Peak Volume Hit</span>
              <span className="font-bold text-gray-800">{isListening ? `${peakVolume}%` : '—'}</span>
            </div>
            <div className="p-2.5 bg-gray-50 border border-gray-100 rounded">
              <span className="text-gray-400 text-[11px] block">Noise Suppression</span>
              <span className="font-bold text-emerald-600">{isListening ? 'Active' : '—'}</span>
            </div>
          </div>
        </div>

        {/* Quality Diagnosis & Meeting Checklist */}
        <div className="bg-white p-4 sm:p-5 rounded-[6px] border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
            <Activity className="h-4 w-4 text-[#414FA8]" />
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Microphone Health Diagnosis
            </h4>
          </div>

          {/* Dynamic Diagnosis Badge */}
          <div className="p-3 rounded bg-gray-50 border border-gray-200 space-y-1">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
              Live Status:
            </span>
            {!isListening ? (
              <p className="text-xs text-gray-600">
                Microphone is currently offline. Press &ldquo;Test My Mic&rdquo; to start.
              </p>
            ) : volume > 75 ? (
              <p className="text-xs font-bold text-amber-600">
                ⚠️ Loud Audio / High Volume. Back away slightly to avoid voice distortion.
              </p>
            ) : volume > 20 ? (
              <p className="text-xs font-bold text-emerald-700">
                ✅ Excellent Clarity. Your voice volume is optimal for meetings and exams.
              </p>
            ) : soundDetected ? (
              <p className="text-xs font-medium text-gray-700">
                🎙️ Sound detected. Speak a full sentence into your mic to verify volume level.
              </p>
            ) : (
              <p className="text-xs text-amber-700">
                ⏳ Waiting for voice. If you are speaking and the bar does not move, check your hardware mute switch.
              </p>
            )}
          </div>

          {/* Compatibility Badges */}
          <div className="pt-1">
            <span className="text-[11px] font-semibold text-gray-500 block mb-2">
              Application Compatibility:
            </span>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className={`px-2 py-1 rounded font-medium flex items-center gap-1 ${isListening ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500'}`}>
                <CheckCircle2 className="h-3 w-3" /> Zoom & Teams
              </span>
              <span className={`px-2 py-1 rounded font-medium flex items-center gap-1 ${isListening ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500'}`}>
                <CheckCircle2 className="h-3 w-3" /> Google Meet
              </span>
              <span className={`px-2 py-1 rounded font-medium flex items-center gap-1 ${isListening ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500'}`}>
                <CheckCircle2 className="h-3 w-3" /> Discord & Gaming
              </span>
              <span className={`px-2 py-1 rounded font-medium flex items-center gap-1 ${isListening ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500'}`}>
                <CheckCircle2 className="h-3 w-3" /> TCS iON / Online Exams
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Paired Quick Tool Links & Privacy Card */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#EEF1FB] p-4 rounded-[6px] border border-[#9AA3C8]/40 text-[#414FA8]">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
          <p className="text-xs text-gray-700">
            <strong>100% Private & In-Browser:</strong> Audio is processed in real time using HTML5 Web Audio API. No voice recording is ever uploaded or stored.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/tools/webcam-test"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#414FA8] hover:bg-[#343f88] text-white text-xs font-semibold rounded-[4px] transition-colors"
          >
            <Video className="h-3.5 w-3.5" />
            <span>Test Webcam</span>
          </Link>
          <Link
            href="/tools/document-scanner"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-[#9AA3C8] text-[#414FA8] text-xs font-semibold rounded-[4px] transition-colors"
          >
            <span>Document Scanner</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
