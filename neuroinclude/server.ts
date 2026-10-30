import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '2mb' }));

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY || 'AQ.Ab8RN6ITPofcxXVa7Yk6SNEVsXY_UTt5H2O21qfUB0FPZxFGkg';

let ai: GoogleGenAI | null = null;
try {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} catch (err) {
  console.warn('Could not initialize GoogleGenAI with key, fallback mode will be active:', err);
}

// Fallback neurocognitive report generator (offline / robust fallback)
function generateNeuroheuristicReport(metrics: any) {
  const { cpt = {}, corsi = {}, trailFlex = {}, sensory = {}, matrices = {} } = metrics || {};

  const attentionScore = cpt.dPrime ? Math.min(100, Math.max(30, Math.round(cpt.dPrime * 28 + 35))) : 78;
  const memorySpan = corsi.blockSpan || 5;
  const flexScore = trailFlex.accuracyPercent || 85;
  const patternScore = matrices.accuracyPercent || 80;

  const strengths: string[] = [];
  const growthAreas: string[] = [];

  if (attentionScore >= 75) {
    strengths.push('Excelente capacidad de focalización sostenida y filtrado de distractores en tareas de tiempo de reacción.');
  } else {
    growthAreas.push('Implementar descansos basados en micro-pausas (Técnica Pomodoro 20/5) para evitar la fatiga atencional prolongada.');
  }

  if (memorySpan >= 5) {
    strengths.push(`Alta retención en memoria de trabajo visoespacial (alcance Corsi de ${memorySpan} elementos), facilitando el modelado mental.`);
  } else {
    growthAreas.push('Uso de organizadores visuales externos y notas de apoyo para aligerar la carga momentánea de la memoria operativa.');
  }

  if (flexScore >= 75) {
    strengths.push('Alta agilidad de reconexión cognitiva (shifting atencional fluido) ante cambios imprevistos de reglas lógicas.');
  } else {
    growthAreas.push('Establecer transiciones estructuradas con avisos previos antes de cambiar de tarea o contexto operativo.');
  }

  if (patternScore >= 75) {
    strengths.push('Pensamiento inductivo y deducción visual relacional destacados para resolver problemas multidimensionales.');
  } else {
    growthAreas.push('Descomposición sistemática de problemas complejos en subtareas lineales paso a paso.');
  }

  if (strengths.length < 3) {
    strengths.push('Orientación al detalle y análisis exhaustivo antes de la toma de decisiones.');
  }

  return {
    executiveSummary: `Tu perfil refleja un funcionamiento neurocognitivo caracterizado por una singular capacidad de adaptación. Destacas en la integración visoespacial y en la velocidad de respuesta selectiva. No existen cerebros estándar: tu patrón único de activación optimiza la resolución inductiva y el procesamiento perceptivo cuando el entorno cuenta con los moduladores sensoriales adecuados.`,
    cognitiveStrengths: strengths,
    supportAreas: growthAreas,
    sensoryErgonomics: {
      visualRecommendation: sensory.visual > 3.5 
        ? 'Preferencia por bajo contraste periférico o temas oscuros (dark mode) para prevenir sobrecarga visual.' 
        : 'Iluminación equilibrada de espectro continuo y código visual por colores vivos para optimizar la categorización.',
      acousticRecommendation: sensory.auditory > 3.5
        ? 'Ambientes con cancelación activa de ruido o sonido rosa/marrón suave para maximizar la inmersión sin sobresaltos auditivos.'
        : 'Tolerancia acústica flexible; aprovechamiento de debates interactivos y podcasts para consolidar aprendizajes.',
      workspaceStrategy: 'Estación de trabajo ergonómica con libertad de micro-movimiento (fidget tools o cambios de postura regular) para regular la propiocepción.',
    },
    learningStyle: {
      primaryStyle: memorySpan > 4 ? 'Explorador Visoespacial Dinámico' : 'Analítico Secuencial Progresivo',
      pedagogicalStrategies: [
        'Diagramas de flujo y mapas conceptuales interactivos para sintetizar conceptos teóricos.',
        'Metodología de proyectos aplicados (Hands-On) con objetivos tangibles y retroalimentación inmediata.',
        'Flexibilidad en formatos de entrega evaluativa (presentaciones visuales, prototipos o síntesis orales).'
      ]
    },
    wellbeingActionPlan: [
      {
        title: 'Calibración de Enfoque Profundo (Flow State)',
        category: 'Atención',
        rationale: 'Aprovechar picos circadianos de atención sin inducir sobrecarga ejecutiva.',
        tip: 'Bloques de trabajo hiperfocalizado de 35 minutos seguidos de 5 minutos de respiración o estiramiento sensorial.'
      },
      {
        title: 'Gestión Ambiental Libre de Sobrecarga',
        category: 'Sensorial',
        rationale: 'Modular la entrada de estímulos para mantener un estado autonómico de confort.',
        tip: 'Configurar luz cálida indirecta y reducir notificaciones no prioritarias en dispositivos.'
      },
      {
        title: 'Descarga Externa de Memoria de Trabajo',
        category: 'Funciones Ejecutivas',
        rationale: 'Liberar memoria de trabajo para procesos creativos y de resolución.',
        tip: 'Mantener un checklist visual interactivo diario con no más de 3 prioridades críticas simultáneas.'
      }
    ],
    ethicalNotice: 'Prototipo experimental con base neuropsicológica. No es un dispositivo médico ni emite diagnósticos clínicos.',
    isAiGenerated: false,
    modelUsed: 'Neuroheuristic Rules Engine v2.6 (Local / Bolivia UMSA Spec)'
  };
}

