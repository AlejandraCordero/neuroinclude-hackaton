import React from 'react';
import { ShieldCheck, Heart, Sparkles, ExternalLink, Activity } from 'lucide-react';

interface FooterProps {
  openDeliverables: () => void;
}

export const Footer: React.FC<FooterProps> = ({ openDeliverables }) => {
  return (
    <footer className="mt-20 border-t border-slate-800 bg-[#040711] text-slate-400 text-xs py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Ethical Notice Box */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-amber-200/90 font-medium">Marco de Responsabilidad Ética y Científica</p>
              <p className="text-[11px] text-slate-400">
                NEUROINCLUDE es un prototipo experimental de exploración cognitiva orientada a fortalezas. No constituye diagnóstico médico, psiquiátrico ni psicológico formal.
              </p>
            </div>
          </div>
          <button
            onClick={openDeliverables}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium underline flex items-center gap-1 shrink-0"
          >
            Ver Matriz de Honestidad Técnica <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Links & Information */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 text-slate-400">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-white text-sm tracking-wider">NEUROINCLUDE</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.5 rounded">2026</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Plataforma desarrollada para el hackathon <strong className="text-slate-300">Hacktoberfest Hack Day La Paz × NeuroTech UMSA 2026</strong>. Promoviendo la inclusión neurodivergente y el empoderamiento cognitivo en Bolivia.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-2">Fundamento Científico</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>• CPT / Go/No-Go (Teoría de Detección de Señales)</li>
              <li>• Corsi Block-Tapping Test (Memoria Visoespacial)</li>
              <li>• Wisconsin / Trail Making Test (Flexibilidad)</li>
              <li>• Sensory Profile (Dunn, 1999)</li>
              <li>• Matrices Progresivas de Raven (Razonamiento)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-2">Gobernanza y Privacidad</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>• Política Zero-Trace (Cero persistencia de datos)</li>
              <li>• Identificador de sesión anónimo efímero UUIDv4</li>
              <li>• Procesamiento seguro en memoria volátil</li>
              <li>• Accesibilidad según pautas WCAG 2.1 AA</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-2">Equipo Multidisciplinario</h4>
            <p className="text-[11px] leading-relaxed">
              Neurociencia cognitiva, bioingeniería de señales EEG, modelos de pesos abiertos (Gemma / Gemini), desarrollo full-stack y pedagogía inclusiva.
            </p>
            <div className="mt-2 text-[10px] text-cyan-400 font-mono">
              La Paz, Bolivia • Octubre 2026
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© 2026 NEUROINCLUDE. Licencia Abierta para fines de investigación educativa y social en Bolivia.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Hecho con rigor científico y visión inclusiva para Bolivia</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
