import React, { useState, useRef } from 'react';
import { MatricesResult } from '../../types';
import { sound } from '../../utils/audio';
import { Play, RotateCcw, CheckCircle2, HelpCircle, Sparkles } from 'lucide-react';

interface MatricesTestProps {
  onComplete: (result: MatricesResult) => void;
  savedResult?: MatricesResult;
}

interface MatrixItem {
  id: number;
  title: string;
  ruleDescription: string;
  gridCells: string[]; // 8 cells + '?'
  options: { id: number; symbol: string; isCorrect: boolean }[];
}

const MATRICES_DATA: MatrixItem[] = [
  {
    id: 1,
    title: 'Matriz 1: Progresión de Lados Poligonales',
    ruleDescription: 'Fila 1: Triángulo (3) -> Cuadrado (4) -> Pentágono (5)',
    gridCells: ['▲', '■', '⬟', '●', '◈', '⬢', '✶', '✹', '?'],
    options: [
      { id: 1, symbol: '✺', isCorrect: true },
      { id: 2, symbol: '▲', isCorrect: false },
      { id: 3, symbol: '●', isCorrect: false },
      { id: 4, symbol: '■', isCorrect: false },
    ],
  },
  {
    id: 2,
    title: 'Matriz 2: Rotación Angular Horaria de 90°',
    ruleDescription: 'Cada fila rota la flecha 90° hacia la derecha.',
    gridCells: ['↑', '→', '↓', '→', '↓', '←', '↓', '←', '?'],
    options: [
      { id: 1, symbol: '↓', isCorrect: false },
      { id: 2, symbol: '↑', isCorrect: true },
      { id: 3, symbol: '→', isCorrect: false },
      { id: 4, symbol: '↗', isCorrect: false },
    ],
  },
  {
    id: 3,
    title: 'Matriz 3: Densidad y Superposición Aritmética',
    ruleDescription: 'Fila 3: 1 barra + 2 barras = 3 barras.',
    gridCells: ['|', '||', '|||', '•', '••', '•••', '★', '★★', '?'],
    options: [
      { id: 1, symbol: '★', isCorrect: false },
      { id: 2, symbol: '★★★★', isCorrect: false },
      { id: 3, symbol: '★★★', isCorrect: true },
      { id: 4, symbol: '•••', isCorrect: false },
    ],
  },
  {
    id: 4,
    title: 'Matriz 4: Operación Lógica de Inclusión Visoespacial',
    ruleDescription: 'Completar la simetría cruzada diagonal.',
    gridCells: ['◇', '◈', '◆', '◈', '◆', '◈', '◆', '◈', '?'],
    options: [
      { id: 1, symbol: '◇', isCorrect: true },
      { id: 2, symbol: '◆', isCorrect: false },
      { id: 3, symbol: '◈', isCorrect: false },
      { id: 4, symbol: '▲', isCorrect: false },
    ],
  },
];

