
import React, { useState } from 'react';
import { Plus, Flame, Check, X } from 'lucide-react';
import { Habit } from '../types';

interface HabitsProps {
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;
}

const Habits: React.FC<HabitsProps> = ({ habits, setHabits }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('🔥');

  const addHabit = () => {
    if (!newName.trim()) return;
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newName,
      icon: newIcon,
      color: 'indigo',
      streak: 0,
      completedDays: []
    };
    setHabits([...habits, newHabit]);
    setNewName('');
    setIsAdding(false);
  };

  const toggleDay = (habitId: string, date: string) => {
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const isCompleted = h.completedDays.includes(date);
        const newDays = isCompleted 
          ? h.completedDays.filter(d => d !== date)
          : [...h.completedDays, date];
        
        // Simple streak calculation (placeholder)
        const streak = isCompleted ? Math.max(0, h.streak - 1) : h.streak + 1;
        
        return { ...h, completedDays: newDays, streak: streak };
      }
      return h;
    }));
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        date: d.toISOString().split('T')[0],
        label: d.toLocaleDateString('pt-BR', { weekday: 'narrow' }),
        num: d.getDate()
      });
    }
    return days;
  };

  const last7Days = getLast7Days();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Seus Hábitos</h1>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          <Plus className="w-5 h-5" /> Adicionar
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4 animate-in fade-in slide-in-from-top-4">
          <input 
            value={newIcon}
            onChange={(e) => setNewIcon(e.target.value)}
            className="w-12 h-12 text-2xl bg-slate-50 border-none rounded-xl text-center"
          />
          <input 
            placeholder="Nome do hábito..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 bg-slate-50 border-none rounded-xl px-4 text-slate-700 outline-none"
          />
          <button onClick={addHabit} className="bg-emerald-500 text-white p-3 rounded-xl"><Check className="w-6 h-6" /></button>
          <button onClick={() => setIsAdding(false)} className="bg-slate-200 text-slate-500 p-3 rounded-xl"><X className="w-6 h-6" /></button>
        </div>
      )}

      <div className="space-y-4">
        {habits.map((habit) => (
          <div key={habit.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{habit.icon}</span>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{habit.name}</h3>
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Flame className="w-4 h-4 fill-current" />
                  <span>{habit.streak} dias</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 overflow-x-auto pb-2 md:pb-0">
              {last7Days.map((day) => {
                const isCompleted = habit.completedDays.includes(day.date);
                return (
                  <button
                    key={day.date}
                    onClick={() => toggleDay(habit.id, day.date)}
                    className={`flex flex-col items-center gap-1 min-w-[40px] p-2 rounded-xl transition-all ${
                      isCompleted ? 'bg-indigo-500 text-white shadow-md shadow-indigo-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase">{day.label}</span>
                    <span className="text-sm font-bold">{day.num}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {habits.length === 0 && (
          <p className="text-center py-10 text-slate-400 italic">Nenhum hábito rastreado. Comece hoje!</p>
        )}
      </div>
    </div>
  );
};

export default Habits;
