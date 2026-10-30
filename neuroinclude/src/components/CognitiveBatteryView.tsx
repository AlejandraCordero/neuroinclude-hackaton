import React, { useState } from 'react';
import { AllTestResults, BatteryTestType, ActiveTab } from '../types';
import { CPTTest } from './battery/CPTTest';
import { CorsiTest } from './battery/CorsiTest';
import { TrailFlexTest } from './battery/TrailFlexTest';
import { SensoryProfileTest } from './battery/SensoryProfileTest';
import { MatricesTest } from './battery/MatricesTest';
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Sparkles, 
  Activity, 
  Clock, 
  Brain, 
  Layers,
  ChevronRight
} from 'lucide-react';

interface BatteryViewProps {
  testResults: AllTestResults;
  setTestResults: React.Dispatch<React.SetStateAction<AllTestResults>>;
  setActiveTab: (tab: ActiveTab) => void;
  onSynthesizeProfile: () => void;
}

export const CognitiveBatteryView: React.FC<BatteryViewProps> = ({
  testResults,
  setTestResults,
  setActiveTab,
  onSynthesizeProfile,
}) => {
  const [activeTest, setActiveTest] = useState<BatteryTestType>('cpt');

  const testList: {
    id: BatteryTestType;
    number: string;
    title: string;
    domain: string;
    completed: boolean;
    duration: string;
  }[] = [
    {
      id: 'cpt',
      number: '01',
      title: 'Atención Sostenida & Control',
      domain: 'Go/No-Go • Latencia & d\'',
      completed: !!testResults.cpt,
      duration: '1-2 min',
    },
    {
      id: 'corsi',
      number: '02',
      title: 'Memoria de Trabajo Visoespacial',
      domain: 'Corsi Blocks • Span retentivo',
      completed: !!testResults.corsi,
      duration: '1-2 min',
    },
    {
      id: 'trail',
      number: '03',
      title: 'Flexibilidad & Alternancia',
      domain: 'Wisconsin Sort • Shifting atencional',
      completed: !!testResults.trailFlex,
      duration: '2 min',
    },
    {
      id: 'sensory',
      number: '04',
      title: 'Procesamiento Sensorial',
      domain: 'Perfil Dunn • Confort ambiental',
      completed: !!testResults.sensory,
      duration: '1 min',
    },
    {
      id: 'matrices',
      number: '05',
      title: 'Razonamiento Abstracto',
      domain: 'Matrices Raven • Deducción visual',
      completed: !!testResults.matrices,
      duration: '2 min',
    },
  ];

  const completedCount = testList.filter((t) => t.completed).length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      {/* Title & Progress Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            <Brain className="w-3.5 h-3.5" />
            <span>Módulo C • Batería Neurocognitiva Avanzada</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">
            5 Pruebas Neuropsicológicas Estandarizadas
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Protocolo experimental de alta precisión cronométrica (<code className="text-cyan-300 font-mono">performance.now()</code>) sin diagnósticos clínicos, diseñado para desvelar tus fortalezas operativas.
          </p>
        </div>

        {/* Progress Card */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 shrink-0 flex items-center gap-4">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Progreso de la Batería</div>
            <div className="text-lg font-bold font-mono text-cyan-300">
              {completedCount} <span className="text-slate-500 text-sm">/ 5 Completadas</span>
            </div>
          </div>

          <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${(completedCount / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Test Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {testList.map((item) => {
          const isSelected = activeTest === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTest(item.id)}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between relative group ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-500 group-hover:text-cyan-400">
                  {item.number}
                </span>
                {item.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>

              <div className="text-xs font-bold text-white line-clamp-1">{item.title}</div>
              <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{item.domain}</div>
            </button>
          );
        })}
      </div>

      {/* Active Test Stage Container */}
      <div className="p-6 rounded-3xl bg-[#080d1e] border border-cyan-500/20 shadow-2xl relative">
        {activeTest === 'cpt' && (
          <CPTTest
            savedResult={testResults.cpt}
            onComplete={(res) => {
              setTestResults((prev) => ({ ...prev, cpt: res }));
            }}
          />
        )}

        {activeTest === 'corsi' && (
          <CorsiTest
            savedResult={testResults.corsi}
            onComplete={(res) => {
              setTestResults((prev) => ({ ...prev, corsi: res }));
            }}
          />
        )}

        {activeTest === 'trail' && (
          <TrailFlexTest
            savedResult={testResults.trailFlex}
            onComplete={(res) => {
              setTestResults((prev) => ({ ...prev, trailFlex: res }));
            }}
          />
        )}

        {activeTest === 'sensory' && (
          <SensoryProfileTest
            savedResult={testResults.sensory}
            onComplete={(res) => {
              setTestResults((prev) => ({ ...prev, sensory: res }));
            }}
          />
        )}

        {activeTest === 'matrices' && (
          <MatricesTest
            savedResult={testResults.matrices}
            onComplete={(res) => {
              setTestResults((prev) => ({ ...prev, matrices: res }));
            }}
          />
        )}
      </div>

      {/* Completion & Next Steps Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0d162d] to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs text-cyan-400 font-mono uppercase tracking-wider">
            {completedCount >= 3 ? 'Listo para sintetizar' : 'Batería en progreso'}
          </div>
          <p className="text-sm text-slate-300">
            {completedCount === 5
              ? 'Has completado las 5 evaluaciones. Puedes explorar el Laboratorio EEG o generar tu Perfil Neurocognitivo.'
              : `Has registrado ${completedCount} de 5 pruebas. Recomendamos completar al menos 3 para una síntesis óptima.`}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('eeg')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition flex items-center gap-1.5"
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Laboratorio EEG</span>
          </button>

          <button
            onClick={() => {
              onSynthesizeProfile();
              setActiveTab('profile');
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/25 flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ver Mi Perfil & Dashboard</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
