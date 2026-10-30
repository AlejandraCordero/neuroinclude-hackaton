import React, { useState, useEffect, useRef } from 'react';
import { CorsiResult } from '../../types';
import { sound } from '../../utils/audio';
import { Play, RotateCcw, CheckCircle2, Grid, Sparkles } from 'lucide-react';

interface CorsiTestProps {
  onComplete: (result: CorsiResult) => void;
  savedResult?: CorsiResult;
}

interface BlockItem {
  id: number;
  label: number;
  row: number;
  col: number;
}

export const CorsiTest: React.FC<CorsiTestProps> = ({ onComplete, savedResult }) => {
  const [status, setStatus] = useState<'idle' | 'demonstrating' | 'userTurn' | 'completed'>(
    savedResult ? 'completed' : 'idle'
  );
  const [currentSpan, setCurrentSpan] = useState<number>(3);
  const [activeHighlightBlock, setActiveHighlightBlock] = useState<number | null>(null);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [currentDemonstratedSequence, setCurrentDemonstratedSequence] = useState<number[]>([]);
  const [maxSpanAchieved, setMaxSpanAchieved] = useState<number>(savedResult?.blockSpan || 3);
  const [feedback, setFeedback] = useState<string>('Observa la secuencia atentamente.');

  const turnStartTimeRef = useRef<number>(0);
  const reactionTimesRef = useRef<number[]>([]);
  const failuresAtCurrentSpanRef = useRef<number>(0);

  // 9 blocks arranged across a 3x3 layout
  const blocks: BlockItem[] = [
    { id: 0, label: 1, row: 0, col: 0 },
    { id: 1, label: 2, row: 0, col: 1 },
    { id: 2, label: 3, row: 0, col: 2 },
    { id: 3, label: 4, row: 1, col: 0 },
    { id: 4, label: 5, row: 1, col: 1 },
    { id: 5, label: 6, row: 1, col: 2 },
    { id: 6, label: 7, row: 2, col: 0 },
    { id: 7, label: 8, row: 2, col: 1 },
    { id: 8, label: 9, row: 2, col: 2 },
  ];

  const generateSequence = (length: number): number[] => {
    const seq: number[] = [];
    while (seq.length < length) {
      const rand = Math.floor(Math.random() * 9);
      // Avoid immediate consecutive duplicate for clearer visual representation
      if (seq.length === 0 || seq[seq.length - 1] !== rand) {
        seq.push(rand);
      }
    }
    return seq;
  };

  const startTest = () => {
    setCurrentSpan(3);
    setMaxSpanAchieved(3);
    failuresAtCurrentSpanRef.current = 0;
    reactionTimesRef.current = [];
    startRound(3);
  };

  const startRound = (spanLength: number) => {
    const newSeq = generateSequence(spanLength);
    setCurrentDemonstratedSequence(newSeq);
    setUserSequence([]);
    setStatus('demonstrating');
    setFeedback(`Secuencia de nivel ${spanLength} en curso...`);

    // Animate blocks
    let step = 0;
    const interval = setInterval(() => {
      if (step < newSeq.length) {
        const blockId = newSeq[step];
        setActiveHighlightBlock(blockId);
        sound.playBlockTone(blockId);

        setTimeout(() => {
          setActiveHighlightBlock(null);
        }, 550);

        step++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setStatus('userTurn');
          setFeedback('¡Tu turno! Haz clic en los bloques en el mismo orden.');
          turnStartTimeRef.current = performance.now();
        }, 400);
      }
    }, 850);
  };

  const handleBlockClick = (blockId: number) => {
    if (status !== 'userTurn') return;

    sound.playBlockTone(blockId);
    const updatedUserSeq = [...userSequence, blockId];
    setUserSequence(updatedUserSeq);

    const currentIndex = updatedUserSeq.length - 1;
    // Check if this click matches the sequence
    if (blockId !== currentDemonstratedSequence[currentIndex]) {
      // Mistake
      sound.playSoftError();
      failuresAtCurrentSpanRef.current += 1;

      if (failuresAtCurrentSpanRef.current >= 2 || currentSpan >= 7) {
        // Test ends
        finishTest(maxSpanAchieved);
      } else {
        setFeedback('Secuencia incorrecta. Intentemos otro patrón del mismo nivel.');
        setTimeout(() => startRound(currentSpan), 1200);
      }
      return;
    }

    // If correctly finished the entire sequence
    if (updatedUserSeq.length === currentDemonstratedSequence.length) {
      const latency = Math.round(performance.now() - turnStartTimeRef.current);
      reactionTimesRef.current.push(latency);
      sound.playSuccess();

      const newMax = Math.max(maxSpanAchieved, currentSpan);
      setMaxSpanAchieved(newMax);
      failuresAtCurrentSpanRef.current = 0;

      if (currentSpan < 7) {
        const nextSpan = currentSpan + 1;
        setCurrentSpan(nextSpan);
        setFeedback(`¡Excelente! Subiendo a longitud ${nextSpan}...`);
        setTimeout(() => startRound(nextSpan), 1300);
      } else {
        // Max span reached!
        finishTest(7);
      }
    }
  };

  const finishTest = (finalSpan: number) => {
    setStatus('completed');
    sound.playFanfare();

    const avgRt = reactionTimesRef.current.length
      ? Math.round(reactionTimesRef.current.reduce((a, b) => a + b, 0) / reactionTimesRef.current.length)
      : 520;

    const accuracyPercent = Math.min(100, Math.round((finalSpan / 7) * 100));

    const result: CorsiResult = {
      blockSpan: finalSpan,
      maxSequence: finalSpan,
      accuracyPercent,
      reactionTimeMs: avgRt,
      trialsCompleted: finalSpan,
    };

    onComplete(result);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
              Prueba 2 de 5 • Corsi Block-Tapping Test
            </span>
            <span className="text-xs text-slate-500">Memoria de Trabajo Visoespacial</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Retención y Recuerdo de Secuencias Espaciales</h2>
          <p className="text-xs text-slate-400">
            Observa cómo se iluminan los bloques y repite exactamente la misma secuencia espacial.
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

      {/* Main Grid Area */}
      <div className="relative min-h-[360px] rounded-2xl bg-gradient-to-b from-slate-950 to-[#070b18] border border-slate-800 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
        {status === 'idle' && (
          <div className="space-y-4 max-w-md">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-950/60 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/20">
              <Grid className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Memoria de Trabajo Operativa</h3>
              <p className="text-xs text-slate-400 mt-1">
                Comenzaremos con una secuencia de 3 bloques. El nivel aumentará progresivamente con cada acierto.
              </p>
            </div>
            <button
              onClick={startTest}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/30 flex items-center gap-2 mx-auto transition transform hover:scale-105"
            >
              <Play className="w-4 h-4" />
              <span>Iniciar Tarea Corsi</span>
            </button>
          </div>
        )}

        {(status === 'demonstrating' || status === 'userTurn') && (
          <div className="space-y-6 w-full flex flex-col items-center">
            {/* Status Indicator */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Longitud Actual: <strong className="text-cyan-400">{currentSpan} bloques</strong>
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  status === 'demonstrating'
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-600/40 animate-pulse'
                    : 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/40'
                }`}
              >
                {status === 'demonstrating' ? 'Observando' : '¡Tu Turno de Reproducir!'}
              </span>
            </div>

            {/* Blocks Grid (3x3 spatial layout) */}
            <div className="grid grid-cols-3 gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl max-w-xs w-full">
              {blocks.map((block) => {
                const isLit = activeHighlightBlock === block.id;
                const isSelectedByUser = userSequence.includes(block.id);

                return (
                  <button
                    key={block.id}
                    onClick={() => handleBlockClick(block.id)}
                    disabled={status !== 'userTurn'}
                    className={`aspect-square rounded-xl font-mono text-sm font-bold flex items-center justify-center transition-all duration-200 transform ${
                      isLit
                        ? 'bg-cyan-400 text-slate-950 scale-110 shadow-lg shadow-cyan-400/80 ring-4 ring-cyan-300'
                        : isSelectedByUser && status === 'userTurn'
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400 scale-95'
                        : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700/80 border border-slate-700/80'
                    }`}
                  >
                    <span>{block.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-slate-400 font-mono min-h-[20px]">
              {feedback}
            </div>
          </div>
        )}

        {status === 'completed' && (
          <div className="space-y-5 max-w-lg w-full">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-950 border border-blue-500/50 flex items-center justify-center text-blue-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">¡Prueba Corsi Finalizada!</h3>
              <p className="text-xs text-slate-400">
                Se ha calculado tu alcance o "span" de retención visoespacial inmediata.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xl font-bold font-mono text-cyan-400">{maxSpanAchieved}</div>
                <div className="text-[10px] text-slate-400 uppercase">Alcance Corsi</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xl font-bold font-mono text-emerald-400">
                  {Math.round((maxSpanAchieved / 7) * 100)}%
                </div>
                <div className="text-[10px] text-slate-400 uppercase">Capacidad Operativa</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xl font-bold font-mono text-purple-400">
                  {reactionTimesRef.current.length ? Math.round(reactionTimesRef.current.reduce((a, b) => a + b, 0) / reactionTimesRef.current.length) : 480} ms
                </div>
                <div className="text-[10px] text-slate-400 uppercase">Tiempo de Evocación</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
