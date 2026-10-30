import React, { useState, useRef } from 'react';
import { TrailFlexResult } from '../../types';
import { sound } from '../../utils/audio';
import { Play, RotateCcw, CheckCircle2, Shuffle, Layers } from 'lucide-react';

interface TrailFlexProps {
  onComplete: (result: TrailFlexResult) => void;
  savedResult?: TrailFlexResult;
}

type RuleType = 'color' | 'shape' | 'number';

interface CardItem {
  id: number;
  color: 'cyan' | 'rose' | 'amber' | 'emerald';
  shape: 'circle' | 'square' | 'triangle' | 'star';
  number: number; // 1, 2, 3, 4
}

// 4 reference bins
const REFERENCE_BINS: CardItem[] = [
  { id: 1, color: 'rose', shape: 'triangle', number: 1 },
  { id: 2, color: 'emerald', shape: 'star', number: 2 },
  { id: 3, color: 'cyan', shape: 'circle', number: 3 },
  { id: 4, color: 'amber', shape: 'square', number: 4 },
];

export const TrailFlexTest: React.FC<TrailFlexProps> = ({ onComplete, savedResult }) => {
  const [status, setStatus] = useState<'idle' | 'running' | 'completed'>(savedResult ? 'completed' : 'idle');
  const [currentCard, setCurrentCard] = useState<CardItem | null>(null);
  const [trialIndex, setTrialIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isFeedbackPositive, setIsFeedbackPositive] = useState<boolean>(true);

  // Metrics
  const [switchesCompleted, setSwitchesCompleted] = useState(savedResult?.switchesCompleted || 0);
  const [perseverationErrors, setPerseverationErrors] = useState(savedResult?.perseverationErrors || 0);
  const [correctCount, setCorrectCount] = useState(0);
  const [latencies, setLatencies] = useState<number[]>([]);

  const activeRuleRef = useRef<RuleType>('color');
  const previousRuleRef = useRef<RuleType | null>(null);
  const consecutiveCorrectRef = useRef<number>(0);
  const trialStartTimeRef = useRef<number>(0);

  const TOTAL_TRIALS = 12;

  const shapeSymbols: Record<string, string> = {
    circle: '●',
    square: '■',
    triangle: '▲',
    star: '★',
  };

  const colorClasses: Record<string, string> = {
    cyan: 'text-cyan-400 border-cyan-500/50 bg-cyan-950/20',
    rose: 'text-rose-400 border-rose-500/50 bg-rose-950/20',
    amber: 'text-amber-400 border-amber-500/50 bg-amber-950/20',
    emerald: 'text-emerald-400 border-emerald-500/50 bg-emerald-950/20',
  };

  const getRandomCard = (): CardItem => {
    const colors: ('cyan' | 'rose' | 'amber' | 'emerald')[] = ['cyan', 'rose', 'amber', 'emerald'];
    const shapes: ('circle' | 'square' | 'triangle' | 'star')[] = ['circle', 'square', 'triangle', 'star'];
    const numbers = [1, 2, 3, 4];

    return {
      id: Math.random(),
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      number: numbers[Math.floor(Math.random() * numbers.length)],
    };
  };

  const startTest = () => {
    setStatus('running');
    setTrialIndex(0);
    setCorrectCount(0);
    setSwitchesCompleted(0);
    setPerseverationErrors(0);
    setLatencies([]);
    consecutiveCorrectRef.current = 0;
    activeRuleRef.current = 'color';
    previousRuleRef.current = null;
    nextCard(0);
  };

  const nextCard = (index: number) => {
    if (index >= TOTAL_TRIALS) {
      finishTest();
      return;
    }

    setTrialIndex(index);
    setCurrentCard(getRandomCard());
    trialStartTimeRef.current = performance.now();
  };

  const handleSelectBin = (bin: CardItem) => {
    if (status !== 'running' || !currentCard) return;

    const latency = Math.round(performance.now() - trialStartTimeRef.current);
    const updatedLatencies = [...latencies, latency];
    setLatencies(updatedLatencies);

    const rule = activeRuleRef.current;
    let isMatch = false;

    if (rule === 'color' && currentCard.color === bin.color) isMatch = true;
    if (rule === 'shape' && currentCard.shape === bin.shape) isMatch = true;
    if (rule === 'number' && currentCard.number === bin.number) isMatch = true;

    if (isMatch) {
      sound.playSuccess();
      setIsFeedbackPositive(true);
      setFeedback('¡Correcto! Coincide con la regla activa.');
      const newCorrect = correctCount + 1;
      setCorrectCount(newCorrect);
      consecutiveCorrectRef.current += 1;

      // After 4 consecutive correct matches, change the rule!
      if (consecutiveCorrectRef.current >= 4) {
        previousRuleRef.current = activeRuleRef.current;
        const possibleRules: RuleType[] = ['color', 'shape', 'number'].filter(
          (r) => r !== activeRuleRef.current
        ) as RuleType[];
        activeRuleRef.current = possibleRules[Math.floor(Math.random() * possibleRules.length)];
        consecutiveCorrectRef.current = 0;
        setSwitchesCompleted((prev) => prev + 1);
      }
    } else {
      sound.playSoftError();
      setIsFeedbackPositive(false);
      setFeedback('Incorrecto. La regla actual ha variado o no coincide.');
      consecutiveCorrectRef.current = 0;

      // Check if perseverative error (matches previous rule)
      if (previousRuleRef.current) {
        let matchedPrev = false;
        if (previousRuleRef.current === 'color' && currentCard.color === bin.color) matchedPrev = true;
        if (previousRuleRef.current === 'shape' && currentCard.shape === bin.shape) matchedPrev = true;
        if (previousRuleRef.current === 'number' && currentCard.number === bin.number) matchedPrev = true;

        if (matchedPrev) {
          setPerseverationErrors((prev) => prev + 1);
        }
      }
    }

    setTimeout(() => {
      setFeedback(null);
      nextCard(trialIndex + 1);
    }, 700);
  };

  const finishTest = () => {
    setStatus('completed');
    sound.playFanfare();

    const avgLatency = latencies.length
      ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
      : 550;

    const accuracyPercent = Math.round((correctCount / TOTAL_TRIALS) * 100);

    const result: TrailFlexResult = {
      switchesCompleted: Math.max(1, switchesCompleted),
      perseverationErrors,
      accuracyPercent,
      avgSwitchLatencyMs: avgLatency,
      trialsCompleted: TOTAL_TRIALS,
    };

    onComplete(result);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">
              Prueba 3 de 5 • Wisconsin Card Sorting & Trail Making
            </span>
            <span className="text-xs text-slate-500">Flexibilidad Cognitiva y Alternancia</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Clasificación Adaptativa con Cambio de Regla</h2>
          <p className="text-xs text-slate-400">
            Descubre la regla de ordenamiento (Color, Forma o Cantidad) mediante la retroalimentación inmediata.
          </p>
        </div>

        {status === 'completed' && (
          <button
            onClick={startTest}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Repetir Prueba</span>
          </button>
        )}
      </div>

      {/* Main Stage */}
      <div className="relative min-h-[380px] rounded-2xl bg-gradient-to-b from-slate-950 to-[#070b18] border border-slate-800 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
        {status === 'idle' && (
          <div className="space-y-4 max-w-md">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-950/60 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/20">
              <Shuffle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Flexibilidad y Shifting Atencional</h3>
              <p className="text-xs text-slate-400 mt-1">
                La regla de clasificación cambiará dinámicamente sin previo aviso. Tu objetivo es detectar el nuevo criterio lo más rápido posible.
              </p>
            </div>
            <button
              onClick={startTest}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 flex items-center gap-2 mx-auto transition transform hover:scale-105"
            >
              <Play className="w-4 h-4" />
              <span>Iniciar Tarea de Alternancia</span>
            </button>
          </div>
        )}

        {status === 'running' && currentCard && (
          <div className="space-y-6 w-full flex flex-col items-center max-w-2xl">
            {/* Progress */}
            <div className="flex items-center justify-between w-full text-xs text-slate-400 font-mono">
              <span>Ensayo {trialIndex + 1} de {TOTAL_TRIALS}</span>
              <span className="text-cyan-400">Aciertos: {correctCount}</span>
            </div>

            {/* Reference Bins (4 choices) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
              {REFERENCE_BINS.map((bin) => (
                <button
                  key={bin.id}
                  onClick={() => handleSelectBin(bin)}
                  className="p-3.5 rounded-xl border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800 hover:border-cyan-400/60 transition flex flex-col items-center gap-2 transform active:scale-95 group shadow-md"
                >
                  <div className="text-[11px] font-mono text-slate-500">Caja {bin.id}</div>
                  <div className={`text-2xl font-bold flex gap-1 ${colorClasses[bin.color]}`}>
                    {Array.from({ length: bin.number }).map((_, idx) => (
                      <span key={idx}>{shapeSymbols[bin.shape]}</span>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                    {bin.number} {bin.shape}
                  </span>
                </button>
              ))}
            </div>

            {/* Stimulus Card to sort */}
            <div className="pt-2 flex flex-col items-center gap-2">
              <span className="text-xs text-slate-400 uppercase font-mono tracking-wider">
                Tarjeta a Clasificar:
              </span>
              <div
                className={`w-36 h-28 rounded-2xl border-2 flex items-center justify-center text-4xl shadow-2xl p-4 gap-1.5 ${
                  colorClasses[currentCard.color]
                }`}
              >
                {Array.from({ length: currentCard.number }).map((_, idx) => (
                  <span key={idx}>{shapeSymbols[currentCard.shape]}</span>
                ))}
              </div>
            </div>

            {/* Feedback message */}
            <div
              className={`min-h-[22px] text-xs font-mono font-medium transition ${
                feedback
                  ? isFeedbackPositive
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                  : 'text-slate-500'
              }`}
            >
              {feedback || 'Selecciona la caja superior que corresponda a la regla actual.'}
            </div>
          </div>
        )}

        {status === 'completed' && (
          <div className="space-y-5 max-w-lg w-full">
            <div className="w-12 h-12 mx-auto rounded-full bg-indigo-950 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">¡Prueba de Alternancia Finalizada!</h3>
              <p className="text-xs text-slate-400">
                Se ha evaluado tu capacidad de adaptación flexible y control de perseveración.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xl font-bold font-mono text-cyan-400">
                  {Math.round((correctCount / TOTAL_TRIALS) * 100)}%
                </div>
                <div className="text-[10px] text-slate-400 uppercase">Precisión Global</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xl font-bold font-mono text-emerald-400">{switchesCompleted}</div>
                <div className="text-[10px] text-slate-400 uppercase">Cambios de Regla</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xl font-bold font-mono text-rose-400">{perseverationErrors}</div>
                <div className="text-[10px] text-slate-400 uppercase">Perseveraciones</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