export const MatricesTest: React.FC<MatricesTestProps> = ({ onComplete, savedResult }) => {
  const [status, setStatus] = useState<'idle' | 'running' | 'completed'>(savedResult ? 'completed' : 'idle');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [latencies, setLatencies] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const trialStartTimeRef = useRef<number>(0);

  const startTest = () => {
    setStatus('running');
    setCurrentIndex(0);
    setSolvedCount(0);
    setLatencies([]);
    setSelectedOption(null);
    trialStartTimeRef.current = performance.now();
  };

  const handleChooseOption = (option: { id: number; symbol: string; isCorrect: boolean }) => {
    if (selectedOption !== null) return;

    setSelectedOption(option.id);
    const latency = Math.round(performance.now() - trialStartTimeRef.current);
    const updatedLatencies = [...latencies, latency];
    setLatencies(updatedLatencies);

    let updatedSolved = solvedCount;
    if (option.isCorrect) {
      sound.playSuccess();
      updatedSolved += 1;
      setSolvedCount(updatedSolved);
    } else {
      sound.playSoftError();
    }

    setTimeout(() => {
      setSelectedOption(null);
      if (currentIndex + 1 < MATRICES_DATA.length) {
        setCurrentIndex(currentIndex + 1);
        trialStartTimeRef.current = performance.now();
      } else {
        finishTest(updatedSolved, updatedLatencies);
      }
    }, 800);
  };

  const finishTest = (finalSolved: number, finalLatencies: number[]) => {
    setStatus('completed');
    sound.playFanfare();

    const avgLat = finalLatencies.length
      ? Math.round(finalLatencies.reduce((a, b) => a + b, 0) / finalLatencies.length)
      : 2500;

    const accuracyPercent = Math.round((finalSolved / MATRICES_DATA.length) * 100);

    const result: MatricesResult = {
      solved: finalSolved,
      total: MATRICES_DATA.length,
      accuracyPercent,
      avgLatencyMs: avgLat,
    };

    onComplete(result);
  };

  const currentMatrix = MATRICES_DATA[currentIndex];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              Prueba 5 de 5 • Matrices Progresivas (Raven-Style)
            </span>
            <span className="text-xs text-slate-500">Razonamiento Inductivo No-Verbal</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Deducción de Patrones Lógicos y Regularidades</h2>
          <p className="text-xs text-slate-400">
            Analiza la regla lógica en las filas y columnas y selecciona la figura que completa la casilla faltante (?).
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

      {/* Main Matrix Board */}
      <div className="relative min-h-[380px] rounded-2xl bg-gradient-to-b from-slate-950 to-[#070b18] border border-slate-800 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
        {status === 'idle' && (
          <div className="space-y-4 max-w-md">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
              <HelpCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Razonamiento Lógico Abstracto</h3>
              <p className="text-xs text-slate-400 mt-1">
                Consta de {MATRICES_DATA.length} acertijos geométricos de deducción sin límites estrictos de tiempo, midiendo precisión y deliberación.
              </p>
            </div>
            <button
              onClick={startTest}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/30 flex items-center gap-2 mx-auto transition transform hover:scale-105"
            >
              <Play className="w-4 h-4" />
              <span>Iniciar Tarea de Matrices</span>
            </button>
          </div>
        )}

        {status === 'running' && currentMatrix && (
          <div className="space-y-6 w-full flex flex-col items-center max-w-md">
            <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400">
              <span>Problema {currentIndex + 1} de {MATRICES_DATA.length}</span>
              <span className="text-cyan-400">{currentMatrix.title}</span>
            </div>

            {/* 3x3 Grid Matrix */}
            <div className="grid grid-cols-3 gap-2.5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl w-full aspect-square max-w-[280px]">
              {currentMatrix.gridCells.map((symbol, idx) => {
                const isTargetCell = idx === 8;
                return (
                  <div
                    key={idx}
                    className={`rounded-xl flex items-center justify-center text-3xl font-bold transition ${
                      isTargetCell
                        ? 'bg-cyan-950/80 border-2 border-dashed border-cyan-400 text-cyan-300 animate-pulse'
                        : 'bg-slate-800/90 border border-slate-700/80 text-white'
                    }`}
                  >
                    {symbol}
                  </div>
                );
              })}
            </div>

            {/* Candidate Options (4 choices) */}
            <div className="w-full space-y-2">
              <span className="text-xs text-slate-400 uppercase font-mono tracking-wider block">
                Selecciona la Opción Correcta:
              </span>
              <div className="grid grid-cols-4 gap-2.5">
                {currentMatrix.options.map((opt) => {
                  const isSelected = selectedOption === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleChooseOption(opt)}
                      disabled={selectedOption !== null}
                      className={`h-16 rounded-xl border flex items-center justify-center text-2xl font-bold transition transform active:scale-95 ${
                        isSelected
                          ? opt.isCorrect
                            ? 'bg-emerald-950 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400'
                            : 'bg-rose-950 border-rose-400 text-rose-300 ring-2 ring-rose-400'
                          : 'bg-slate-900/90 border-slate-700 hover:border-cyan-400/60 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {opt.symbol}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {status === 'completed' && (
          <div className="space-y-5 max-w-lg w-full">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">¡Prueba de Matrices Finalizada!</h3>
              <p className="text-xs text-slate-400">
                Se ha calculado tu porcentaje de precisión inductiva y tiempo medio de decisión.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xl font-bold font-mono text-cyan-400">
                  {solvedCount} / {MATRICES_DATA.length}
                </div>
                <div className="text-[10px] text-slate-400 uppercase">Aciertos</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xl font-bold font-mono text-emerald-400">
                  {Math.round((solvedCount / MATRICES_DATA.length) * 100)}%
                </div>
                <div className="text-[10px] text-slate-400 uppercase">Precisión</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xl font-bold font-mono text-purple-400">
                  {latencies.length ? (latencies.reduce((a, b) => a + b, 0) / latencies.length / 1000).toFixed(1) : '2.8'} s
                </div>
                <div className="text-[10px] text-slate-400 uppercase">Tiempo Medio</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
