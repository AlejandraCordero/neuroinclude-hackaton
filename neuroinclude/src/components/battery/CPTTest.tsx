import React, { useState, useEffect, useRef } from 'react';
import { CPTResult } from '../../types';
import { calculateDPrime } from '../../utils/neuroCalc';
import { sound } from '../../utils/audio';
import { Play, RotateCcw, CheckCircle2, AlertCircle, Zap, ShieldAlert } from 'lucide-react';

interface CPTTestProps {
  onComplete: (result: CPTResult) => void;
  savedResult?: CPTResult;
}

type StimulusType = 'target' | 'distractor';

interface TrialItem {
  id: number;
  type: StimulusType;
  symbol: string;
  color: string;
}

export const CPTTest: React.FC<CPTTestProps> = ({ onComplete, savedResult }) => {
  const [status, setStatus] = useState<'idle' | 'running' | 'completed'>(savedResult ? 'completed' : 'idle');
  const [currentStimulus, setCurrentStimulus] = useState<TrialItem | null>(null);
  const [trialIndex, setTrialIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Metrics
  const [hits, setHits] = useState(savedResult?.hits || 0);
  const [misses, setMisses] = useState(savedResult?.misses || 0);
  const [falseAlarms, setFalseAlarms] = useState(savedResult?.falseAlarms || 0);
  const [latencies, setLatencies] = useState<number[]>(savedResult?.latencies || []);

  const stimulusStartTimeRef = useRef<number>(0);
  const respondedRef = useRef<boolean>(false);
  const timeoutIdRef = useRef<any>(null);

  const TOTAL_TRIALS = 16;
  const TARGET_SYMBOL = '★'; // Green star is target
  const DISTRACTOR_SYMBOLS = ['▲', '■', '●', '◆'];

  // Generate randomized trial sequence (65% targets, 35% distractors)
  const generateTrials = (): TrialItem[] => {
    const list: TrialItem[] = [];
    for (let i = 0; i < TOTAL_TRIALS; i++) {
      const isTarget = Math.random() < 0.65;
      if (isTarget) {
        list.push({
          id: i,
          type: 'target',
          symbol: TARGET_SYMBOL,
          color: 'text-emerald-400 border-emerald-500 shadow-emerald-500/50',
        });
      } else {
        const symbol = DISTRACTOR_SYMBOLS[Math.floor(Math.random() * DISTRACTOR_SYMBOLS.length)];
        list.push({
          id: i,
          type: 'distractor',
          symbol,
          color: 'text-rose-400 border-rose-500 shadow-rose-500/50',
        });
      }
    }
    return list;
  };

  const trialsRef = useRef<TrialItem[]>([]);

  const startTest = () => {
    trialsRef.current = generateTrials();
    setHits(0);
    setMisses(0);
    setFalseAlarms(0);
    setLatencies([]);
    setTrialIndex(0);
    setStatus('running');
    setFeedback(null);
    runNextTrial(0, [], 0, 0, 0);
  };

  const runNextTrial = (
    index: number,
    currentLatencies: number[],
    currentHits: number,
    currentMisses: number,
    currentFA: number
  ) => {
    if (index >= TOTAL_TRIALS) {
      finishTest(currentLatencies, currentHits, currentMisses, currentFA);
      return;
    }

    setTrialIndex(index);
    const stim = trialsRef.current[index];
    respondedRef.current = false;
    setCurrentStimulus(null);

    // Inter-stimulus interval (600ms - 900ms)
    const isi = Math.floor(Math.random() * 300) + 600;
    timeoutIdRef.current = setTimeout(() => {
      setCurrentStimulus(stim);
      stimulusStartTimeRef.current = performance.now();

      // Stimulus presentation duration (850ms)
      timeoutIdRef.current = setTimeout(() => {
        // If target and no response, it's a miss
        if (!respondedRef.current && stim.type === 'target') {
          const newMisses = currentMisses + 1;
          setMisses(newMisses);
          sound.playSoftError();
          runNextTrial(index + 1, currentLatencies, currentHits, newMisses, currentFA);
        } else {
          runNextTrial(index + 1, currentLatencies, currentHits, currentMisses, currentFA);
        }
      }, 850);
    }, isi);
  };

  // User response handler (Space or Click)
  const handleUserReaction = () => {
    if (status !== 'running' || !currentStimulus || respondedRef.current) return;

    respondedRef.current = true;
    const reactionTime = Math.round(performance.now() - stimulusStartTimeRef.current);

    if (currentStimulus.type === 'target') {
      // Hit
      sound.playSuccess();
      const updatedHits = hits + 1;
      const updatedLatencies = [...latencies, reactionTime];
      setHits(updatedHits);
      setLatencies(updatedLatencies);
      setFeedback(`¡Acierto! ${reactionTime} ms`);
    } else {
      // False alarm
      sound.playSoftError();
      const updatedFA = falseAlarms + 1;
      setFalseAlarms(updatedFA);
      setFeedback(`Falsa Alarma (- Inadvertido)`);
    }
  };

  const finishTest = (finalLatencies: number[], finalHits: number, finalMisses: number, finalFA: number) => {
    setStatus('completed');
    setCurrentStimulus(null);

    const totalTargets = finalHits + finalMisses;
    const totalDistractors = TOTAL_TRIALS - totalTargets;
    const meanLatency = finalLatencies.length
      ? Math.round(finalLatencies.reduce((a, b) => a + b, 0) / finalLatencies.length)
      : 360;

    const dPrime = calculateDPrime(finalHits, totalTargets, finalFA, totalDistractors);

    const result: CPTResult = {
      totalTrials: TOTAL_TRIALS,
      hits: finalHits,
      misses: finalMisses,
      falseAlarms: finalFA,
      meanLatencyMs: meanLatency,
      dPrime,
      latencies: finalLatencies,
    };

    sound.playFanfare();
    onComplete(result);
  };

  // Keyboard Space listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleUserReaction();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
    };
  }, [status, currentStimulus, hits, misses, falseAlarms, latencies]);

  const meanRt = latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0;
  const currentDPrime = calculateDPrime(hits, hits + misses, falseAlarms, TOTAL_TRIALS - (hits + misses));

  return (
    <div className="space-y-6">
      {/* Test Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Prueba 1 de 5 • Conners CPT / Go-No-Go
            </span>
            <span className="text-xs text-slate-500">Cronometría: performance.now()</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Atención Sostenida y Control Inhibitorio</h2>
          <p className="text-xs text-slate-400">
            Reacciona presionando la barra <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono">Espacio</kbd> o el botón táctil <strong className="text-emerald-400">ÚNICAMENTE ante la Estrella Verde ({TARGET_SYMBOL})</strong>. Ignora cualquier otra figura.
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

      {/* Main Stimulus Stage */}
      <div className="relative min-h-[320px] rounded-2xl bg-gradient-to-b from-slate-950 to-[#070b18] border border-slate-800 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
        {status === 'idle' && (
          <div className="space-y-4 max-w-md">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-3xl shadow-lg shadow-emerald-500/20 animate-pulse">
              {TARGET_SYMBOL}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Objetivo de Reacción Rápida</h3>
              <p className="text-xs text-slate-400 mt-1">
                La prueba consta de {TOTAL_TRIALS} estímulos rápidos. Mantén tu dedo en la barra espaciadora o en la pantalla.
              </p>
            </div>
            <button
              onClick={startTest}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/30 flex items-center gap-2 mx-auto transition transform hover:scale-105"
            >
              <Play className="w-4 h-4" />
              <span>Iniciar Tarea Go/No-Go</span>
            </button>
          </div>
        )}

        {status === 'running' && (
          <div className="space-y-6 w-full flex flex-col items-center">
            {/* Progress Bar */}
            <div className="w-full max-w-xs bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-cyan-400 h-full transition-all duration-200"
                style={{ width: `${((trialIndex + 1) / TOTAL_TRIALS) * 100}%` }}
              ></div>
            </div>

            {/* Stimulus Display */}
            <div className="h-44 flex items-center justify-center">
              {currentStimulus ? (
                <div
                  className={`w-32 h-32 rounded-3xl border-2 flex items-center justify-center text-6xl shadow-2xl transition transform scale-100 ${currentStimulus.color}`}
                >
                  {currentStimulus.symbol}
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-slate-700/60 animate-ping"></div>
              )}
            </div>

            {/* Live Feedback & Instructions */}
            <div className="min-h-[24px] text-xs font-mono font-medium text-cyan-300">
              {feedback || `Ensayo ${trialIndex + 1} de ${TOTAL_TRIALS}`}
            </div>

            {/* Tap Button for Touch Screens or Quick Clicking */}
            <button
              onClick={handleUserReaction}
              className="w-full max-w-sm py-4 rounded-2xl bg-cyan-950 hover:bg-cyan-900 border-2 border-cyan-500/50 text-cyan-200 font-bold text-base shadow-xl shadow-cyan-950/80 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5 text-cyan-400" />
              <span>PULSAR AHORA (Espacio / Tap)</span>
            </button>
          </div>
        )}

        {status === 'completed' && (
          <div className="space-y-5 max-w-lg w-full">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">¡Prueba de Atención Completada!</h3>
              <p className="text-xs text-slate-400">
                Se han calculado tus latencias milimétricas y tu sensibilidad discriminativa d'.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-base font-bold font-mono text-emerald-400">{hits}</div>
                <div className="text-[10px] text-slate-400 uppercase">Aciertos</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-base font-bold font-mono text-cyan-400">{meanRt} ms</div>
                <div className="text-[10px] text-slate-400 uppercase">Latencia Media</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-base font-bold font-mono text-rose-400">{falseAlarms}</div>
                <div className="text-[10px] text-slate-400 uppercase">Falsas Alarmas</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-base font-bold font-mono text-purple-400">{currentDPrime}</div>
                <div className="text-[10px] text-slate-400 uppercase">Sensibilidad d'</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
