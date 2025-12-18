
import React from 'react';
import { Clock, Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import { RoutineItem } from '../types';

interface RoutineProps {
  routine: RoutineItem[];
  setRoutine: (routine: RoutineItem[]) => void;
}

const Routine: React.FC<RoutineProps> = ({ routine, setRoutine }) => {
  const addRoutineItem = () => {
    const newItem: RoutineItem = {
      id: Date.now().toString(),
      time: '08:00',
      activity: 'Nova atividade',
      completed: false
    };
    setRoutine([...routine, newItem].sort((a, b) => a.time.localeCompare(b.time)));
  };

  const updateItem = (id: string, updates: Partial<RoutineItem>) => {
    setRoutine(routine.map(item => item.id === id ? { ...item, ...updates } : item).sort((a, b) => a.time.localeCompare(b.time)));
  };

  const deleteItem = (id: string) => {
    setRoutine(routine.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Sua Rotina Ideal</h1>
        <button 
          onClick={addRoutineItem}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Adicionar Bloco
        </button>
      </div>

      <div className="relative space-y-4">
        {/* Timeline Line */}
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-slate-100 z-0" />
        
        {routine.map((item) => (
          <div key={item.id} className="relative z-10 flex items-start gap-4">
            <button 
              onClick={() => updateItem(item.id, { completed: !item.completed })}
              className={`mt-1 bg-white p-1 rounded-full border-2 transition-colors ${item.completed ? 'border-emerald-500 text-emerald-500' : 'border-slate-200 text-slate-200'}`}
            >
              {item.completed ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
            </button>
            
            <div className={`flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 ${item.completed ? 'opacity-50' : ''}`}>
              <div className="flex flex-col">
                <input 
                  type="time" 
                  value={item.time}
                  onChange={(e) => updateItem(item.id, { time: e.target.value })}
                  className="text-indigo-600 font-bold bg-transparent border-none outline-none text-sm"
                />
              </div>
              <input 
                type="text" 
                value={item.activity}
                onChange={(e) => updateItem(item.id, { activity: e.target.value })}
                className={`flex-1 font-medium bg-transparent border-none outline-none text-slate-700 ${item.completed ? 'line-through' : ''}`}
                placeholder="Atividade..."
              />
              <button onClick={() => deleteItem(item.id)} className="text-slate-300 hover:text-rose-500 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {routine.length === 0 && (
          <div className="text-center py-20">
            <Clock className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400">Monte seu dia perfeito bloqueando horários.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Routine;
