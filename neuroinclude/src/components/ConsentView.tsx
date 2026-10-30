import React, { useState } from 'react';
import { ActiveTab } from '../types';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  FileText
} from 'lucide-react';
import { sound } from '../utils/audio';

interface ConsentViewProps {
  anonymousId: string;
  regenerateId: () => void;
  consentAccepted: boolean;
  setConsentAccepted: (accepted: boolean) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const ConsentView: React.FC<ConsentViewProps> = ({
  anonymousId,
  regenerateId,
  consentAccepted,
  setConsentAccepted,
  setActiveTab,
}) => {
  const [isChecked, setIsChecked] = useState(consentAccepted);

  const handleToggle = () => {
    const nextVal = !isChecked;
    setIsChecked(nextVal);
    setConsentAccepted(nextVal);
    if (nextVal) {
      sound.playSuccess();
    }
  };

  const handleContinue = () => {
    if (isChecked) {
      setConsentAccepted(true);
      setActiveTab('battery');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Módulo B • Gobernanza y Privacidad</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">
          Consentimiento Informado & Política Zero-Trace
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          En NEUROINCLUDE tu privacidad no es una opción, es un principio de diseño fundamental de soberanía de datos personales.
        </p>
      </div>

      {/* Ephemeral ID Card */}
      <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase font-mono tracking-wider">Identificador Anónimo Efímero (UUIDv4)</div>
            <div className="text-xl font-mono font-bold text-cyan-300 flex items-center gap-2">
              <span>{anonymousId}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Sesión activa en memoria volátil"></span>
            </div>
            <p className="text-xs text-slate-400">
              Generado criptográficamente en tu navegador. No vinculado a tu nombre, correo ni IP.
            </p>
          </div>
        </div>

        <button
          onClick={regenerateId}
          className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Generar Nuevo UUID</span>
        </button>
      </div>

      {/* Zero-Trace Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
            <EyeOff className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Cero Persistencia de Datos</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ninguna latencia, tiempo de reacción o respuesta de cuestionario se guarda en bases de datos externas. Al cerrar la pestaña, toda la sesión desaparece de la RAM.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Procesamiento Local & Abierto</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Las cronometrías de milisegundos se computan vía <code className="text-cyan-300">performance.now()</code> en el cliente. La síntesis de perfil utiliza modelos abiertos orientados a fortalezas.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-700/50 flex items-center justify-center text-purple-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Cero Diagnósticos Médicos</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Esta plataforma no emite diagnósticos de autismo, TDAH, dislexia o afecciones clínicas. Solo brinda métricas descriptivas orientadas a la inclusión educativa.
          </p>
        </div>
      </div>

      {/* Informed Consent Declaration */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          Declaración de Consentimiento Voluntario
        </h3>

        <div className="text-xs text-slate-300 space-y-2.5 max-h-48 overflow-y-auto pr-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 font-mono leading-relaxed">
          <p>
            1. <strong>Finalidad del Estudio:</strong> Entiendo que participo en una experiencia de exploración neurocognitiva experimental en el marco del evento <em>Hacktoberfest Hack Day La Paz × NeuroTech UMSA 2026</em>.
          </p>
          <p>
            2. <strong>Naturaleza No Médica:</strong> Comprendo que los resultados numéricos obtenidos son estimaciones psicométricas y algorítmicas con valor pedagógico y de autoconocimiento, y bajo ninguna circunstancia sustituyen una evaluación neuropsicológica clínica formal.
          </p>
          <p>
            3. <strong>Voluntariedad y Retiro:</strong> Mi participación es completamente voluntaria y puedo interrumpir las pruebas en cualquier instante sin consecuencia alguna.
          </p>
          <p>
            4. <strong>Política Zero-Trace:</strong> Acepto que mis respuestas serán procesadas de manera anónima bajo el identificador efímero indicado arriba.
          </p>
        </div>

        {/* Checkbox */}
        <label className="flex items-start gap-3 p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 cursor-pointer hover:bg-cyan-950/40 transition">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleToggle}
            className="mt-0.5 w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 focus:ring-offset-slate-900 bg-slate-800 border-slate-600"
          />
          <div className="text-xs text-slate-200">
            <span className="font-semibold text-white">He leído y acepto los términos del consentimiento informado.</span>
            <p className="text-slate-400 mt-0.5">
              Confirmo que deseo explorar mi perfil neurocognitivo bajo el marco ético y la política Zero-Trace de NEUROINCLUDE.
            </p>
          </div>
        </label>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleContinue}
            disabled={!isChecked}
            className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition ${
              isChecked
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/25 cursor-pointer'
                : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
            }`}
          >
            <span>Comenzar Batería Neurocognitiva</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
