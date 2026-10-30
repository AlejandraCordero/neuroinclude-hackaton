import React, { useState } from 'react';
import { WellbeingGoal, ActiveTab } from '../types';
import { sound } from '../utils/audio';
import { 
  Target, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Filter, 
  Sparkles, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ActionPlanProps {
  goals: WellbeingGoal[];
  setGoals: React.Dispatch<React.SetStateAction<WellbeingGoal[]>>;
  setActiveTab: (tab: ActiveTab) => void;
}

export const ActionPlanView: React.FC<ActionPlanProps> = ({
  goals,
  setGoals,
  setActiveTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Atención' | 'Sensorial' | 'Memoria' | 'Descanso' | 'Funciones Ejecutivas'>('Atención');
  const [newTip, setNewTip] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const toggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const nextState = !g.completed;
          if (nextState) sound.playSuccess();
          return { ...g, completed: nextState };
        }
        return g;
      })
    );
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    sound.playSuccess();
    const newGoal: WellbeingGoal = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      rationale: 'Meta personalizada definida por el usuario.',
      tip: newTip.trim() || 'Acción diaria enfocada.',
      completed: false,
      custom: true,
    };

    setGoals((prev) => [newGoal, ...prev]);
    setNewTitle('');
    setNewTip('');
    setIsAdding(false);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const categories = ['all', 'Atención', 'Sensorial', 'Memoria', 'Descanso', 'Funciones Ejecutivas'];

  const filteredGoals = goals.filter((g) => {
    if (selectedCategory === 'all') return true;
    return g.category === selectedCategory;
  });

  const completedCount = goals.filter((g) => g.completed).length;

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            <Target className="w-3.5 h-3.5" />
            <span>Módulo F • Plan de Desarrollo Adaptativo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">
            Plan de Metas & Bienestar Cognitivo
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Estrategias cotidianas sugeridas por el motor de neuroergonomía para regular la atención, optimizar la carga sensorial y consolidar aprendizajes.
          </p>
        </div>

        {/* Progress Card */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 shrink-0 flex items-center gap-4">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Metas Completadas</div>
            <div className="text-lg font-bold font-mono text-emerald-400">
              {completedCount} <span className="text-slate-500 text-sm">/ {goals.length}</span>
            </div>
          </div>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Meta</span>
          </button>
        </div>
      </div>

      {/* Add Custom Goal Modal / Form */}
      {isAdding && (
        <form
          onSubmit={handleAddGoal}
          className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-xl space-y-4 animate-in fade-in"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Agregar Nueva Meta Personalizada
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] text-slate-400">Título de la Meta</label>
              <input
                type="text"
                placeholder="Ej: Caminata propioceptiva de 10 minutos..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Categoría</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Atención">Atención</option>
                <option value="Sensorial">Sensorial</option>
                <option value="Memoria">Memoria</option>
                <option value="Descanso">Descanso</option>
                <option value="Funciones Ejecutivas">Funciones Ejecutivas</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">Consejo o Acción Diaria (Opcional)</label>
            <input
              type="text"
              placeholder="Ej: Programar alarma diaria a las 15:30 para descanso ocular."
              value={newTip}
              onChange={(e) => setNewTip(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition"
            >
              Guardar Meta
            </button>
          </div>
        </form>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" /> Filtrar:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              selectedCategory === cat
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat === 'all' ? 'Todas las Metas' : cat}
          </button>
        ))}
      </div>

      {/* Goals List */}
      <div className="space-y-3">
        {filteredGoals.map((goal) => {
          return (
            <div
              key={goal.id}
              className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                goal.completed
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-75'
                  : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-start gap-3.5 flex-1">
                <button
                  onClick={() => toggleGoal(goal.id)}
                  className="mt-0.5 text-slate-400 hover:text-cyan-400 transition shrink-0"
                >
                  {goal.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-950" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-600 hover:text-cyan-400" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-sm font-bold ${
                        goal.completed ? 'line-through text-slate-500' : 'text-white'
                      }`}
                    >
                      {goal.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-slate-700">
                      {goal.category}
                    </span>
                    {goal.custom && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                        Personalizada
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{goal.rationale}</p>
                  {goal.tip && (
                    <p className="text-xs text-cyan-300/80 font-mono flex items-center gap-1.5 pt-0.5">
                      <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{goal.tip}</span>
                    </p>
                  )}
                </div>
              </div>

              {goal.custom && (
                <button
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg transition shrink-0"
                  title="Eliminar meta personalizada"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation to Resources */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-800">
        <button
          onClick={() => setActiveTab('profile')}
          className="text-xs text-slate-400 hover:text-white"
        >
          ← Volver al Perfil
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-lg shadow-cyan-500/20"
        >
          <span>Directorio de Recursos Bolivia</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
