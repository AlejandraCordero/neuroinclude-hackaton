import React from 'react';
import { 
  Building2, 
  Phone, 
  MapPin, 
  ExternalLink, 
  ShieldCheck, 
  HelpCircle, 
  HeartHandshake, 
  GraduationCap,
  AlertCircle
} from 'lucide-react';

export const ProfessionalGuidanceView: React.FC = () => {
  const boliviaResources = [
    {
      name: 'UMSA - Carrera de Psicología e Instituto de Investigación (IICP)',
      city: 'La Paz, Bolivia',
      category: 'Académico / Evaluación Psicológica',
      address: 'Campus Universitario Cota Cota / Av. 6 de Agosto, Edif. Hoy, La Paz',
      phone: '+591 2 2441554',
      description: 'Consultorios de atención psicológica comunitaria e investigación en psicometría y neuropsicología aplicada.',
      website: 'https://psicologia.umsa.bo',
    },
    {
      name: 'Centro de Rehabilitación y Neurodesarrollo Infantil (CRN)',
      city: 'La Paz / El Alto',
      category: 'Neurodesarrollo & Terapia Ocupacional',
      address: 'Zona Miraflores / Villa Dolores, El Alto',
      phone: '+591 2 2229100',
      description: 'Evaluación multidisciplinaria de perfiles sensoriales, integración sensorial y dificultades del aprendizaje.',
      website: '#',
    },
    {
      name: 'Sociedad Boliviana de Neurociencias y Neuropsicología',
      city: 'Nacional (La Paz, Cbba, SCZ)',
      category: 'Colegiatura Profesional',
      address: 'Red de profesionales acreditados en Bolivia',
      phone: '+591 70612345',
      description: 'Padrón de neuropsicólogos clínicos cualificados para baterías estandarizadas (WAIS-IV, WISC-V, Neuropsi).',
      website: '#',
    },
    {
      name: 'Colectivo Neurodiversidad Bolivia / Familias TEA & TDAH',
      city: 'La Paz, Cochabamba y Santa Cruz',
      category: 'Comunidad & Red de Familias',
      address: 'Grupos de apoyo mutuo y defensoría comunitaria',
      phone: '+591 71598765',
      description: 'Red afirmativa para personas autistas, con TDAH y altas capacidades. Orientación para inclusión laboral y escolar.',
      website: '#',
    },
    {
      name: 'Hospital de Clínicas - Unidad de Salud Mental y Neurofisiología',
      city: 'La Paz, Bolivia',
      category: 'Salud Pública',
      address: 'Complejo Hospitalario de Miraflores, Av. Saavedra, La Paz',
      phone: '+591 2 2225111',
      description: 'Servicio de neurología, estudios EEG clínicos diagnósticos y atención psiquiátrica del sistema público (SUS).',
      website: '#',
    },
    {
      name: 'Línea de Asistencia y Apoyo Psicosocial Gratuito',
      city: 'Bolivia (Nivel Nacional)',
      category: 'Orientación Inmediata',
      address: 'Atención telefónica gratuita y confidencial',
      phone: 'Línea 156 / 800-11-3040',
      description: 'Orientación psicosocial de primera respuesta y canalización ante crisis de sobrecarga emocional o bienestar.',
      website: '#',
    },
  ];

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-2">
      {/* Title */}
      <div className="border-b border-slate-800 pb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Módulo G • Orientación Profesional & Recursos</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">
          Guía de Derivación Ética y Recursos en Bolivia
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Pautas claras para saber cuándo acudir a un profesional cualificado y directorio de instituciones en La Paz y Bolivia.
        </p>
      </div>

      {/* Ethical Guidance Card: When NEUROINCLUDE is useful vs when to seek formal assessment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">¿Cuándo usar NEUROINCLUDE?</h3>
          </div>
          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Autoconocimiento y exploración:</strong> Identificar fortalezas cognitivas y preferencias de trabajo personal.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Ergonomía sensorial cotidiana:</strong> Ajustar iluminación, niveles sonoros y pausas posturales en el hogar o estudio.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Educación inclusiva:</strong> Docentes y familias que buscan estrategias de aprendizaje basadas en fortalezas sin estigmatizar.</span>
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-bold text-white">¿Cuándo acudir a un profesional clínico?</h3>
          </div>
          <ul className="text-xs text-slate-300 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">•</span>
              <span><strong>Diagnóstico diferencial formal:</strong> Cuando se requiera confirmación clínica de TDAH, autismo, dislexia o afección neurológica.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">•</span>
              <span><strong>Adaptaciones curriculares oficiales:</strong> Para tramitar adecuaciones institucionales ante ministerios o universidades.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">•</span>
              <span><strong>Malestar clínico significativo:</strong> Si experimentas ansiedad severa, depresión o sobrecarga sensorial invalidante.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bolivia Directory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            Directorio de Apoyo y Salud Mental en Bolivia
          </h3>
          <span className="text-xs font-mono text-slate-400">La Paz • UMSA • Red Nacional</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {boliviaResources.map((res, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/30 transition duration-200 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-bold text-white">{res.name}</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 shrink-0 border border-slate-700">
                  {res.category}
                </span>
              </div>

              <p className="text-xs text-slate-400">{res.description}</p>

              <div className="pt-2 text-[11px] text-slate-300 space-y-1 font-mono">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{res.address}</span>
                </div>
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Phone className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <span>{res.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
