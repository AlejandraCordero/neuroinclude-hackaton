/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * NEUROINCLUDE - Plataforma de Neurotecnología y Bienestar Cognitivo
 * Hacktoberfest Hack Day La Paz × NeuroTech UMSA 2026
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ActiveTab, 
  AllTestResults, 
  CognitiveProfileSynthesis, 
  WellbeingGoal, 
  EEGSimMetrics 
} from './types';
import { SAMPLE_TEST_RESULTS } from './utils/neuroCalc';
import { sound } from './utils/audio';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HeroView } from './components/HeroView';
import { ConsentView } from './components/ConsentView';
import { CognitiveBatteryView } from './components/CognitiveBatteryView';
import { EEGLabView } from './components/EEGLabView';
import { CognitiveProfileView } from './components/CognitiveProfileView';
import { ActionPlanView } from './components/ActionPlanView';
import { ProfessionalGuidanceView } from './components/ProfessionalGuidanceView';
import { HackathonDeliverablesModal } from './components/HackathonDeliverablesModal';

function generateEphemeralId(): string {
  const seg1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const seg2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SES-${seg1}-${seg2}`;
}

const DEFAULT_GOALS: WellbeingGoal[] = [
  {
    id: 'g-1',
    title: 'Calibración de Enfoque Profundo (Flow State)',
    category: 'Atención',
    rationale: 'Aprovechar picos circadianos de atención sin inducir fatiga ejecutiva prolongada.',
    tip: 'Bloques de trabajo hiperfocalizado de 35 minutos seguidos de 5 minutos de respiración o estiramiento sensorial.',
    completed: false,
  },
  {
    id: 'g-2',
    title: 'Acondicionamiento Sensorial Libre de Sobrecarga',
    category: 'Sensorial',
    rationale: 'Modular la entrada de estímulos para mantener un estado autonómico de confort.',
    tip: 'Configurar luz cálida indirecta y reducir notificaciones no prioritarias en dispositivos.',
    completed: false,
  },
  {
    id: 'g-3',
    title: 'Descarga Externa de Memoria de Trabajo',
    category: 'Funciones Ejecutivas',
    rationale: 'Liberar memoria operativa inmediata para procesos creativos y de resolución.',
    tip: 'Mantener un checklist visual interactivo diario con no más de 3 prioridades críticas simultáneas.',
    completed: true,
  },
  {
    id: 'g-4',
    title: 'Pausa Propioceptiva y Movimiento Activo',
    category: 'Sensorial',
    rationale: 'Regular la estimulación vestibular y propioceptiva para evitar rigidez motora.',
    tip: 'Caminata de 7 minutos al aire libre o cambio de postura estática.',
    completed: false,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [anonymousId, setAnonymousId] = useState<string>(generateEphemeralId());
  const [consentAccepted, setConsentAccepted] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDeliverablesOpen, setIsDeliverablesOpen] = useState<boolean>(false);

  // Cognitive Tests Results State
  const [testResults, setTestResults] = useState<AllTestResults>({});
  const [synthesis, setSynthesis] = useState<CognitiveProfileSynthesis | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [goals, setGoals] = useState<WellbeingGoal[]>(DEFAULT_GOALS);

  // Compute progress of the battery
  const batteryCompletedCount = [
    testResults.cpt,
    testResults.corsi,
    testResults.trailFlex,
    testResults.sensory,
    testResults.matrices,
  ].filter(Boolean).length;

  // Synthesize profile with Server-side Gemini API or local heuristics
  const synthesizeProfile = async (customResults?: AllTestResults) => {
    setIsLoadingAi(true);
    const dataToSend = customResults || testResults;

    try {
      const response = await fetch('/api/gemini/analyze-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testResults: dataToSend,
          userContext: {
            sessionId: anonymousId,
            event: 'Hacktoberfest Hack Day La Paz × NeuroTech UMSA 2026',
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en API: ${response.statusText}`);
      }

      const parsedSynthesis = await response.json();
      setSynthesis(parsedSynthesis);

      if (parsedSynthesis.wellbeingActionPlan && parsedSynthesis.wellbeingActionPlan.length > 0) {
        setGoals(parsedSynthesis.wellbeingActionPlan);
      }
    } catch (err) {
      console.warn('Fallback a síntesis local neuroheurística:', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Instant Jury Demo Loader
  const handleLoadSampleData = () => {
    setTestResults(SAMPLE_TEST_RESULTS);
    setConsentAccepted(true);
    sound.playFanfare();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
    synthesizeProfile(SAMPLE_TEST_RESULTS);
    setActiveTab('profile');
  };

  const handleRegenerateId = () => {
    const newId = generateEphemeralId();
    setAnonymousId(newId);
    sound.playSuccess();
  };

  // Trigger celebration on completing all 5 tests
  useEffect(() => {
    if (batteryCompletedCount === 5 && !synthesis) {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
      });
      synthesizeProfile();
    }
  }, [batteryCompletedCount]);

  return (
    <div className="min-h-screen flex flex-col bg-[#060913] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Header with Navigation and Permanent Ethical Alert */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        anonymousId={anonymousId}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        onLoadSampleData={handleLoadSampleData}
        openDeliverables={() => setIsDeliverablesOpen(true)}
        batteryProgress={{ completed: batteryCompletedCount, total: 5 }}
      />

      {/* Main Content Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'home' && (
          <HeroView
            setActiveTab={setActiveTab}
            onLoadSampleData={handleLoadSampleData}
            openDeliverables={() => setIsDeliverablesOpen(true)}
          />
        )}

        {activeTab === 'consent' && (
          <ConsentView
            anonymousId={anonymousId}
            regenerateId={handleRegenerateId}
            consentAccepted={consentAccepted}
            setConsentAccepted={setConsentAccepted}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'battery' && (
          <CognitiveBatteryView
            testResults={testResults}
            setTestResults={setTestResults}
            setActiveTab={setActiveTab}
            onSynthesizeProfile={() => synthesizeProfile()}
          />
        )}

        {activeTab === 'eeg' && (
          <EEGLabView
            onUpdateMetrics={(metrics: EEGSimMetrics) => {
              setTestResults((prev) => ({ ...prev, eegMetrics: metrics }));
            }}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'profile' && (
          <CognitiveProfileView
            testResults={testResults}
            synthesis={synthesis}
            isLoadingAi={isLoadingAi}
            onRegenerateAi={() => synthesizeProfile()}
            setActiveTab={setActiveTab}
            anonymousId={anonymousId}
          />
        )}

        {activeTab === 'goals' && (
          <ActionPlanView
            goals={goals}
            setGoals={setGoals}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'resources' && <ProfessionalGuidanceView />}
      </main>

      {/* Footer with Ethical Disclaimers */}
      <Footer openDeliverables={() => setIsDeliverablesOpen(true)} />

      {/* Hackathon Deliverables Modal */}
      <HackathonDeliverablesModal
        isOpen={isDeliverablesOpen}
        onClose={() => setIsDeliverablesOpen(false)}
      />
    </div>
  );
}
