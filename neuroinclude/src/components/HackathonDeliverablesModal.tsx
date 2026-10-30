import React, { useState, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldCheck, 
  FileCode2, 
  Terminal, 
  Mic, 
  Award,
  ExternalLink
} from 'lucide-react';
import { sound } from '../utils/audio';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HackathonDeliverablesModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'pitch' | 'deploy' | 'code'>('matrix');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Pitch 3-min timer
  const [pitchSeconds, setPitchSeconds] = useState<number>(180);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && pitchSeconds > 0) {
      interval = setInterval(() => {
        setPitchSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pitchSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      sound.playFanfare();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pitchSeconds]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    sound.playSuccess();
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleDownloadStandalone = () => {
    // Fetches the standalone html file from public/neuroinclude_standalone.html or generates it
    const a = document.createElement('a');
    a.href = '/neuroinclude_standalone.html';
    a.download = 'index.html';
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-[#080d1e] border border-cyan-500/40 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Entregables Oficiales del Hackathon</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  UMSA 2026
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Hacktoberfest Hack Day La Paz × NeuroTech UMSA 2026
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigator */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 overflow-x-auto px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xl border-t border-x transition flex items-center gap-1.5 ${
              activeTab === 'matrix'
                ? 'bg-[#080d1e] text-cyan-300 border-cyan-500/40'
                : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Matriz de Honestidad Técnica</span>
          </button>

          <button
            onClick={() => setActiveTab('pitch')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xl border-t border-x transition flex items-center gap-1.5 ${
              activeTab === 'pitch'
                ? 'bg-[#080d1e] text-cyan-300 border-cyan-500/40'
                : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-purple-400" />
            <span>Guion de Pitch (3 min)</span>
          </button>

          <button
            onClick={() => setActiveTab('deploy')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xl border-t border-x transition flex items-center gap-1.5 ${
              activeTab === 'deploy'
                ? 'bg-[#080d1e] text-cyan-300 border-cyan-500/40'
                : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>Despliegue en GitHub Pages</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 text-xs font-semibold rounded-t-xl border-t border-x transition flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'bg-[#080d1e] text-cyan-300 border-cyan-500/40'
                : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Archivo Standalone (index.html)</span>
          </button>
        </div>

        {/* Tab Content (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-300 text-xs leading-relaxed">
          {/* TAB 1: MATRIZ DE HONESTIDAD TÉCNICA */}
          {activeTab === 'matrix' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Matriz de Honestidad Científica y Técnica (Anti-Slop AI Policy)
                </h3>
                <p className="text-slate-300">
                  En cumplimiento riguroso con la ética neurocientífica y la rúbrica del jurado de NeuroTech UMSA 2026, discriminamos de forma explícita qué elementos corresponden a mediciones empíricas reales en el dispositivo versus simulaciones demostrativas y síntesis algorítmicas.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-cyan-300 uppercase">
                      <th className="p-3">Componente / Módulo</th>
                      <th className="p-3">Clasificación Técnica</th>
                      <th className="p-3">Implementación en NEUROINCLUDE</th>
                      <th className="p-3">Límite Innegociable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-[11px]">
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-semibold text-white">Pruebas CPT, Corsi, Trail Flex, Raven</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                          1. Medición Directa
                        </span>
                      </td>
                      <td className="p-3">
                        Cronometría real en el navegador mediante <code className="text-cyan-300 font-mono">performance.now()</code>, registro exacto de aciertos, latencias y errores de perseveración.
                      </td>
                      <td className="p-3 text-slate-400">
                        No mide CI clínico ni sustituye un protocolo WAIS-IV administrado por un neuropsicólogo colegiado.
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-semibold text-white">Índice d' y Corsi Block Span</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                          2. Resultado Experimental
                        </span>
                      </td>
                      <td className="p-3">
                        Cálculo estandarizado de la Teoría de Detección de Señales (Macmillan & Creelman, 2004) con corrección Hautus.
                      </td>
                      <td className="p-3 text-slate-400">
                        Los resultados varían según la fatiga, calidad de pantalla y hora del día.
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-semibold text-white">Cuestionario Sensorial</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-mono">
                          3. Autorreporte
                        </span>
                      </td>
                      <td className="p-3">
                        Escalas visuales análogas de 1 a 5 inspiradas en el Perfil Sensorial de Winnie Dunn (1999).
                      </td>
                      <td className="p-3 text-slate-400">
                        Es percepción subjetiva de confort ambiental, no una audiometría ni optometría médica.
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-semibold text-white">Laboratorio EEG en Vivo</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                          Demostración Sintética
                        </span>
                      </td>
                      <td className="p-3">
                        Modulación armónica matemática de ondas δ, θ, α, β, γ con ruido 1/f y artefactos oculares programados.
                      </td>
                      <td className="p-3 text-amber-300 font-semibold">
                        ROTULADO PERMANENTE: "Datos sintéticos para demostración". Cero pretensión de señal biológica clínica.
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 font-semibold text-white">Síntesis de Perfil y Metas</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                          4. Estimación Algorítmica (IA)
                        </span>
                      </td>
                      <td className="p-3">
                        Modelos de lenguaje abiertos (Gemini / Gemma) integrados vía backend estructurado con prompt neuroafirmativo.
                      </td>
                      <td className="p-3 text-rose-300 font-semibold">
                        CERO DIAGNÓSTICOS CLÍNICOS de TDAH, Autismo o Dislexia. Prohibición estricta de patologización.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => copyToClipboard(markdownMatrixText, 'matrix')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
                >
                  {copiedKey === 'matrix' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>Copiar Matriz en Markdown</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: GUION DE PITCH (3 MINUTOS) */}
          {activeTab === 'pitch' && (
            <div className="space-y-6">
              {/* Live Timer Widget */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/40 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-mono font-black text-cyan-300">
                    {formatTimer(pitchSeconds)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider">Cronómetro de Pitch (3 Minutos)</div>
                    <div className="text-[11px] text-slate-400">Optimizado para la rúbrica de Hacktoberfest Hack Day La Paz</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isTimerRunning ? 'Pausar' : 'Iniciar'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setPitchSeconds(180);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Reiniciar a 3:00"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Pitch Script Breakdown */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-cyan-400 font-mono">
                      [00:00 - 00:45] 1. Gancho e Impacto Social en Bolivia
                    </h4>
                    <span className="text-[10px] font-mono bg-cyan-950 px-2 py-0.5 rounded text-cyan-300">45 seg</span>
                  </div>
                  <p className="text-slate-200">
                    <em>"Estimado jurado de NeuroTech UMSA: En Bolivia, miles de jóvenes y adultos neurodivergentes enfrentan estigmas y barreras educativas porque nuestro sistema mide a todos con la misma vara. Hoy les presentamos <strong>NEUROINCLUDE</strong>, bajo el lema: 'Discover your brain. Understand your strengths. Develop your potential'."</em>
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    <strong>Puntos Clave:</strong> No patologizar; celebrar la neurodiversidad; cero diagnósticos médicos con base en la honestidad científica.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-blue-400 font-mono">
                      [00:45 - 01:45] 2. Demostración Técnica y Batería Experimental
                    </h4>
                    <span className="text-[10px] font-mono bg-blue-950 px-2 py-0.5 rounded text-blue-300">60 seg</span>
                  </div>
                  <p className="text-slate-200">
                    <em>"Nuestra plataforma es una Single Page Application de alto rendimiento. En pantalla pueden observar nuestras 5 pruebas neuropsicológicas programadas con cronometría de precisión <code>performance.now()</code>: atención sostenida Go/No-Go calculando el índice d' de detección de señales, la memoria de trabajo de bloques Corsi, la alternancia adaptativa de Wisconsin y el perfil sensorial de Dunn. Además, contamos con un laboratorio EEG demostrativo con modulación multicanal de ondas alfa, beta y gamma en tiempo real."</em>
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    <strong>Acción en la demo:</strong> Mostrar el radar interactivo y la gráfica Canvas de ondas cerebrales.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-purple-400 font-mono">
                      [01:45 - 02:30] 3. Inteligencia Artificial Abierta y Fortalezas
                    </h4>
                    <span className="text-[10px] font-mono bg-purple-950 px-2 py-0.5 rounded text-purple-300">45 seg</span>
                  </div>
                  <p className="text-slate-200">
                    <em>"Alineados con la arquitectura abierta (Gemma / Gemini), alimentamos al modelo de IA con datos estructurados reales del usuario para generar un informe neuroafirmativo sin etiquetas clínicas. La IA traduce las latencias en recomendaciones de ergonomía sensorial —como tipos de iluminación o reducción acústica— y planes pedagógicos adaptativos."</em>
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    <strong>Puntos Clave:</strong> IA orientada a fortalezas y adaptaciones ecológicas cotidianas.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-emerald-400 font-mono">
                      [02:30 - 03:00] 4. Ética Zero-Trace y Cierre
                    </h4>
                    <span className="text-[10px] font-mono bg-emerald-950 px-2 py-0.5 rounded text-emerald-300">30 seg</span>
                  </div>
                  <p className="text-slate-200">
                    <em>"Garantizamos privacidad Zero-Trace mediante sesiones efímeras UUIDv4 sin almacenamiento de datos sensibles. Y para quien requiera apoyo, conectamos con la Carrera de Psicología de la UMSA y centros bolivianos. NEUROINCLUDE: la neurotecnología abierta para que cada mente en Bolivia despliegue su máximo potencial. ¡Muchas gracias!"</em>
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => copyToClipboard(pitchFullText, 'pitch')}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition"
                >
                  {copiedKey === 'pitch' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>Copiar Guion Completo</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: INSTRUCCIONES DE DESPLIEGUE EN GITHUB PAGES */}
          {activeTab === 'deploy' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  Despliegue Directo en GitHub Pages (2 Minutos)
                </h3>
                <p className="text-slate-300">
                  NEUROINCLUDE ha sido diseñado para funcionar de manera inmediata en GitHub Pages, tanto como aplicación compilada en Vite como en su archivo standalone único <code className="text-cyan-300">index.html</code>.
                </p>

                <div className="space-y-3 font-mono text-[11px]">
                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-slate-400 font-sans font-semibold">Opción A: Despliegue de un único archivo (Recomendado para entrega rápida)</div>
                    <pre className="text-cyan-300 overflow-x-auto">
{`# 1. Crear nuevo repositorio en GitHub (ej: neuroinclude-bolivia)
# 2. Descargar el archivo standalone 'index.html' desde esta misma ventana
# 3. Subir el archivo index.html en la raíz de tu repositorio
# 4. Ir a Configuración (Settings) > Pages > Build and deployment
# 5. En 'Source', seleccionar 'Deploy from a branch' y elegir 'main' / root
# ¡Tu aplicación estará en vivo en https://<tu-usuario>.github.io/neuroinclude-bolivia!`}
                    </pre>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-slate-400 font-sans font-semibold">Opción B: Despliegue mediante GitHub Actions (Vite Build)</div>
                    <pre className="text-cyan-300 overflow-x-auto">
{`npm run build
# El directorio 'dist' contiene todo el bundle estático listo para publicación.
# Puedes usar gh-pages:
npx gh-pages -d dist`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ARCHIVO STANDALONE INDEX.HTML */}
          {activeTab === 'code' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-emerald-400" />
                    Código Autocontenido en un Único Archivo `index.html`
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    100% libre de instalación de NodeJS, con Tailwind CSS por CDN, FontAwesome, Chart.js y Vanilla JS de alto rendimiento para su ejecución instantánea con doble clic en cualquier navegador.
                  </p>
                </div>

                <button
                  onClick={handleDownloadStandalone}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-lg shadow-emerald-500/25 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar index.html</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  Ubicación en el Proyecto:
                </span>
                <code className="text-xs font-mono text-cyan-300 block bg-slate-900 p-2.5 rounded border border-slate-800">
                  /public/neuroinclude_standalone.html (también exportable como index.html)
                </code>
                <p className="text-xs text-slate-400">
                  Incluye las 5 pruebas neurocognitivas interactivas completas, el laboratorio EEG multicanal Canvas, el radar de Chart.js y el motor de síntesis de perfil adaptativo.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            NEUROINCLUDE • Hack Day La Paz × NeuroTech UMSA 2026
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

const markdownMatrixText = `# Matriz de Honestidad Científica y Técnica - NEUROINCLUDE
**Hacktoberfest Hack Day La Paz × NeuroTech UMSA 2026**

| Componente | Nivel Epistémico | Implementación Técnica | Límite Innegociable |
|---|---|---|---|
| Batería CPT / Go-No-Go, Corsi, Trail Flex, Raven | 1. Medición Directa | performance.now() en navegador, milisegundos reales y conteo de respuestas | No sustituye evaluación presencial con WAIS-IV o WISC-V |
| Índice d' y Block Span | 2. Resultado Experimental | Fórmulas psicométricas de Detección de Señales (Macmillan, 2004) | Sujeto a variaciones de fatiga y contexto ambiental |
| Cuestionario Sensorial | 3. Autorreporte | Escalas visuales basadas en Dunn (1999) | Percepción subjetiva, no estudio audiológico ni óptico |
| Laboratorio EEG | Demostración Sintética | Ondas simuladas en Canvas con armónicos 1/f y parpadeos | ROTULADO: Datos sintéticos para fines educativos |
| Síntesis de Perfil y Metas | 4. Estimación Algorítmica | IA abierta (Gemma / Gemini) con lenguaje neuroafirmativo | CERO diagnósticos de Autismo, TDAH, Dislexia u otra condición |
`;

const pitchFullText = `GUION DE PITCH DE 3 MINUTOS - NEUROINCLUDE
Hacktoberfest Hack Day La Paz × NeuroTech UMSA 2026

[00:00 - 00:45] PROBLEMA E IMPACTO SOCIAL EN BOLIVIA
Estimado jurado de NeuroTech UMSA: En Bolivia, miles de jóvenes y adultos neurodivergentes enfrentan estigmas y barreras educativas porque nuestro sistema mide a todos con la misma vara. Hoy les presentamos NEUROINCLUDE, bajo el lema: "Discover your brain. Understand your strengths. Develop your potential". Una plataforma que cambia el paradigma: no buscamos patologizar ni diagnosticar, sino desvelar las fortalezas cognitivas únicas de cada persona con rigor científico y soberanía de datos.

[00:45 - 01:45] DEMOSTRACIÓN TÉCNICA EN VIVO
Nuestra plataforma es una Single Page Application de alto rendimiento. En pantalla pueden observar nuestras 5 pruebas neuropsicológicas programadas con cronometría de precisión performance.now(): atención sostenida Go/No-Go calculando el índice d' de detección de señales, la memoria de trabajo de bloques Corsi, la alternancia adaptativa de Wisconsin y el perfil sensorial de Dunn. Además, contamos con un laboratorio EEG demostrativo con modulación multicanal de ondas alfa, beta y gamma en tiempo real.

[01:45 - 02:30] INTELIGENCIA ARTIFICIAL ABIERTA Y FORTALEZAS
Alineados con la arquitectura abierta (Gemma / Gemini), alimentamos al modelo de IA con datos estructurados reales del usuario para generar un informe neuroafirmativo sin etiquetas clínicas. La IA traduce las latencias en recomendaciones de ergonomía sensorial —como tipos de iluminación o reducción acústica— y planes pedagógicos adaptativos.

[02:30 - 03:00] ÉTICA ZERO-TRACE Y CIERRE
Garantizamos privacidad Zero-Trace mediante sesiones efímeras UUIDv4 sin almacenamiento de datos sensibles. Y para quien requiera apoyo, conectamos con la Carrera de Psicología de la UMSA y centros bolivianos. NEUROINCLUDE: la neurotecnología abierta para que cada mente en Bolivia despliegue su máximo potencial. ¡Muchas gracias!
`;
