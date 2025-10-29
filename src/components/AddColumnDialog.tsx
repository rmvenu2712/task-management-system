import { useState } from 'react';
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

interface AddColumnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (title: string) => void;
}

export const AddColumnDialog = ({
  open,
  onOpenChange,
  onSave,
}: AddColumnDialogProps) => {
  const [title, setTitle] = useState('');

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title.trim());
    setTitle('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Column</DialogTitle>
          <DialogDescription>
            Create a new column for your board.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="column-title">Column Title</Label>
            <Input
              id="column-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter column title"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSave();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            Add Column
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
