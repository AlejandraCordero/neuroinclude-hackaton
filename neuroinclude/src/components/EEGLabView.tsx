import React, { useState, useEffect, useRef } from 'react';
import { EEGSimMetrics, ActiveTab } from '../types';
import { 
  Activity, 
  Bluetooth, 
  Radio, 
  Sparkles, 
  Sliders, 
  Eye, 
  Zap, 
  Info, 
  Layers,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface EEGLabViewProps {
  onUpdateMetrics: (metrics: EEGSimMetrics) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const EEGLabView: React.FC<EEGLabViewProps> = ({ onUpdateMetrics, setActiveTab }) => {
  const [deviceMode, setDeviceMode] = useState<'synthetic' | 'bluetoothMock'>('synthetic');
  const [mentalState, setMentalState] = useState<'focused' | 'relaxed' | 'neutral'>('focused');
  const [mentalWorkload, setMentalWorkload] = useState<number>(70); // 0 to 100
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationIdRef = useRef<number>(0);
  const timeOffsetRef = useRef<number>(0);

  // Channels definition
  const bands = [
    { name: 'Delta', range: '0.5 - 4 Hz', color: '#ec4899', desc: 'Sueño profundo y regeneración' },
    { name: 'Theta', range: '4 - 8 Hz', color: '#a855f7', desc: 'Memoria y procesamiento interno' },
    { name: 'Alpha', range: '8 - 13 Hz', color: '#06b6d4', desc: 'Calma atenta y desincronización' },
    { name: 'Beta', range: '13 - 30 Hz', color: '#3b82f6', desc: 'Foco activo y cálculo mental' },
    { name: 'Gamma', range: '30 - 50 Hz', color: '#10b981', desc: 'Integración multisensorial' },
  ];

  // Mathematical signal modulation in Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 360);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
    };
    window.addEventListener('resize', handleResize);

    const channelHeight = height / bands.length;

    const render = () => {
      if (!isRecording) {
        animationIdRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.fillStyle = '#060a17';
      ctx.fillRect(0, 0, width, height);

      timeOffsetRef.current += 0.045;
      const t = timeOffsetRef.current;

      // Draw horizontal channel dividers and signals
      bands.forEach((band, idx) => {
        const centerY = idx * channelHeight + channelHeight / 2;

        // Draw subtle grid baseline
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();

        // Draw waveform
        ctx.beginPath();
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = band.color;

        // Workload modulation factors
        const workloadNorm = mentalWorkload / 100;
        let ampFactor = 1.0;
        let freqFactor = 1.0;

        if (band.name === 'Alpha') {
          // Alpha desynchronizes (attenuates) with high mental workload
          ampFactor = 1.8 - workloadNorm * 1.2;
        } else if (band.name === 'Beta') {
          // Beta increases with focus
          ampFactor = 0.6 + workloadNorm * 1.4;
        } else if (band.name === 'Gamma') {
          ampFactor = 0.4 + workloadNorm * 1.0;
        }

        // Draw wave across canvas width
        for (let x = 0; x < width; x += 3) {
          const sampleTime = t + x * 0.015;
          let wave = 0;

          if (band.name === 'Delta') {
            wave = Math.sin(sampleTime * 1.5) * 14 + Math.sin(sampleTime * 0.8) * 8;
          } else if (band.name === 'Theta') {
            wave = Math.sin(sampleTime * 5) * 11 + Math.cos(sampleTime * 2.5) * 6;
          } else if (band.name === 'Alpha') {
            wave = Math.sin(sampleTime * 10 * freqFactor) * 15 * ampFactor + Math.sin(sampleTime * 8) * 4;
          } else if (band.name === 'Beta') {
            wave = Math.sin(sampleTime * 20) * 9 * ampFactor + Math.sin(sampleTime * 16) * 5;
          } else if (band.name === 'Gamma') {
            wave = Math.sin(sampleTime * 38) * 6 * ampFactor + (Math.random() - 0.5) * 4;
          }

          // Biological 1/f noise
          wave += (Math.random() - 0.5) * 3.5;

          // Blink artifact spike injection
          if (isBlinking && (band.name === 'Delta' || band.name === 'Theta')) {
            wave += Math.exp(-Math.pow((x - width / 2) / 30, 2)) * 40;
          }

          const y = centerY + wave;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // Channel label in canvas
        ctx.fillStyle = band.color;
        ctx.font = 'bold 11px JetBrains Mono, monospace';
        ctx.fillText(`${band.name} (${band.range})`, 12, centerY - 14);
      });

      animationIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationIdRef.current);
    };
  }, [bands, mentalWorkload, isBlinking, isRecording]);

  // Trigger ocular blink artifact for 600ms
  const triggerBlink = () => {
    setIsBlinking(true);
    setTimeout(() => setIsBlinking(false), 600);
  };

  // Engagement index calculation: Beta / (Alpha + Theta)
  const workloadNorm = mentalWorkload / 100;
  const alphaPower = Math.max(10, Math.round(45 * (1.6 - workloadNorm)));
  const betaPower = Math.max(10, Math.round(20 + workloadNorm * 35));
  const thetaPower = 22;
  const deltaPower = 18;
  const gammaPower = Math.round(10 + workloadNorm * 18);
  const engagementIndex = (betaPower / (alphaPower + thetaPower)).toFixed(2);
  const alphaBetaRatio = (alphaPower / betaPower).toFixed(2);

  // Sync metrics to parent
  useEffect(() => {
    const dominantBand = parseFloat(alphaBetaRatio) > 1.2 ? 'Alpha' : 'Beta';
    onUpdateMetrics({
      dominantBand,
      alphaBetaRatio: parseFloat(alphaBetaRatio),
      engagementIndex: parseFloat(engagementIndex),
      signalStabilityPercent: 96,
      isSynthetic: true,
      channels: {
        delta: deltaPower,
        theta: thetaPower,
        alpha: alphaPower,
        beta: betaPower,
        gamma: gammaPower,
      },
    });
  }, [mentalWorkload, deviceMode]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Title & Warning */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            <Radio className="w-3.5 h-3.5" />
            <span>Módulo D • Laboratorio EEG Demostrativo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">
            Simulador Multicanal & Roadmap de Neurotecnología
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Visualización en tiempo real de bandas electroencefalográficas (<span className="text-pink-400">δ</span>, <span className="text-purple-400">θ</span>, <span className="text-cyan-400">α</span>, <span className="text-blue-400">β</span>, <span className="text-emerald-400">γ</span>) con modulación matemática de carga cognitiva y filtros biológicos.
          </p>
        </div>

        {/* Prominent Synthetic Label */}
        <div className="px-3.5 py-2 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-2 shrink-0">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>DATOS SINTÉTICOS PARA DEMOSTRACIÓN EDUCATIVA</span>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Device Mode Switcher */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
          <label className="text-xs text-slate-400 font-mono uppercase tracking-wider block">
            Fuente de Adquisición
          </label>
          <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setDeviceMode('synthetic')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition ${
                deviceMode === 'synthetic'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-700/60 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Simulación Sintética
            </button>
            <button
              onClick={() => setDeviceMode('bluetoothMock')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition flex items-center justify-center gap-1 ${
                deviceMode === 'bluetoothMock'
                  ? 'bg-purple-950 text-purple-300 border border-purple-700/60 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bluetooth className="w-3.5 h-3.5" />
              <span>Web Bluetooth Mock</span>
            </button>
          </div>
          <div className="text-[11px] text-slate-400">
            {deviceMode === 'synthetic'
              ? 'Generador de armónicos 1/f en navegador.'
              : 'Protocolo de streaming emulado para diademas Muse 2 / OpenBCI Cyton.'}
          </div>
        </div>

        {/* Mental Workload Slider */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
          <div className="flex justify-between items-center">
            <label className="text-xs text-slate-400 font-mono uppercase tracking-wider">
              Carga Mental / Concentración
            </label>
            <span className="text-xs font-mono font-bold text-cyan-400">{mentalWorkload}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={mentalWorkload}
            onChange={(e) => setMentalWorkload(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Relajación (Mayor Alfa)</span>
            <span>Hiperfoco (Mayor Beta)</span>
          </div>
        </div>

        {/* Artifact Injection & Pause Controls */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5 flex flex-col justify-between">
          <label className="text-xs text-slate-400 font-mono uppercase tracking-wider block">
            Interacción con Señal
          </label>
          <div className="flex gap-2">
            <button
              onClick={triggerBlink}
              className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Simular Parpadeo Ocular</span>
            </button>
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`px-3 py-2 rounded-lg border text-xs font-medium transition ${
                isRecording
                  ? 'bg-emerald-950/60 border-emerald-600/50 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-600/50 text-rose-300'
              }`}
            >
              {isRecording ? 'Pausar' : 'Reanudar'}
            </button>
          </div>
          <div className="text-[11px] text-slate-400">
            Inyecta un artefacto electrooculográfico (EOG) en canales frontales.
          </div>
        </div>
      </div>

      {/* Main Canvas Visualizer */}
      <div className="p-5 rounded-2xl bg-[#060a17] border border-cyan-500/20 shadow-2xl space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Filtro Pasa-Banda: 0.5 Hz - 50 Hz | Notch 50 Hz (Red Eléctrica La Paz)</span>
          </div>
          <div className="text-cyan-400">Tasa de Muestreo: 250 Hz</div>
        </div>

        {/* Waveform Canvas */}
        <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#060a17]">
          <canvas ref={canvasRef} className="w-full block" />
        </div>

        {/* Live Power Spectrum Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-pink-500/20 text-center">
            <div className="text-xs text-pink-400 font-bold font-mono">Delta (0.5-4Hz)</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">{deltaPower} µV²</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-purple-500/20 text-center">
            <div className="text-xs text-purple-400 font-bold font-mono">Theta (4-8Hz)</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">{thetaPower} µV²</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-cyan-500/20 text-center">
            <div className="text-xs text-cyan-400 font-bold font-mono">Alpha (8-13Hz)</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">{alphaPower} µV²</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-blue-500/20 text-center">
            <div className="text-xs text-blue-400 font-bold font-mono">Beta (13-30Hz)</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">{betaPower} µV²</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-emerald-500/20 text-center">
            <div className="text-xs text-emerald-400 font-bold font-mono">Gamma (30-50Hz)</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">{gammaPower} µV²</div>
          </div>
        </div>
      </div>

      {/* Real-time Cognitive Ratios & Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Engagement Index Card */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block">
            Índice de Compromiso Cognitivo
          </span>
          <div className="text-3xl font-mono font-black text-cyan-300">
            {engagementIndex} <span className="text-xs text-slate-500 font-normal">β / (α + θ)</span>
          </div>
          <p className="text-xs text-slate-400">
            Fórmula de Freeman & Pope (1995) utilizada en neuroergonomía para estimar la carga de procesamiento atencional sostenido.
          </p>
        </div>

        {/* Alpha / Beta Ratio */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block">
            Ratio Alfa / Beta (Relajación vs Activación)
          </span>
          <div className="text-3xl font-mono font-black text-purple-300">
            {alphaBetaRatio} <span className="text-xs text-slate-500 font-normal">α / β</span>
          </div>
          <p className="text-xs text-slate-400">
            {parseFloat(alphaBetaRatio) > 1.2
              ? 'Estado predominante de calma y receptividad sensorial.'
              : 'Estado de alta concentración activa y filtrado inhibitorio.'}
          </p>
        </div>

        {/* Hardware Roadmap */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-xs text-cyan-400 font-mono uppercase tracking-wider block">
            Roadmap Hardware Abierto UMSA
          </span>
          <ul className="text-xs text-slate-300 space-y-1">
            <li>• Integración directa con Web Bluetooth API (W3C standard)</li>
            <li>• Compatibilidad con OpenBCI GUI y Lab Streaming Layer (LSL)</li>
            <li>• Sensores secos impresos en 3D para bajo costo en Bolivia</li>
          </ul>
        </div>
      </div>

      {/* CTA to Profile */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => setActiveTab('profile')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition"
        >
          <span>Continuar al Perfil & Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
