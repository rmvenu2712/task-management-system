import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Task, Priority, useTaskStore } from '@/store/taskStore';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: {
    title: string;
    description: string;
    priority: Priority;
    columnId: string;
    projectId: string;
    order: number;
    dueDate?: string;
  }) => void;
  task?: Task | null;
  columnId?: string;
  tasksInColumn?: number;
}

export const TaskDialog = ({
  open,
  onOpenChange,
  onSave,
  task,
  columnId,
  tasksInColumn = 0,
}: TaskDialogProps) => {
  const { selectedProjectId, projects } = useTaskStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('none');
  const [dueDate, setDueDate] = useState<Date>();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
    } else {
      setTitle('');
      setDescription('');
      setPriority('none');
      setDueDate(undefined);
    }
  }, [task, open]);

  const handleSave = () => {
    if (!title.trim()) return;

    const projectId = task?.projectId || selectedProjectId || projects[0]?.id;

    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      columnId: task?.columnId || columnId || 'todo',
      projectId,
      order: task?.order ?? tasksInColumn,
      dueDate: dueDate?.toISOString(),
    });

    onOpenChange(false);
    setTitle('');
    setDescription('');
    setPriority('none');
    setDueDate(undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {task
              ? 'Update the task details below.'
              : 'Add a new task to your board. Fill in the details below.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={4}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value as Priority)}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="dueDate"
                  variant="outline"
                  className={cn(
                    'justify-start text-left font-normal',
                    !dueDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            {task ? 'Update' : 'Create'} Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
