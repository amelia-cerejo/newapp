
import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, Circle, Sparkles, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { Task, Priority, SubTask } from '../types';
import { getSmartTaskBreakdown } from '../services/geminiService';

interface TasksProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

const Tasks: React.FC<TasksProps> = ({ tasks, setTasks }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Geral');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('medium');
  const [loadingBreakdown, setLoadingBreakdown] = useState<string | null>(null);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: '',
      category: newTaskCategory,
      priority: newTaskPriority,
      completed: false,
      dueDate: new Date().toISOString(),
      subTasks: []
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleSmartBreakdown = async (task: Task) => {
    setLoadingBreakdown(task.id);
    const result = await getSmartTaskBreakdown(task.title);
    if (result && Array.isArray(result)) {
      const newSubTasks: SubTask[] = result.map((item: { title: string }) => ({
        id: Math.random().toString(36).substr(2, 9),
        title: item.title,
        completed: false
      }));
      setTasks(tasks.map(t => t.id === task.id ? { ...t, subTasks: [...t.subTasks, ...newSubTasks] } : t));
      setExpandedTask(task.id);
    }
    setLoadingBreakdown(null);
  };

  const toggleSubTask = (taskId: string, subTaskId: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          subTasks: t.subTasks.map(st => st.id === subTaskId ? { ...st, completed: !st.completed } : st)
        };
      }
      return t;
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Suas Tarefas</h1>
        <div className="text-sm font-medium text-slate-500">
          {tasks.filter(t => t.completed).length}/{tasks.length} concluídas
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="O que precisa ser feito?"
            className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <select 
            value={newTaskCategory}
            onChange={(e) => setNewTaskCategory(e.target.value)}
            className="bg-slate-50 border-none rounded-xl px-4 py-3 text-slate-600 outline-none cursor-pointer"
          >
            <option>Geral</option>
            <option>Trabalho</option>
            <option>Estudos</option>
            <option>Saúde</option>
            <option>Finanças</option>
          </select>
          <select 
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
            className="bg-slate-50 border-none rounded-xl px-4 py-3 text-slate-600 outline-none cursor-pointer"
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>
          <button
            onClick={addTask}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-colors shadow-lg shadow-indigo-100"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className={`bg-white rounded-2xl border transition-all ${task.completed ? 'border-slate-100 opacity-75' : 'border-slate-200 hover:border-indigo-200'}`}>
            <div className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <button onClick={() => toggleTask(task.id)} className="text-indigo-600">
                  {task.completed ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6 text-slate-300" />}
                </button>
                <div className="flex-1">
                  <h3 className={`font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-bold uppercase tracking-wider">{task.category}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      task.priority === 'high' ? 'bg-rose-50 text-rose-500' : 
                      task.priority === 'medium' ? 'bg-amber-50 text-amber-500' : 
                      'bg-slate-50 text-slate-500'
                    }`}>{task.priority}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleSmartBreakdown(task)}
                  disabled={loadingBreakdown === task.id}
                  className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Quebrar com IA"
                >
                  <Sparkles className={`w-5 h-5 ${loadingBreakdown === task.id ? 'animate-pulse' : ''}`} />
                </button>
                <button 
                  onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                  className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg"
                >
                  {expandedTask === task.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                <button onClick={() => deleteTask(task.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {expandedTask === task.id && (
              <div className="px-14 pb-4 space-y-2">
                {task.subTasks.map(st => (
                  <div key={st.id} className="flex items-center gap-3 text-sm">
                    <button onClick={() => toggleSubTask(task.id, st.id)}>
                      {st.completed ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4 text-slate-300" />}
                    </button>
                    <span className={st.completed ? 'line-through text-slate-400' : 'text-slate-600'}>{st.title}</span>
                  </div>
                ))}
                {task.subTasks.length === 0 && (
                  <p className="text-xs text-slate-400 italic">Nenhuma subtarefa. Use a IA para quebrar esta tarefa!</p>
                )}
              </div>
            )}
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <CheckCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Você concluiu tudo! Tempo de planejar algo novo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
