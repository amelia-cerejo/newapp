
import React from 'react';
import { LayoutDashboard, CheckCircle2, Repeat, Clock, Target, Rocket } from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tarefas', icon: CheckCircle2 },
    { id: 'habits', label: 'Hábitos', icon: Repeat },
    { id: 'routine', label: 'Rotina', icon: Clock },
    { id: 'goals', label: 'Metas', icon: Target },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center md:relative md:w-64 md:h-screen md:flex-col md:justify-start md:border-t-0 md:border-r md:p-6 z-50">
      <div className="hidden md:flex items-center gap-2 mb-10 w-full">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Rocket className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-slate-800">Nexus</span>
      </div>

      <nav className="flex md:flex-col gap-4 w-full justify-around md:justify-start">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:p-3 rounded-xl transition-all ${
              currentView === item.id
                ? 'text-indigo-600 md:bg-indigo-50 font-semibold'
                : 'text-slate-400 hover:text-slate-600 md:hover:bg-slate-50'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] md:text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
