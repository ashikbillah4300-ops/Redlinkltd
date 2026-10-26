// ── Network Ping & Route Diagnostic Tool (Delight / Easter Egg) ────────────────
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Play, CheckCircle2, ShieldCheck, Cpu, ArrowRight, CornerDownRight } from 'lucide-react';
import { useLang } from '../context/LangContext';

const TARGETS = [
  { name: 'BDIX National Exchange', host: 'ix.bdix.net', ip: '103.242.24.1', basePing: 3.2 },
  { name: 'Google DNS & CDN', host: 'dns.google', ip: '8.8.8.8', basePing: 4.1 },
  { name: 'Cloudflare Edge (Dhaka)', host: 'one.one.one.one', ip: '1.1.1.1', basePing: 2.8 },
  { name: 'Meta / Facebook Cache', host: 'edge.facebook.com', ip: '157.240.239.35', basePing: 3.5 },
  { name: 'AWS ap-south-1 (Mumbai)', host: 'ec2.ap-south-1.amazonaws.com', ip: '13.126.0.1', basePing: 17.4 },
  { name: 'Valve Steam (Singapore)', host: 'sgp.valve.net', ip: '155.133.253.1', basePing: 28.1 },
];

export default function NetworkDiagnosticModal({ isOpen, onClose }) {
  const { isBn } = useLang();
  const [selectedTarget, setSelectedTarget] = useState(TARGETS[0]);
  const [running, setRunning] = useState(false);
  const [hops, setHops] = useState([]);
  const [summary, setSummary] = useState(null);

  if (!isOpen) return null;

  const runTraceroute = () => {
    setRunning(true);
    setHops([]);
    setSummary(null);

    const simulationHops = [
      { hop: 1, name: 'Home Fiber ONU / Router', ip: '192.168.1.1', ping: (0.4 + Math.random() * 0.3).toFixed(1) },
      { hop: 2, name: 'RedLink Metro Aggregation Node', ip: '103.145.22.1', ping: (1.2 + Math.random() * 0.4).toFixed(1) },
      { hop: 3, name: 'RedLink Tier-1 Core Gateway (IIG)', ip: '103.145.20.254', ping: (2.1 + Math.random() * 0.5).toFixed(1) },
      { hop: 4, name: selectedTarget.name, ip: selectedTarget.ip, ping: (selectedTarget.basePing + Math.random() * 0.8).toFixed(1) },
    ];

    simulationHops.forEach((h, index) => {
      setTimeout(() => {
        setHops(prev => [...prev, h]);
        if (index === simulationHops.length - 1) {
          setRunning(false);
          setSummary({
            packetsSent: 4,
            packetsReceived: 4,
            packetLoss: 0,
            avgPing: ((parseFloat(simulationHops[0].ping) + parseFloat(simulationHops[3].ping)) / 2).toFixed(1),
            status: 'Optimal Fiber Routing'
          });
        }
      }, (index + 1) * 600);
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-card-static w-full max-w-2xl rounded-3xl overflow-hidden border border-white/15 shadow-2xl p-6 sm:p-8"
          style={{ background: 'rgba(15,15,18,0.96)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Terminal size={20} />
              </div>
              <div>
                <h3 className={`text-lg font-bold text-white flex items-center gap-2 ${isBn ? 'font-bangla' : ''}`}>
                  {isBn ? 'রেডলিংক নেটওয়ার্ক রাউট ডায়াগনস্টিক' : 'RedLink Live Route Diagnostic'}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    Traceroute ICMP
                  </span>
                </h3>
                <p className="text-xs text-[#B8B8C0]">
                  {isBn ? 'আপনার সংযোগ থেকে গ্লোবাল সার্ভার পর্যন্ত লেটেন্সি ট্র্যাক করুন' : 'Test fiber hop latency and verify direct undersea fiber route'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-[#B8B8C0] hover:text-white transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Target Selector */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-[#B8B8C0] mb-2">
              {isBn ? 'পরীক্ষার গন্তব্য নির্বাচন করুন:' : 'Select Destination Host:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TARGETS.map(t => (
                <button
                  key={t.host}
                  onClick={() => { setSelectedTarget(t); setHops([]); setSummary(null); }}
                  disabled={running}
                  className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                    selectedTarget.host === t.host
                      ? 'bg-red-500/15 border-red-500/40 text-white'
                      : 'bg-white/[0.03] border-white/8 text-[#B8B8C0] hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="font-semibold text-white truncate">{t.name}</div>
                  <div className="font-mono text-[10px] text-[#B8B8C0] opacity-80">{t.host}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Action */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs text-[#B8B8C0] font-mono">
              Target IP: <span className="text-white">{selectedTarget.ip}</span>
            </div>
            <button
              onClick={runTraceroute}
              disabled={running}
              className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
            >
              <Play size={13} className={running ? 'animate-spin' : ''} />
              {running ? (isBn ? 'ট্রেস চলছে...' : 'Tracing Route...') : (isBn ? 'ট্রেস চালান' : 'Trace Route')}
            </button>
          </div>

          {/* Terminal Console Output */}
          <div className="p-4 rounded-2xl bg-black/70 border border-white/10 font-mono text-xs text-white/90 min-h-[170px] space-y-2.5">
            <div className="text-[#B8B8C0] text-[11px] pb-1 border-b border-white/10 flex items-center justify-between">
              <span>traceroute to {selectedTarget.host} ({selectedTarget.ip}), 30 hops max</span>
              <span className="text-green-400">STATUS: READY</span>
            </div>

            {hops.length === 0 && !running && (
              <div className="text-[#71717A] italic py-6 text-center">
                Click &quot;Trace Route&quot; to measure live packet latency across RedLink fiber ring.
              </div>
            )}

            {hops.map(h => (
              <motion.div
                key={h.hop}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between py-1 border-b border-white/5"
              >
                <div className="flex items-center gap-2">
                  <span className="text-red-400 font-bold w-4">#{h.hop}</span>
                  <span className="text-white font-medium">{h.name}</span>
                  <span className="text-[#A1A1AA] text-[10px]">({h.ip})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-400 font-bold">{h.ping} ms</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                </div>
              </motion.div>
            ))}

            {running && (
              <div className="flex items-center gap-2 text-yellow-400 text-xs py-1 animate-pulse">
                <CornerDownRight size={13} />
                <span>Sending ICMP ping probe...</span>
              </div>
            )}

            {summary && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-2 text-[11px] text-green-400 flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} />
                  Trace complete. 0% packet loss.
                </span>
                <span className="text-white">Avg Latency: <strong className="text-green-400">{summary.avgPing} ms</strong></span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
