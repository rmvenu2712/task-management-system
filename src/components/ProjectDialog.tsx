import { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const colors = [
  'hsl(var(--primary))',
  'hsl(142, 76%, 36%)',
  'hsl(221, 83%, 53%)',
  'hsl(262, 83%, 58%)',
  'hsl(346, 87%, 43%)',
  'hsl(24, 95%, 53%)',
];

export function ProjectDialog({ open, onOpenChange }: ProjectDialogProps) {
  const { addProject } = useTaskStore();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: 'Error',
        description: 'Project name is required',
        variant: 'destructive',
      });
      return;
    }

    addProject({
      name: name.trim(),
      description: description.trim(),
      color: selectedColor,
    });

    toast({
      title: 'Project created',
      description: `"${name}" has been added to your workspace.`,
    });

    setName('');
    setDescription('');
    setSelectedColor(colors[0]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Organize your tasks into separate projects for better management.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="e.g., Website Redesign"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief project description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="h-8 w-8 rounded-full border-2 transition-all"
                    style={{
                      backgroundColor: color,
                      borderColor: selectedColor === color ? 'hsl(var(--foreground))' : 'transparent',
                      transform: selectedColor === color ? 'scale(1.1)' : 'scale(1)',
                    }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
