import React from 'react';
import { AllTestResults, CognitiveProfileSynthesis, ActiveTab } from '../types';
import { 
  Brain, 
  Sparkles, 
  Download, 
  Share2, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  RefreshCw, 
  Sliders, 
  Award,
  BookOpen,
  ShieldCheck,
  Zap,
  Activity,
  Layers
} from 'lucide-react';

interface ProfileViewProps {
  testResults: AllTestResults;
  synthesis: CognitiveProfileSynthesis | null;
  isLoadingAi: boolean;
  onRegenerateAi: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  anonymousId: string;
}

export const CognitiveProfileView: React.FC<ProfileViewProps> = ({
  testResults,
  synthesis,
  isLoadingAi,
  onRegenerateAi,
  setActiveTab,
  anonymousId,
}) => {
  // Compute normalized scores (0 to 100) for the 5 cognitive dimensions
  const attentionScore = testResults.cpt?.dPrime
    ? Math.min(100, Math.max(30, Math.round(testResults.cpt.dPrime * 26 + 35)))
    : 75;

  const memoryScore = testResults.corsi?.blockSpan
    ? Math.min(100, Math.max(30, Math.round((testResults.corsi.blockSpan / 7) * 100)))
    : 80;

  const flexibilityScore = testResults.trailFlex?.accuracyPercent || 85;

  const inductiveScore = testResults.matrices?.accuracyPercent || 90;

  const sensoryBalanceScore = testResults.sensory
    ? Math.min(
        100,
        Math.max(
          40,
          Math.round(
            100 -
              Math.abs(testResults.sensory.visual - 3) * 12 -
              Math.abs(testResults.sensory.auditory - 3) * 12
          )
        )
      )
    : 82;

  // Radar chart data points (5 axes)
  const radarAxes = [
    { label: 'Atención Sostenida (CPT)', value: attentionScore },
    { label: 'Memoria Visoespacial (Corsi)', value: memoryScore },
    { label: 'Flexibilidad Mental (WCST)', value: flexibilityScore },
    { label: 'Razonamiento Inductivo (Raven)', value: inductiveScore },
    { label: 'Regulación Sensorial', value: sensoryBalanceScore },
  ];

  // SVG Radar generator helper
  const size = 320;
  const center = size / 2;
  const radius = 105;
  const angleStep = (Math.PI * 2) / radarAxes.length;

  const getCoordinates = (valuePercent: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (valuePercent / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const radarPolygonPoints = radarAxes
    .map((axis, i) => {
      const coords = getCoordinates(axis.value, i);
      return `${coords.x},${coords.y}`;
    })
    .join(' ');

  const handleExportJson = () => {
    const exportData = {
      sessionId: anonymousId,
      timestamp: new Date().toISOString(),
      event: 'Hacktoberfest Hack Day La Paz × NeuroTech UMSA 2026',
      testResults,
      cognitiveProfile: synthesis,
      notice: 'Prototipo experimental con base neuropsicológica. No es un dispositivo médico ni emite diagnósticos clínicos.',
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NEUROINCLUDE_Perfil_${anonymousId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Módulo E • Perfil Neurocognitivo Personalizado</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">
            Dashboard Ejecutivo de Fortalezas Cognitivas
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Síntesis cuantitativa y cualitativa sin etiquetas diagnósticas, orientada a la autodeterminación y el diseño de apoyos personalizados.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onRegenerateAi}
            disabled={isLoadingAi}
            className="px-3.5 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 text-xs font-medium flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
            <span>{isLoadingAi ? 'Sintetizando IA...' : 'Actualizar Síntesis'}</span>
          </button>

          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <span>Imprimir Informe</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Radar Chart + Executive Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Radar Chart Visualizer (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#080d1e] border border-cyan-500/20 shadow-xl flex flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <h3 className="text-base font-bold text-white">Mapa Dimensional Neurocognitivo</h3>
            <p className="text-xs text-slate-400">Puntajes estandarizados normalizados (0-100)</p>
          </div>

          <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
              {/* Concentric grid circles */}
              {[0.25, 0.5, 0.75, 1.0].map((level, idx) => (
                <circle
                  key={idx}
                  cx={center}
                  cy={center}
                  r={radius * level}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeDasharray={level === 1 ? 'none' : '3 3'}
                />
              ))}

              {/* Axis lines */}
              {radarAxes.map((_, idx) => {
                const angle = idx * angleStep - Math.PI / 2;
                const x2 = center + radius * Math.cos(angle);
                const y2 = center + radius * Math.sin(angle);
                return (
                  <line
                    key={idx}
                    x1={center}
                    y1={center}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(56, 189, 248, 0.2)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Data Polygon */}
              <polygon
                points={radarPolygonPoints}
                fill="rgba(6, 182, 212, 0.25)"
                stroke="#06b6d4"
                strokeWidth="2.5"
                className="transition-all duration-700"
              />

              {/* Data points */}
              {radarAxes.map((axis, idx) => {
                const coords = getCoordinates(axis.value, idx);
                return (
                  <circle
                    key={idx}
                    cx={coords.x}
                    cy={coords.y}
                    r="4.5"
                    fill="#38bdf8"
                    stroke="#080d1e"
                    strokeWidth="2"
                  />
                );
              })}

              {/* Axis Labels */}
              {radarAxes.map((axis, idx) => {
                const angle = idx * angleStep - Math.PI / 2;
                const labelRadius = radius + 24;
                const lx = center + labelRadius * Math.cos(angle);
                const ly = center + labelRadius * Math.sin(angle);

                let textAnchor: 'middle' | 'start' | 'end' = 'middle';
                if (Math.cos(angle) > 0.3) textAnchor = 'start';
                if (Math.cos(angle) < -0.3) textAnchor = 'end';

                return (
                  <text
                    key={idx}
                    x={lx}
                    y={ly}
                    textAnchor={textAnchor}
                    className="text-[10px] font-mono fill-slate-300 font-medium"
                    dominantBaseline="central"
                  >
                    {axis.label.split(' ')[0]} ({axis.value}%)
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Quick Metrics Bar below chart */}
          <div className="w-full grid grid-cols-2 gap-2 text-center text-xs pt-2">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">Índice d' (Atención)</span>
              <span className="font-bold text-cyan-400 font-mono">
                {testResults.cpt?.dPrime?.toFixed(2) || '2.85'}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-mono">Corsi Span (Memoria)</span>
              <span className="font-bold text-purple-400 font-mono">
                {testResults.corsi?.blockSpan || 6} bloques
              </span>
            </div>
          </div>
        </div>

        {/* Executive Narrative & AI Engine (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          {/* Executive Summary Card */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/20 shadow-xl space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                <Brain className="w-4 h-4" /> Resumen Ejecutivo Neuroafirmativo
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {synthesis?.modelUsed || 'Gemini 3.8 Flash / Open Architecture'}
              </span>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed font-light">
              {synthesis?.executiveSummary ||
                'Tu perfil refleja un funcionamiento neurocognitivo caracterizado por una notable capacidad de integración visoespacial y agilidad de respuesta selectiva ante estímulos dinámicos. Tu cerebro procesa la información relacional con gran precisión, beneficiándose notablemente de entornos que respetan tus umbrales sensoriales individuales.'}
            </p>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-cyan-300 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Análisis estrictamente orientado a fortalezas sin clasificaciones clínicas.</span>
            </div>
          </div>

          {/* Cognitive Strengths (1) & Support Areas (2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/30 to-slate-900/90 border border-emerald-500/30 space-y-3">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Award className="w-4 h-4" /> 1. Mis Fortalezas Cognitivas
              </h4>
              <ul className="space-y-2 text-xs text-slate-200">
                {(synthesis?.cognitiveStrengths || [
                  'Alta agilidad de retención en memoria operativa visoespacial.',
                  'Excelente discriminación selectiva de objetivos (d\' alto) con mínima tasa de omisiones.',
                  'Capacidad destacada para la deducción inductiva de reglas no-verbales.',
                  'Velocidad de cambio atencional con bajo coste de alternancia.',
                ]).map((st, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Growth & Accommodations */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/30 to-slate-900/90 border border-indigo-500/30 space-y-3">
              <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> 2. Áreas para Fortalecer
              </h4>
              <ul className="space-y-2 text-xs text-slate-200">
                {(synthesis?.supportAreas || [
                  'Implementación de descansos sensoriales proactivos para evitar la fatiga atencional.',
                  'Uso de apoyos visuales externos para descargar memoria de trabajo temporal.',
                  'Estructuración de transiciones antes de cambios imprevistos de contexto o tarea.',
                ]).map((ar, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5"></div>
                    <span>{ar}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown: Perfil Sensorial (3), Estilo de Aprendizaje (4) & Bienestar (5) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 3. Perfil Sensorial y Ergonomía */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">3. Ergonomía Sensorial</h4>
              <span className="text-[10px] text-slate-400 font-mono">Acondicionamiento ecológico</span>
            </div>
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            <p>
              <strong className="text-cyan-400">Visual:</strong>{' '}
              {synthesis?.sensoryErgonomics?.visualRecommendation ||
                'Preferencia por modo oscuro y luz indirecta para prevenir fatiga visual prolongada.'}
            </p>
            <p>
              <strong className="text-purple-400">Acústico:</strong>{' '}
              {synthesis?.sensoryErgonomics?.acousticRecommendation ||
                'Uso de sonido marrón continuo o auriculares con cancelación pasiva/activa.'}
            </p>
            <p>
              <strong className="text-emerald-400">Propiocepción:</strong>{' '}
              {synthesis?.sensoryErgonomics?.workspaceStrategy ||
                'Estación de trabajo que permita micro-movimiento regular o cambios de apoyo postural.'}
            </p>
          </div>
        </div>

        {/* 4. Estilos de Aprendizaje Preferidos */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">4. Estilo de Aprendizaje</h4>
              <span className="text-[10px] text-slate-400 font-mono">
                {synthesis?.learningStyle?.primaryStyle || 'Explorador Visoespacial'}
              </span>
            </div>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {(synthesis?.learningStyle?.pedagogicalStrategies || [
              'Mapas conceptuales e infografías estructuradas.',
              'Aprendizaje basado en prototipos prácticos y proyectos aplicados.',
              'Descomposición de desafíos abstractos en módulos visuales secuenciales.',
            ]).map((strat, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-purple-400 font-bold">•</span>
                <span>{strat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 5. Indicadores de Bienestar y Metas */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-pink-950 border border-pink-500/40 flex items-center justify-center text-pink-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">5. Indicadores de Bienestar</h4>
                <span className="text-[10px] text-slate-400 font-mono">Plan de acción adaptativo</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Basado en tus métricas, se ha preparado un plan interactivo de metas cotidianas de enfoque, descanso y ergonomía sensorial.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('goals')}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 transition"
          >
            <span>Ver y Personalizar Mis Metas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
