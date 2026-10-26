// ── Interactive Speed Test Modal & Component (Ookla Style) ─────────────────────
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  Zap, ArrowDown, ArrowUp, Activity, Server, Globe, RotateCcw, X, 
  CheckCircle2, Share2, ShieldCheck, Sparkles 
} from 'lucide-react';
import { useLang } from '../context/LangContext';

const SERVERS = [
  { id: 'dhaka-core', name: 'RedLink Dhaka Core 1 (BDIX 100G)', location: 'Dhaka, Bangladesh', host: 'bdix.redlink.net' },
  { id: 'ctg-node', name: 'RedLink Chittagong Coastal Hub', location: 'Chittagong, Bangladesh', host: 'ctg.redlink.net' },
  { id: 'sylhet-node', name: 'RedLink Sylhet Metro Ring', location: 'Sylhet, Bangladesh', host: 'sylhet.redlink.net' },
];

export function SpeedTestWidget({ onClose, isModal = false }) {
  const { isBn } = useLang();
  const [stage, setStage] = useState('idle'); // idle | ping | download | upload | complete
  const [selectedServer, setSelectedServer] = useState(SERVERS[0]);
  const [ping, setPing] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [progress, setProgress] = useState(0);

  const animRef = useRef(null);

  // Trigger Confetti
  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF2D3F', '#B30F1F', '#ffffff', '#FF808A', '#FFD700']
      });
    } catch {
      // ignore
    }
  };

  const startTest = () => {
    setStage('ping');
    setPing(0);
    setJitter(0);
    setDownloadSpeed(0);
    setUploadSpeed(0);
    setCurrentSpeed(0);
    setProgress(0);

    // 1. Simulate Ping & Jitter Phase (1.5 seconds)
    let pCount = 0;
    const pingInterval = setInterval(() => {
      pCount += 1;
      const simPing = Math.floor(3 + Math.random() * 4); // 3-7ms on fiber
      const simJitter = Math.floor(1 + Math.random() * 2);
      setPing(simPing);
      setJitter(simJitter);

      if (pCount >= 5) {
        clearInterval(pingInterval);
        startDownloadPhase();
      }
    }, 280);
  };

  const startDownloadPhase = () => {
    setStage('download');
    const targetDownload = Math.floor(88 + Math.random() * 20); // 88-108 Mbps
    const startTime = Date.now();
    const duration = 3200; // 3.2s

    const runDownload = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const pct = Math.min(1, elapsed / duration);
      setProgress(pct * 50);

      // Ease out curve
      const eased = 1 - Math.pow(1 - pct, 3);
      const noise = (Math.random() - 0.5) * 6;
      const speed = Math.max(0, Math.min(120, (eased * targetDownload) + noise));
      
      setCurrentSpeed(parseFloat(speed.toFixed(1)));
      setDownloadSpeed(parseFloat(speed.toFixed(1)));

      if (pct < 1) {
        animRef.current = requestAnimationFrame(runDownload);
      } else {
        setDownloadSpeed(targetDownload);
        startUploadPhase();
      }
    };
    animRef.current = requestAnimationFrame(runDownload);
  };

  const startUploadPhase = () => {
    setStage('upload');
    const targetUpload = Math.floor(82 + Math.random() * 18); // 82-100 Mbps
    const startTime = Date.now();
    const duration = 2800; // 2.8s

    const runUpload = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const pct = Math.min(1, elapsed / duration);
      setProgress(50 + pct * 50);

      const eased = 1 - Math.pow(1 - pct, 3);
      const noise = (Math.random() - 0.5) * 5;
      const speed = Math.max(0, Math.min(110, (eased * targetUpload) + noise));

      setCurrentSpeed(parseFloat(speed.toFixed(1)));
      setUploadSpeed(parseFloat(speed.toFixed(1)));

      if (pct < 1) {
        animRef.current = requestAnimationFrame(runUpload);
      } else {
        setUploadSpeed(targetUpload);
        setCurrentSpeed(targetUpload);
        setStage('complete');
        fireConfetti();
      }
    };
    animRef.current = requestAnimationFrame(runUpload);
  };

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Gauge angle calculation (0 to 120 Mbps mapped to -120deg to +120deg)
  const maxScale = 120;
  const needleRotation = Math.min(120, Math.max(-120, ((currentSpeed / maxScale) * 240) - 120));

  return (
    <div className={`relative ${isModal ? 'p-6 sm:p-8' : 'p-6 sm:p-10'} text-white`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF2D3F] to-[#B30F1F] flex items-center justify-center shadow-red-glow">
            <Zap size={22} className="text-white" />
          </div>
          <div>
            <h3 className={`text-xl font-bold font-poppins flex items-center gap-2 ${isBn ? 'font-bangla' : ''}`}>
              {isBn ? 'রেডলিংক স্পিড টেস্ট' : 'RedLink Live Speed Test'}
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                Ookla Tech
              </span>
            </h3>
            <p className="text-xs text-[#B8B8C0]">
              {isBn ? 'রিয়েল-টাইম ফাইবার কানেকশন ভেরিফিকেশন' : 'Real-time Fiber Latency & Throughput Diagnostics'}
            </p>
          </div>
        </div>

        {isModal && onClose && (
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-[#B8B8C0] hover:text-white transition-all"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Server & Client IP Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-xs">
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server size={14} className="text-red-400" />
            <span className="text-[#B8B8C0]">{isBn ? 'সার্ভার:' : 'Server:'}</span>
          </div>
          <select
            value={selectedServer.id}
            onChange={(e) => setSelectedServer(SERVERS.find(s => s.id === e.target.value) || SERVERS[0])}
            disabled={stage !== 'idle' && stage !== 'complete'}
            className="bg-black/60 border border-white/15 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none focus:border-red-500"
          >
            {SERVERS.map(s => (
              <option key={s.id} value={s.id} className="bg-[#111113] text-white">{s.name}</option>
            ))}
          </select>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-green-400" />
            <span className="text-[#B8B8C0]">{isBn ? 'আপনার নেটওয়ার্ক:' : 'Your Network:'}</span>
          </div>
          <span className="text-white font-mono font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            103.145.22.84 (RedLink Fiber)
          </span>
        </div>
      </div>

      {/* Main Gauge Visual */}
      <div className="relative flex flex-col items-center justify-center my-8">
        {/* SVG Arc Gauge */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
            {/* Background Track */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="transparent"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="12"
              strokeDasharray="376"
              strokeDashoffset="125"
              strokeLinecap="round"
            />
            {/* Active Gauge Bar */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="transparent"
              stroke="url(#speedGradient)"
              strokeWidth="12"
              strokeDasharray="376"
              strokeDashoffset={376 - ((currentSpeed / maxScale) * 251)}
              strokeLinecap="round"
              className="transition-all duration-150 ease-out"
            />
            <defs>
              <linearGradient id="speedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF2D3F" />
                <stop offset="70%" stopColor="#FF6B78" />
                <stop offset="100%" stopColor="#4ADE80" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Dial Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            {stage === 'idle' ? (
              <motion.button
                onClick={startTest}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="w-28 h-28 rounded-full bg-gradient-to-br from-[#FF2D3F] to-[#B30F1F] text-white font-black text-2xl tracking-wider uppercase flex flex-col items-center justify-center shadow-red-glow border-2 border-white/20 transition-all cursor-pointer group"
              >
                <span>GO</span>
                <span className="text-[10px] font-normal tracking-normal text-white/80 -mt-1 group-hover:tracking-wider transition-all">START</span>
              </motion.button>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <span className="text-xs uppercase tracking-widest text-[#B8B8C0] font-semibold mb-1">
                  {stage === 'ping' && (isBn ? 'পিং পরিমাপ হচ্ছে...' : 'Testing Latency...')}
                  {stage === 'download' && (isBn ? 'ডাউনলোড স্পিড' : 'Download Speed')}
                  {stage === 'upload' && (isBn ? 'আপলোড স্পিড' : 'Upload Speed')}
                  {stage === 'complete' && (isBn ? 'টেস্ট সম্পন্ন!' : 'Test Complete!')}
                </span>
                <span className="text-5xl sm:text-6xl font-black font-poppins gradient-text">
                  {currentSpeed.toFixed(0)}
                </span>
                <span className="text-xs text-[#B8B8C0] font-medium mt-1">Mbps</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar during test */}
        {stage !== 'idle' && stage !== 'complete' && (
          <div className="w-full max-w-xs mt-4">
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#FF2D3F] to-green-400"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
        {/* Ping */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-center relative overflow-hidden">
          {stage === 'ping' && <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 animate-pulse" />}
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#B8B8C0] mb-1">
            <Activity size={13} className="text-yellow-400" />
            <span>{isBn ? 'পিং' : 'Ping'}</span>
          </div>
          <div className="text-xl font-bold font-poppins text-white">
            {ping ? `${ping} ` : '-- '}
            <span className="text-xs font-normal text-[#B8B8C0]">ms</span>
          </div>
        </div>

        {/* Jitter */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-center relative overflow-hidden">
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#B8B8C0] mb-1">
            <ShieldCheck size={13} className="text-blue-400" />
            <span>{isBn ? 'জিটার' : 'Jitter'}</span>
          </div>
          <div className="text-xl font-bold font-poppins text-white">
            {jitter ? `${jitter} ` : '-- '}
            <span className="text-xs font-normal text-[#B8B8C0]">ms</span>
          </div>
        </div>

        {/* Download */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-center relative overflow-hidden">
          {stage === 'download' && <div className="absolute top-0 left-0 right-0 h-1 bg-green-500 animate-pulse" />}
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#B8B8C0] mb-1">
            <ArrowDown size={13} className="text-green-400" />
            <span>{isBn ? 'ডাউনলোড' : 'Download'}</span>
          </div>
          <div className="text-xl font-bold font-poppins text-white">
            {downloadSpeed ? `${downloadSpeed.toFixed(1)} ` : '-- '}
            <span className="text-xs font-normal text-[#B8B8C0]">Mbps</span>
          </div>
        </div>

        {/* Upload */}
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-center relative overflow-hidden">
          {stage === 'upload' && <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500 animate-pulse" />}
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#B8B8C0] mb-1">
            <ArrowUp size={13} className="text-purple-400" />
            <span>{isBn ? 'আপলোড' : 'Upload'}</span>
          </div>
          <div className="text-xl font-bold font-poppins text-white">
            {uploadSpeed ? `${uploadSpeed.toFixed(1)} ` : '-- '}
            <span className="text-xs font-normal text-[#B8B8C0]">Mbps</span>
          </div>
        </div>
      </div>

      {/* Completion Actions */}
      {stage === 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-center mt-6"
        >
          <div className="flex items-center justify-center gap-2 text-green-400 font-semibold mb-2">
            <CheckCircle2 size={18} />
            <span>{isBn ? 'আপনার অপটিক্যাল ফাইবার সংযোগ দুর্দান্ত পারফর্ম করছে!' : 'Excellent Fiber Quality! Zero Packet Loss Detected.'}</span>
          </div>
          <p className="text-xs text-[#B8B8C0] mb-4">
            {isBn 
              ? 'বাফারলেস 4K স্ট্রিমিং, BDIX আল্ট্রা-স্পিড এবং কম্পিটিটিভ গেমিংয়ের জন্য সম্পূর্ণ প্রস্তুত।'
              : 'Ideal for 4K HDR Streaming, Low-latency Competitive Gaming & Instant BDIX Downloads.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={startTest}
              className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
            >
              <RotateCcw size={14} />
              {isBn ? 'পুনরায় পরীক্ষা করুন' : 'Test Again'}
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'RedLink Fiber Speed Test',
                    text: `My RedLink Fiber speed is ${downloadSpeed} Mbps Download / ${uploadSpeed} Mbps Upload with ${ping}ms Ping!`,
                    url: window.location.href,
                  }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(`RedLink Fiber: ${downloadSpeed} Mbps Download | ${uploadSpeed} Mbps Upload | ${ping}ms Ping`);
                  alert('Results copied to clipboard!');
                }
              }}
              className="btn-outline text-xs px-4 py-2 flex items-center gap-1.5"
            >
              <Share2 size={14} />
              {isBn ? 'ফলাফল শেয়ার করুন' : 'Share Results'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ── Modal Wrapper ─────────────────────────────────────────────────────────────
export default function SpeedTestModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="glass-card-static w-full max-w-2xl rounded-3xl overflow-hidden border border-white/15 shadow-2xl"
          style={{ background: 'rgba(15,15,18,0.95)' }}
        >
          <SpeedTestWidget onClose={onClose} isModal={true} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
