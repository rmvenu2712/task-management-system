import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CelebrationEffect } from '@/components/CelebrationEffect';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Plus, Menu } from 'lucide-react';
import { useTaskStore, Task } from '@/store/taskStore';
import { TaskColumn } from '@/components/TaskColumn';
import { TaskCard } from '@/components/TaskCard';
import { TaskDialog } from '@/components/TaskDialog';
import { AddColumnDialog } from '@/components/AddColumnDialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';

const Index = () => {
  const { toast } = useToast();
  const { tasks, columns, projects, selectedProjectId, addTask, updateTask, deleteTask, addColumn, deleteColumn, reorderTasks, moveTask, toggleTaskComplete } =
    useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [columnDialogOpen, setColumnDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks.find((t) => t.id === activeId);
    const overTask = tasks.find((t) => t.id === overId);

    if (!activeTask) return;

    const overColumn = columns.find((c) => c.id === overId);
    if (overColumn && activeTask.columnId !== overColumn.id) {
      const tasksInColumn = tasks.filter((t) => t.columnId === overColumn.id);
      moveTask(activeTask.id, overColumn.id, tasksInColumn.length);
    }

    if (overTask && activeTask.columnId === overTask.columnId) {
      const columnTasks = tasks
        .filter((t) => t.columnId === activeTask.columnId)
        .sort((a, b) => a.order - b.order);

      const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
      const newIndex = columnTasks.findIndex((t) => t.id === overId);

      if (oldIndex !== newIndex) {
        const newOrder = arrayMove(columnTasks, oldIndex, newIndex);
        reorderTasks(
          activeTask.columnId,
          newOrder.map((t) => t.id)
        );
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
  };

  const handleAddTask = (columnId: string) => {
    setAddingToColumn(columnId);
    setEditingTask(null);
    setTaskDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setAddingToColumn(null);
    setTaskDialogOpen(true);
  };

  const handleSaveTask = (taskData: {
    title: string;
    description: string;
    priority: Task['priority'];
    columnId: string;
    projectId: string;
    order: number;
    dueDate?: string;
  }) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      toast({
        title: 'Task updated',
        description: 'Your task has been updated successfully.',
      });
    } else {
      addTask(taskData);
      toast({
        title: 'Task created',
        description: 'Your new task has been added to the board.',
      });
    }
  };

  const handleCompleteTask = useCallback((id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.isCompleted) {
      setShowCelebration(true);
      toast({
        title: '🎉 Task Completed!',
        description: 'Great job! Keep up the momentum!',
      });
    }
    toggleTaskComplete(id);
  }, [tasks, toggleTaskComplete, toast]);

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
    toast({
      title: 'Task deleted',
      description: 'The task has been removed from your board.',
      variant: 'destructive',
    });
  };

  const handleAddColumn = (title: string) => {
    addColumn(title);
    toast({
      title: 'Column added',
      description: `"${title}" column has been added to your board.`,
    });
  };

  const handleDeleteColumn = (id: string) => {
    const column = columns.find((c) => c.id === id);
    deleteColumn(id);
    toast({
      title: 'Column deleted',
      description: `"${column?.title}" column has been removed.`,
      variant: 'destructive',
    });
  };

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);
  
  const filteredTasks = selectedProjectId
    ? tasks.filter(t => t.projectId === selectedProjectId)
    : tasks;

  const currentProject = selectedProjectId 
    ? projects.find(p => p.id === selectedProjectId)
    : null;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 md:mb-8"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            {/* Mobile Menu Trigger */}
            <SidebarTrigger className="md:hidden">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            
            {currentProject && (
              <div
                className="h-3 w-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: currentProject.color }}
              />
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-3xl font-bold text-foreground truncate">
                {currentProject ? currentProject.name : 'All Projects'}
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground truncate">
                {currentProject?.description || 'Manage tasks across all projects'}
              </p>
            </div>
            {currentProject && (
              <Badge variant="secondary" className="ml-2 hidden sm:inline-flex flex-shrink-0">
                {filteredTasks.length} tasks
              </Badge>
            )}
          </div>
          <Button onClick={() => setColumnDialogOpen(true)} className="gap-2 ml-2 flex-shrink-0" size="sm">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Column</span>
          </Button>
        </div>
      </motion.header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 px-2">
          {sortedColumns.map((column, index) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-80 sm:w-96"
            >
              <TaskColumn
                column={column}
                tasks={filteredTasks.filter((t) => t.columnId === column.id)}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onDeleteColumn={handleDeleteColumn}
                onCompleteTask={handleCompleteTask}
              />
            </motion.div>
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="task-card rotate-3 scale-105">
              <h3 className="font-semibold text-card-foreground mb-1">
                {activeTask.title}
              </h3>
              {activeTask.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {activeTask.description}
                </p>
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onSave={handleSaveTask}
        task={editingTask}
        columnId={addingToColumn || undefined}
        tasksInColumn={
          addingToColumn
            ? tasks.filter((t) => t.columnId === addingToColumn).length
            : 0
        }
      />

      <AddColumnDialog
        open={columnDialogOpen}
        onOpenChange={setColumnDialogOpen}
        onSave={handleAddColumn}
      />

      {showCelebration && (
        <CelebrationEffect onComplete={() => setShowCelebration(false)} />
      )}
    </div>
  );
};

export default Index;
