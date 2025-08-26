import { useState } from 'react';
import { Todo } from '../types';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Pencil, Trash2, Calendar, Save, X } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: { title?: string; status?: Todo['status']; deadline?: string }) => void;
  onDelete: (id: string) => void;
  onSetDeadline: (todo: Todo) => void;
}

export function TodoItem({ todo, onUpdate, onDelete, onSetDeadline }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleStatusChange = (checked: boolean) => {
    let newStatus: Todo['status'];
    if (todo.status === "未着手") {
      newStatus = checked ? "着手中" : "未着手";
    } else if (todo.status === "着手中") {
      newStatus = checked ? "完了" : "未着手";
    } else {
      newStatus = checked ? "完了" : "未着手";
    }
    onUpdate(todo.id, { status: newStatus });
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdate(todo.id, { title: editTitle.trim() });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  const getStatusColor = (status: Todo['status']) => {
    switch (status) {
      case "未着手": return "text-gray-500";
      case "着手中": return "text-blue-500";
      case "完了": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null;
    return new Date(deadline).toLocaleDateString('ja-JP');
  };

  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg bg-white shadow-sm">
      <Checkbox
        checked={todo.status !== "未着手"}
        onCheckedChange={handleStatusChange}
      />
      
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit();
                if (e.key === 'Escape') handleCancelEdit();
              }}
              className="flex-1"
              autoFocus
            />
            <Button size="sm" onClick={handleSaveEdit}>
              <Save className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div>
            <div className={`font-medium ${todo.status === "完了" ? "line-through" : ""}`}>
              {todo.title}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <span className={getStatusColor(todo.status)}>
                {todo.status}
              </span>
              {todo.deadline && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  期限: {formatDeadline(todo.deadline)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onSetDeadline(todo)}
        >
          <Calendar className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(todo.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
