import { useState } from 'react';
import { Todo } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface DeadlineModalProps {
  todo: Todo | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, deadline: string | undefined) => void;
}

export function DeadlineModal({ todo, isOpen, onClose, onSave }: DeadlineModalProps) {
  const [deadline, setDeadline] = useState('');

  const handleOpen = () => {
    if (todo?.deadline) {
      const date = new Date(todo.deadline);
      setDeadline(date.toISOString().split('T')[0]);
    } else {
      setDeadline('');
    }
  };

  const handleSave = () => {
    if (todo) {
      onSave(todo.id, deadline || undefined);
      onClose();
    }
  };

  const handleRemoveDeadline = () => {
    if (todo) {
      onSave(todo.id, undefined);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent onOpenAutoFocus={handleOpen}>
        <DialogHeader>
          <DialogTitle>期限を設定</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="task-title">タスク</Label>
            <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">
              {todo?.title}
            </div>
          </div>
          
          <div>
            <Label htmlFor="deadline">期限</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            キャンセル
          </Button>
          {todo?.deadline && (
            <Button variant="destructive" onClick={handleRemoveDeadline}>
              期限を削除
            </Button>
          )}
          <Button onClick={handleSave}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
