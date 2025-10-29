import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, MoreVertical, Trash2 } from 'lucide-react';
import { Task, Column } from '@/store/taskStore';
import { TaskCard } from './TaskCard';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface TaskColumnProps {
  column: Column;
  tasks: Task[];
  onAddTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onDeleteColumn: (id: string) => void;
  onCompleteTask: (id: string) => void;
}

export const TaskColumn = ({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDeleteColumn,
  onCompleteTask,
}: TaskColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);

  return (
    <div className="column-container">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-foreground">{column.title}</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {tasks.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAddTask(column.id)}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
          {!['todo', 'in-progress', 'done'].includes(column.id) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onDeleteColumn(column.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Column
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div
        ref={setNodeRef}
        className="space-y-3 min-h-[200px]"
      >
        <SortableContext
          items={sortedTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
            {sortedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onComplete={onCompleteTask}
              />
            ))}
        </SortableContext>
      </div>
    </div>
  );
};
