
import React, { useState } from 'react';
import { Target, Plus, Minus, Trash2 } from 'lucide-react';
import { WeeklyGoal } from '../types';

interface GoalsProps {
  goals: WeeklyGoal[];
  setGoals: (goals: WeeklyGoal[]) => void;
}

const Goals: React.FC<GoalsProps> = ({ goals, setGoals }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState(1);
  const [newUnit, setNewUnit] = useState('vezes');

  const addGoal = () => {
    if (!newTitle.trim()) return;
    const newGoal: WeeklyGoal = {
      id: Date.now().toString(),
      title: newTitle,
      target: newTarget,
      current: 0,
      unit: newUnit
    };
    setGoals([...goals, newGoal]);
    setNewTitle('');
  };

  const updateProgress = (id: string, delta: number) => {
    setGoals(goals.map(g => {
      if (g.id === id) {
        return { ...g, current: Math.max(0, Math.min(g.target, g.current + delta)) };
      }
      return g;
    }));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Metas Semanais</h1>
        <div className="text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-lg text-sm">
          Semana {Math.ceil(new Date().getDate() / 7)}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input 
          placeholder="Ex: Ler livros"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="md:col-span-2 bg-slate-50 border-none rounded-xl px-4 py-3"
        />
        <input 
          type="number"
          min="1"
          value={newTarget}
          onChange={(e) => setNewTarget(parseInt(e.target.value))}
          className="bg-slate-50 border-none rounded-xl px-4 py-3"
        />
        <button onClick={addGoal} className="bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">Criar Meta</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => {
          const progress = Math.round((goal.current / goal.target) * 100);
          return (
            <div key={goal.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="bg-indigo-50 p-2 rounded-lg">
                  <Target className="w-6 h-6 text-indigo-500" />
                </div>
                <button onClick={() => deleteGoal(goal.id)} className="text-slate-300 hover:text-rose-500">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-800">{goal.title}</h3>
                <p className="text-sm text-slate-400">Meta: {goal.target} {goal.unit}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold text-slate-600">
                  <span>{goal.current} concluídos</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => updateProgress(goal.id, -1)}
                  className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl flex justify-center text-slate-500"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => updateProgress(goal.id, 1)}
                  className="flex-1 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-xl flex justify-center text-white shadow-lg shadow-indigo-100"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
        {goals.length === 0 && (
          <div className="md:col-span-2 text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <Target className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400">Nenhuma meta ativa. Defina desafios para sua semana.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
