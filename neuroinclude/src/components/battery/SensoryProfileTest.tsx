import React, { useState } from 'react';
import { SensoryProfileResult } from '../../types';
import { sound } from '../../utils/audio';
import { Sliders, CheckCircle2, Eye, Volume2, Hand, Move, Sparkles } from 'lucide-react';

interface SensoryProfileProps {
  onComplete: (result: SensoryProfileResult) => void;
  savedResult?: SensoryProfileResult;
}

export const SensoryProfileTest: React.FC<SensoryProfileProps> = ({ onComplete, savedResult }) => {
  const [visual, setVisual] = useState<number>(savedResult?.visual || 3.5);
  const [auditory, setAuditory] = useState<number>(savedResult?.auditory || 4.0);
  const [tactile, setTactile] = useState<number>(savedResult?.tactile || 3.0);
  const [proprioceptive, setProprioceptive] = useState<number>(savedResult?.proprioceptive || 3.5);
  const [isSaved, setIsSaved] = useState<boolean>(!!savedResult);

  const handleSave = () => {
    sound.playSuccess();
    setIsSaved(true);

    let pref = 'Equilibrio multisensorial estándar.';
    if (auditory > 3.8 && visual > 3.8) {
      pref = 'Alta reactividad sensorial ante estímulos auditivos y lumínicos; beneficio significativo con espacios de bajo estímulo.';
    } else if (proprioceptive > 3.8) {
      pref = 'Búsqueda activa de retroalimentación propioceptiva y movimiento para mantener el estado de alerta óptimo.';
    } else if (auditory > 3.8) {
      pref = 'Sensibilidad auditiva selectiva; rendimiento óptimo con sonido marrón o cancelación de ruido.';
    }

    const result: SensoryProfileResult = {
      visual,
      auditory,
      tactile,
      proprioceptive,
      comfortPreference: pref,
    };

    onComplete(result);
  };

  const dimensions = [
    {
      id: 'visual',
      title: 'Procesamiento Visual',
      icon: Eye,
      val: visual,
      setVal: setVisual,
      leftLabel: 'Prefiero luz suave / modo oscuro',
      rightLabel: 'Tolerancia a luces brillantes y pantallas múltiples',
      color: 'text-cyan-400',
    },
    {
      id: 'auditory',
      title: 'Procesamiento Auditivo',
      icon: Volume2,
      val: auditory,
      setVal: setAuditory,
      leftLabel: 'Necesidad de silencio absoluto / cancelación',
      rightLabel: 'Comodidad con música de fondo o bullicio',
      color: 'text-purple-400',
    },
    {
      id: 'tactile',
      title: 'Procesamiento Táctil',
      icon: Hand,
      val: tactile,
      setVal: setTactile,
      leftLabel: 'Sensibilidad a texturas y etiquetas de ropa',
      rightLabel: 'Indiferencia o búsqueda de texturas estimulantes',
      color: 'text-amber-400',
    },
    {
      id: 'proprioceptive',
      title: 'Propiocepción & Movimiento',
      icon: Move,
      val: proprioceptive,
      setVal: setProprioceptive,
      leftLabel: 'Comodidad en postura estática prolongada',
      rightLabel: 'Necesidad de pausas activas y movimiento (fidgeting)',
      color: 'text-emerald-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800">
            Prueba 4 de 5 • Cuestionario de Perfil Sensorial (Dunn, 1999)
          </span>
          <span className="text-xs text-slate-500">Autorreporte Cuantitativo</span>
        </div>
        <h2 className="text-xl font-bold text-white mt-1">Preferencias y Confort del Entorno Sensorial</h2>
        <p className="text-xs text-slate-400">
          Ajusta los controles deslizantes según tu experiencia cotidiana ante diferentes estímulos ambientales.
        </p>
      </div>

      {/* Main Sliders */}
      <div className="space-y-5 p-6 rounded-2xl bg-gradient-to-b from-slate-950 to-[#070b18] border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dimensions.map((dim) => {
            const Icon = dim.icon;
            return (
              <div
                key={dim.id}
                className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${dim.color}`} />
                    <span className="text-sm font-semibold text-white">{dim.title}</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                    {dim.val.toFixed(1)} / 5.0
                  </span>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={dim.val}
                  onChange={(e) => {
                    dim.setVal(parseFloat(e.target.value));
                    setIsSaved(false);
                  }}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />

                <div className="flex justify-between text-[10px] text-slate-400 gap-2">
                  <span className="max-w-[45%] text-left">{dim.leftLabel}</span>
                  <span className="max-w-[45%] text-right">{dim.rightLabel}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Save & Confirm Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {isSaved ? (
              <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Perfil sensorial registrado correctamente.
              </span>
            ) : (
              <span>Modifica los valores y presiona guardar para registrar tu mapa sensorial.</span>
            )}
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-purple-500/20 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Guardar Perfil Sensorial</span>
          </button>
        </div>
      </div>
    </div>
  );
};
