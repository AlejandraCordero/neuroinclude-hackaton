import React, { useEffect, useRef } from 'react';
import { ActiveTab } from '../types';
import { 
  ArrowRight, 
  Sparkles, 
  Activity, 
  Brain, 
  ShieldCheck, 
  Layers, 
  Target, 
  Compass,
  CheckCircle2,
  FileCode2,
  Users
} from 'lucide-react';

interface HeroViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onLoadSampleData: () => void;
  openDeliverables: () => void;
}

export const HeroView: React.FC<HeroViewProps> = ({
  setActiveTab,
  onLoadSampleData,
  openDeliverables,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Interactive Neural Network Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Neural nodes
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      pulse: number;
    }

    const nodeColors = ['#06b6d4', '#38bdf8', '#818cf8', '#a855f7', '#ec4899'];
    const nodes: Node[] = [];
    const count = Math.min(65, Math.floor((width * height) / 12000));

    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2.5 + 1.5,
        color: nodeColors[Math.floor(Math.random() * nodeColors.length)],
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw synapses (connections)
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        n1.x += n1.vx;
        n1.y += n1.vy;
        n1.pulse += 0.03;

        // Bounce
        if (n1.x < 0 || n1.x > width) n1.vx *= -1;
        if (n1.y < 0 || n1.y > height) n1.vy *= -1;

        // Mouse attraction
        const dxMouse = mouseX - n1.x;
        const dyMouse = mouseY - n1.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 140) {
          n1.x += dxMouse * 0.015;
          n1.y += dyMouse * 0.015;
        }

        // Draw node
        ctx.beginPath();
        const pulsedRadius = n1.radius + Math.sin(n1.pulse) * 0.8;
        ctx.arc(n1.x, n1.y, Math.max(1, pulsedRadius), 0, Math.PI * 2);
        ctx.fillStyle = n1.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = n1.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            const alpha = (1 - dist / 130) * 0.35;
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const stages = [
    {
      num: '01',
      title: 'Conócete',
      subtitle: 'Consentimiento & Zero-Trace',
      desc: 'Comprende el propósito del análisis, genera tu sesión efímera UUIDv4 y garantiza que tus datos nunca saldrán de tu dispositivo.',
      icon: ShieldCheck,
      color: 'from-cyan-500 to-blue-500',
    },
    {
      num: '02',
      title: 'Experimenta',
      subtitle: '5 Pruebas Neuropsicológicas',
      desc: 'Atención sostenida (CPT), memoria de trabajo (Corsi), alternancia cognitiva (WCST), perfil sensorial y matrices progresivas con precisión milimétrica.',
      icon: Activity,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      num: '03',
      title: 'Comprende',
      subtitle: 'Dashboard & Síntesis IA',
      desc: 'Visualiza tu constelación neurocognitiva en radar interactivo y recibe un informe generado por IA rigurosamente orientado a fortalezas.',
      icon: Brain,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      num: '04',
      title: 'Desarrolla tu potencial',
      subtitle: 'Plan Adaptativo & Recursos',
      desc: 'Adopta pautas de ergonomía sensorial, estrategias pedagógicas personalizadas y accede a la red de apoyo profesional en Bolivia.',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section with Interactive Canvas */}
      <section className="relative min-h-[640px] flex items-center justify-center overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-[#090e24] via-[#060a17] to-[#040711] p-6 sm:p-12">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-80"
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono shadow-lg shadow-cyan-950/50 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>Hacktoberfest Hack Day La Paz × NeuroTech UMSA 2026</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Descubre tu cerebro. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
              Potencia tus fortalezas únicas.
            </span>
          </h1>

          {/* Official Tagline */}
          <p className="text-lg sm:text-xl text-cyan-200/90 font-light max-w-2xl mx-auto tracking-wide italic">
            "Discover your brain. Understand your strengths. Develop your potential."
          </p>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Plataforma boliviana de neurotecnología y bienestar cognitivo. Combina baterías de evaluación neuropsicológica estandarizadas, laboratorio EEG demostrativo e inteligencia artificial afirmativa con <strong className="text-cyan-300 font-semibold">cero diagnósticos clínicos</strong> y <strong className="text-purple-300 font-semibold">privacidad Zero-Trace</strong>.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => setActiveTab('consent')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm transition-all duration-300 shadow-lg shadow-cyan-500/25 flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>Explorar mi Perfil Cognitivo</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('eeg')}
              className="px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 font-semibold text-sm transition flex items-center gap-2 backdrop-blur-md"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Laboratorio EEG en Vivo</span>
            </button>

            <button
              onClick={onLoadSampleData}
              className="px-4 py-3.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 font-medium text-sm transition flex items-center gap-2 backdrop-blur-md"
              title="Carga instantáneamente una evaluación completa para evaluar al jurado"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Cargar Demo Jurado</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm text-center">
              <div className="text-xl font-bold font-mono text-cyan-400">5</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Pruebas Científicas</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm text-center">
              <div className="text-xl font-bold font-mono text-emerald-400">0%</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Etiquetas Clínicas</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm text-center">
              <div className="text-xl font-bold font-mono text-purple-400">1 ms</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Precisión Cronometría</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 backdrop-blur-sm text-center">
              <div className="text-xl font-bold font-mono text-amber-400">UUIDv4</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">Zero-Trace Privacy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recorrido Visual por Etapas: Conócete → Experimenta → Comprende → Desarrolla tu potencial */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-xs uppercase font-mono tracking-widest text-cyan-400">Metodología de 4 Etapas</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">¿Cómo Funciona NEUROINCLUDE?</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Una travesía científica guiada para desmitificar tu funcionamiento mental sin patologizar tus diferencias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.num}
                className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition duration-300 relative group overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stage.color}`}></div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-500">{stage.num}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-0.5">{stage.title}</h3>
                <h4 className="text-xs font-medium text-cyan-400 mb-2">{stage.subtitle}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{stage.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Scientific Distinction Banner */}
      <section className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-[#0c1228] border border-cyan-500/20 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              Taxonomía y Honestidad Técnica
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Diferenciamos estrictamente las 5 capas de información: Medición Directa vs. Resultado Experimental vs. Autorreporte vs. Estimación Algorítmica vs. Evaluación Clínica Profesional.
            </p>
          </div>
          <button
            onClick={openDeliverables}
            className="px-4 py-2 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
          >
            <FileCode2 className="w-4 h-4" />
            <span>Consultar Matriz de Honestidad</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs pt-2">
          <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <span className="text-[10px] font-mono text-cyan-400 uppercase block font-bold">1. Medición Directa</span>
            <span className="text-[11px] text-slate-300">Latencias en milisegundos y toques exactos.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <span className="text-[10px] font-mono text-blue-400 uppercase block font-bold">2. Resultado Experimental</span>
            <span className="text-[11px] text-slate-300">Índice d' de sensibilidad y Corsi span.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <span className="text-[10px] font-mono text-indigo-400 uppercase block font-bold">3. Autorreporte</span>
            <span className="text-[11px] text-slate-300">Cuestionario Sensorial y preferencias de confort.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <span className="text-[10px] font-mono text-purple-400 uppercase block font-bold">4. Estimación Algorítmica</span>
            <span className="text-[11px] text-slate-300">Síntesis narrativa generada por IA abierta.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-700/40">
            <span className="text-[10px] font-mono text-emerald-400 uppercase block font-bold">5. Evaluación Clínica</span>
            <span className="text-[11px] text-emerald-200">Exclusiva de especialistas humanos cualificados.</span>
          </div>
        </div>
      </section>
    </div>
  );
};
