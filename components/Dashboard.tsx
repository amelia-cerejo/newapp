
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { AppState } from '../types';
import { getDailyInspiration } from '../services/geminiService';
import { Trophy, Calendar, Sparkles, TrendingUp, Repeat } from 'lucide-react';

interface DashboardProps {
  state: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const [inspiration, setInspiration] = useState<string>("Carregando sua dose de motivação...");

  useEffect(() => {
    const fetchInspiration = async () => {
      const tip = await getDailyInspiration(state.tasks.length, state.habits.length);
      setInspiration(tip);
    };
    fetchInspiration();
  }, [state.tasks.length, state.habits.length]);

  const completedTasks = state.tasks.filter(t => t.completed).length;
  const totalTasks = state.tasks.length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const data = [
    { name: 'Completed', value: completedTasks || 1 },
    { name: 'Remaining', value: totalTasks - completedTasks || 0.1 },
  ];
  const COLORS = ['#4f46e5', '#e2e8f0'];

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Bom dia, produtivo!</h1>
          <p className="text-slate-500">Hoje é {(new Date()).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-4 flex items-center gap-4 text-white shadow-lg shadow-indigo-100 min-w-[300px]">
          <Sparkles className="w-8 h-8 opacity-75" />
          <p className="text-sm font-medium italic">"{inspiration}"</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">Progresso de Hoje</p>
            <h3 className="text-3xl font-bold text-slate-800">{taskProgress}%</h3>
          </div>
          <div className="w-20 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={25}
                  outerRadius={35}
                  paddingAngle={5}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-emerald-50 p-3 rounded-xl">
            <Trophy className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Hábitos em Dia</p>
            <h3 className="text-2xl font-bold text-slate-800">{state.habits.filter(h => h.streak > 0).length} Ativos</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-amber-50 p-3 rounded-xl">
            <TrendingUp className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Metas Semanais</p>
            <h3 className="text-2xl font-bold text-slate-800">{state.goals.length} Planejadas</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-500" /> Próximas Tarefas
            </h3>
          </div>
          <div className="space-y-3">
            {state.tasks.slice(0, 4).map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-rose-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                  <span className={`text-sm ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>{task.title}</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400">{task.category}</span>
              </div>
            ))}
            {state.tasks.length === 0 && <p className="text-center text-slate-400 py-4 italic">Nenhuma tarefa para hoje.</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Repeat className="w-5 h-5 text-indigo-500" /> Foco em Hábitos
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {state.habits.slice(0, 4).map(habit => (
              <div key={habit.id} className="p-3 border border-slate-100 rounded-xl flex items-center gap-3">
                <span className="text-2xl">{habit.icon}</span>
                <div>
                  <p className="text-xs font-bold text-slate-800 truncate">{habit.name}</p>
                  <p className="text-[10px] text-slate-400">{habit.streak} dias de sequência</p>
                </div>
              </div>
            ))}
            {state.habits.length === 0 && <p className="col-span-2 text-center text-slate-400 py-4 italic">Crie um hábito para começar.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
