
import React, { useState, useEffect } from 'react';
import { AppState, View, Task, Habit, RoutineItem, WeeklyGoal } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Habits from './components/Habits';
import Routine from './components/Routine';
import Goals from './components/Goals';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  
  // State Initialization from LocalStorage
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('nx_tasks');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Completar projeto React', category: 'Trabalho', priority: 'high', completed: false, description: '', dueDate: '', subTasks: [] },
      { id: '2', title: 'Ir para academia', category: 'Saúde', priority: 'medium', completed: true, description: '', dueDate: '', subTasks: [] }
    ];
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('nx_habits');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Beber Água', icon: '💧', color: 'blue', streak: 5, completedDays: [] },
      { id: '2', name: 'Ler 30min', icon: '📚', color: 'orange', streak: 2, completedDays: [] }
    ];
  });

  const [routine, setRoutine] = useState<RoutineItem[]>(() => {
    const saved = localStorage.getItem('nx_routine');
    return saved ? JSON.parse(saved) : [
      { id: '1', time: '07:00', activity: 'Meditação', completed: false },
      { id: '2', time: '09:00', activity: 'Deep Work', completed: false }
    ];
  });

  const [goals, setGoals] = useState<WeeklyGoal[]>(() => {
    const saved = localStorage.getItem('nx_goals');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Treinos na semana', target: 4, current: 2, unit: 'treinos' }
    ];
  });

  // Persist state to localstorage
  useEffect(() => localStorage.setItem('nx_tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('nx_habits', JSON.stringify(habits)), [habits]);
  useEffect(() => localStorage.setItem('nx_routine', JSON.stringify(routine)), [routine]);
  useEffect(() => localStorage.setItem('nx_goals', JSON.stringify(goals)), [goals]);

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard state={{ tasks, habits, routine, goals }} />;
      case 'tasks':
        return <Tasks tasks={tasks} setTasks={setTasks} />;
      case 'habits':
        return <Habits habits={habits} setHabits={setHabits} />;
      case 'routine':
        return <Routine routine={routine} setRoutine={setRoutine} />;
      case 'goals':
        return <Goals goals={goals} setGoals={setGoals} />;
      default:
        return <Dashboard state={{ tasks, habits, routine, goals }} />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar currentView={view} setView={setView} />
      
      <main className="flex-1 p-4 md:p-10 pb-24 md:pb-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