// API endpoint for profile analysis
app.post('/api/gemini/analyze-profile', async (req, res) => {
  try {
    const { testResults, userContext } = req.body;

    if (!testResults) {
      return res.status(400).json({ error: 'Faltan los datos de evaluación testResults.' });
    }

    if (ai) {
      try {
        const promptText = `
Actúa como un equipo multidisciplinario de élite en neurociencia cognitiva, diseño inclusivo y neurodiversidad afirmativa (Hacktoberfest Hack Day La Paz × NeuroTech UMSA 2026).
Sintetiza los siguientes resultados numéricos estructurados de una batería neuropsicológica experimental y genera un perfil neurocognitivo riguroso, ético y orientado a fortalezas.

REGLAS INNEGOCIABLES:
1. CERO diagnósticos clínicos (NUNCA etiquetes autismo, TDAH, dislexia o patologías).
2. Lenguaje afirmativo, basado en fortalezas y necesidades de apoyo ecológico.
3. El resultado debe ser un JSON estrictamente válido que coincida con el esquema solicitado.

DATOS NUMÉRICOS DE LA EVALUACIÓN:
${JSON.stringify(testResults, null, 2)}
CONTEXTO DE SESIÓN:
${JSON.stringify(userContext || {}, null, 2)}

Devuelve ÚNICAMENTE un objeto JSON válido con los siguientes campos:
{
  "executiveSummary": "Párrafo de 3 a 5 oraciones celebrando las fortalezas únicas, el estilo de procesamiento y el potencial del usuario.",
  "cognitiveStrengths": ["Fortaleza concreta 1 con métricas", "Fortaleza 2", "Fortaleza 3", "Fortaleza 4"],
  "supportAreas": ["Área de apoyo 1", "Área de apoyo 2", "Área de apoyo 3"],
  "sensoryErgonomics": {
    "visualRecommendation": "Pauta de ergonomía visual personalizada según su autorreporte",
    "acousticRecommendation": "Pauta de confort acústico según su nivel de tolerancia auditiva",
    "workspaceStrategy": "Estrategia de entorno físico y propioceptivo"
  },
  "learningStyle": {
    "primaryStyle": "Nombre descriptivo del estilo (ej: Arquitecto Visoespacial, Estratega Secuencial)",
    "pedagogicalStrategies": ["Estrategia pedagógica 1", "Estrategia 2", "Estrategia 3"]
  },
  "wellbeingActionPlan": [
    {
      "title": "Nombre de la meta de bienestar",
      "category": "Atención | Sensorial | Memoria | Descanso",
      "rationale": "Fundamento neurocognitivo breve",
      "tip": "Acción práctica diaria"
    },
    {
      "title": "Meta 2",
      "category": "Sensorial",
      "rationale": "Fundamento",
      "tip": "Acción"
    },
    {
      "title": "Meta 3",
      "category": "Funciones Ejecutivas",
      "rationale": "Fundamento",
      "tip": "Acción"
    }
  ],
  "ethicalNotice": "Prototipo experimental con base neuropsicológica. No es un dispositivo médico ni emite diagnósticos clínicos."
}
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptText,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text || '';
        const parsed = JSON.parse(rawText.trim());
        return res.json({
          ...parsed,
          isAiGenerated: true,
          modelUsed: 'gemini-3.8-flash',
        });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed or quota reached, serving high-grade neuroheuristic fallback:', geminiError?.message || geminiError);
        const fallback = generateNeuroheuristicReport(testResults);
        return res.json(fallback);
      }
    } else {
      const fallback = generateNeuroheuristicReport(testResults);
      return res.json(fallback);
    }
  } catch (error: any) {
    console.error('Server error in /api/gemini/analyze-profile:', error);
    const fallback = generateNeuroheuristicReport(req.body?.testResults || {});
    return res.json(fallback);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    project: 'NEUROINCLUDE',
    event: 'Hacktoberfest Hack Day La Paz × NeuroTech UMSA 2026',
    timestamp: new Date().toISOString(),
    geminiInitialized: !!ai,
  });
});

// Vite middleware for dev or static serving for prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NEUROINCLUDE] Servidor full-stack activo en http://0.0.0.0:${PORT}`);
    console.log(`[NEUROINCLUDE] Hackathon: Hacktoberfest Hack Day La Paz × NeuroTech UMSA 2026`);
  });
}

startServer();
