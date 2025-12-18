
export type Priority = 'low' | 'medium' | 'high';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  completed: boolean;
  dueDate: string;
  subTasks: SubTask[];
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  streak: number;
  completedDays: string[]; // ISO dates
}

export interface RoutineItem {
  id: string;
  time: string;
  activity: string;
  completed: boolean;
}

export interface WeeklyGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
}

export type View = 'dashboard' | 'tasks' | 'habits' | 'routine' | 'goals';

export interface AppState {
  tasks: Task[];
  habits: Habit[];
  routine: RoutineItem[];
  goals: WeeklyGoal[];
}
