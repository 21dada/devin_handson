import { useState, useEffect } from 'react';
import { Todo } from './types';
import { todoApi } from './services/api';
import { TodoItem } from './components/TodoItem';
import { DeadlineModal } from './components/DeadlineModal';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Plus } from 'lucide-react';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isDeadlineModalOpen, setIsDeadlineModalOpen] = useState(false);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedTodos = await todoApi.getTodos();
      setTodos(fetchedTodos);
    } catch (err) {
      setError('タスクの読み込みに失敗しました');
      console.error('Failed to load todos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodo = async () => {
    if (!newTodoTitle.trim()) return;

    try {
      setError(null);
      const newTodo = await todoApi.createTodo({ title: newTodoTitle.trim() });
      setTodos(prev => [...prev, newTodo]);
      setNewTodoTitle('');
    } catch (err) {
      setError('タスクの追加に失敗しました');
      console.error('Failed to create todo:', err);
    }
  };

  const handleUpdateTodo = async (id: string, updates: { title?: string; status?: Todo['status']; deadline?: string }) => {
    try {
      setError(null);
      const updatedTodo = await todoApi.updateTodo(id, updates);
      setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo));
    } catch (err) {
      setError('タスクの更新に失敗しました');
      console.error('Failed to update todo:', err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!confirm('このタスクを削除しますか？')) return;

    try {
      setError(null);
      await todoApi.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError('タスクの削除に失敗しました');
      console.error('Failed to delete todo:', err);
    }
  };

  const handleSetDeadline = (todo: Todo) => {
    setSelectedTodo(todo);
    setIsDeadlineModalOpen(true);
  };

  const handleSaveDeadline = async (id: string, deadline: string | undefined) => {
    await handleUpdateTodo(id, { deadline });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Todoリスト
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-6 flex gap-2">
          <Input
            placeholder="新しいタスクを入力..."
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
            className="flex-1"
          />
          <Button onClick={handleAddTodo} disabled={!newTodoTitle.trim()}>
            <Plus className="h-4 w-4 mr-1" />
            追加
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            読み込み中...
          </div>
        ) : todos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            タスクがありません。新しいタスクを追加してください。
          </div>
        ) : (
          <div className="space-y-3">
            {todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onUpdate={handleUpdateTodo}
                onDelete={handleDeleteTodo}
                onSetDeadline={handleSetDeadline}
              />
            ))}
          </div>
        )}

        <DeadlineModal
          todo={selectedTodo}
          isOpen={isDeadlineModalOpen}
          onClose={() => {
            setIsDeadlineModalOpen(false);
            setSelectedTodo(null);
          }}
          onSave={handleSaveDeadline}
        />
      </div>
    </div>
  );
}

export default App;
