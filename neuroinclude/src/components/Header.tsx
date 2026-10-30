import React from 'react';
import { ActiveTab } from '../types';
import { 
  Brain, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  FileText, 
  Sparkles,
  Activity,
  Award,
  CheckCircle2,
  Info
} from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  anonymousId: string;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  onLoadSampleData: () => void;
  openDeliverables: () => void;
  batteryProgress: { completed: number; total: number };
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  anonymousId,
  isMuted,
  setIsMuted,
  onLoadSampleData,
  openDeliverables,
  batteryProgress,
}) => {
  const toggleMute = () => {
    sound.muted = !isMuted;
    setIsMuted(!isMuted);
    if (isMuted) {
      sound.playTone(440, 0.1);
    }
  };

  const navItems: { id: ActiveTab; label: string; icon: string; badge?: string }[] = [
    { id: 'home', label: 'Inicio', icon: 'fa-solid fa-house' },
    { id: 'consent', label: 'Privacidad', icon: 'fa-solid fa-user-shield' },
    { 
      id: 'battery', 
      label: 'Batería Cognitiva', 
      icon: 'fa-solid fa-brain', 
      badge: `${batteryProgress.completed}/5` 
    },
    { id: 'eeg', label: 'Laboratorio EEG', icon: 'fa-solid fa-wave-square' },
    { id: 'profile', label: 'Perfil & Dashboard', icon: 'fa-solid fa-chart-pie' },
    { id: 'goals', label: 'Plan de Bienestar', icon: 'fa-solid fa-bullseye' },
    { id: 'resources', label: 'Recursos Bolivia', icon: 'fa-solid fa-hand-holding-heart' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#060913]/90 backdrop-blur-md border-b border-cyan-500/20">
      {/* Permanent Ethical Notice Bar */}
      <div className="bg-gradient-to-r from-cyan-950/80 via-purple-950/80 to-blue-950/80 border-b border-cyan-500/30 px-3 py-1.5 text-xs text-center text-cyan-200 flex items-center justify-center gap-2">
        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span className="font-semibold tracking-wide">
          AVISO OBLIGATORIO: Prototipo experimental con base neuropsicológica. No es un dispositivo médico ni emite diagnósticos clínicos.
        </span>
        <span className="hidden md:inline text-purple-300 font-mono text-[11px] px-2 py-0.5 rounded bg-purple-900/60 border border-purple-500/30">
          Hack Day La Paz × NeuroTech UMSA 2026
        </span>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('home')} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition">
            <div className="w-full h-full bg-[#080d1e] rounded-[10px] flex items-center justify-center">
              <Brain className="w-5 h-5 text-cyan-300 group-hover:scale-110 transition duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-wider bg-gradient-to-r from-cyan-300 via-sky-200 to-purple-400 bg-clip-text text-transparent">
                NEUROINCLUDE
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                v2.6
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block tracking-wide">
              Discover your brain • Understand your strengths
            </p>
          </div>
        </div>

        {/* User Badges and Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Ephemeral ID badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 text-[11px] font-mono text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 hidden sm:inline">Sesión:</span>
            <span className="text-cyan-300 font-bold">{anonymousId}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Zero-Trace activo"></span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/50 transition text-xs flex items-center gap-1"
            title={isMuted ? 'Activar audio de pruebas' : 'Silenciar audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Fast Jury Demo Button */}
          <button
            onClick={onLoadSampleData}
            className="px-2.5 py-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 hover:text-white transition text-xs font-medium flex items-center gap-1.5 shadow-sm"
            title="Carga datos realistas para presentar rápidamente al jurado"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">Demo Jurado</span>
          </button>

          {/* Deliverables & Pitch Button */}
          <button
            onClick={openDeliverables}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs transition flex items-center gap-1.5 shadow-md shadow-cyan-600/30"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Entregables & Pitch</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="max-w-7xl mx-auto px-2 sm:px-6 overflow-x-auto scrollbar-none border-t border-slate-800/60 bg-[#090f23]/60">
        <nav className="flex space-x-1 sm:space-x-2 py-1.5 min-w-max">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-2 ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <i className={`${item.icon} text-[11px] ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}></i>
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    batteryProgress.completed === 5
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/60'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
