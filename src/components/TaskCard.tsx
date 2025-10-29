import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit2, Trash2, Play, Pause, CheckCircle2, Clock, Calendar, History } from 'lucide-react';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { Task, Priority, useTaskStore } from '@/store/taskStore';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { TaskHistory } from './TaskHistory';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

const priorityStyles: Record<Priority, string> = {
  low: 'priority-low',
  medium: 'priority-medium',
  high: 'priority-high',
  none: 'priority-none',
};

const priorityLabels: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  none: 'None',
};

export const TaskCard = ({ task, onEdit, onDelete, onComplete }: TaskCardProps) => {
  const { startTimer, stopTimer } = useTaskStore();
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [historyOpen, setHistoryOpen] = useState(false);
  useEffect(() => {
    if (task.isTimerRunning) {
      const interval = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [task.isTimerRunning]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getCurrentTimeSpent = () => {
    let total = task.timeSpent;
    if (task.isTimerRunning && task.lastTimerStart) {
      const elapsed = Math.floor((currentTime - task.lastTimerStart) / 1000);
      total += elapsed;
    }
    return total;
  };

  const handleTimerToggle = () => {
    if (task.isTimerRunning) {
      stopTimer(task.id);
    } else {
      startTimer(task.id);
    }
  };

  const isDueSoon = task.dueDate && !task.isCompleted && isPast(new Date(task.dueDate));
  const totalTime = getCurrentTimeSpent();

  return (
    <>
      <motion.div
        ref={setNodeRef}
        style={style}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn(
          "task-card group",
          task.isCompleted && "opacity-60"
        )}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-start gap-2 flex-1">
            <button
              {...attributes}
              {...listeners}
              className="mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={cn(
                  "font-semibold text-card-foreground",
                  task.isCompleted && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </h3>
                {task.isCompleted && (
                  <CheckCircle2 className="h-4 w-4 text-status-done" />
                )}
              </div>
              {task.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {task.description}
                </p>
              )}
              
              {task.dueDate && (
                <div className={cn(
                  "flex items-center gap-1 text-xs mb-2",
                  isDueSoon ? "text-destructive font-medium" : "text-muted-foreground"
                )}>
                  <Calendar className="h-3 w-3" />
                  <span>
                    {isDueSoon ? 'Overdue: ' : 'Due: '}
                    {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
                  </span>
                </div>
              )}

              {totalTime > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <Clock className="h-3 w-3" />
                  <span>Time: {formatTime(totalTime)}</span>
                </div>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setHistoryOpen(true)}>
                <History className="mr-2 h-4 w-4" />
                Activity Log
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(task.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className={`priority-badge ${priorityStyles[task.priority]}`}>
            {priorityLabels[task.priority]}
          </span>
          
          <div className="flex items-center gap-1">
            {!task.isCompleted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTimerToggle}
                className="h-7 px-2"
              >
                {task.isTimerRunning ? (
                  <>
                    <Pause className="h-3 w-3 mr-1" />
                    <span className="text-xs">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 mr-1" />
                    <span className="text-xs">Start</span>
                  </>
                )}
              </Button>
            )}
            <Button
              variant={task.isCompleted ? "secondary" : "default"}
              size="sm"
              onClick={() => onComplete(task.id)}
              className="h-7 px-2"
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              <span className="text-xs">
                {task.isCompleted ? 'Reopen' : 'Complete'}
              </span>
            </Button>
          </div>
        </div>
      </motion.div>

      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Activity Log</DialogTitle>
            <DialogDescription>
              Track all activity and changes for "{task.title}"
            </DialogDescription>
          </DialogHeader>
          <TaskHistory activityLog={task.activityLog} />
        </DialogContent>
      </Dialog>
    </>
  );
};
