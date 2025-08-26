import express from 'express';
import cors from 'cors';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from './types';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let todos: Todo[] = [];
let nextId = 1;

const generateId = (): string => {
  return (nextId++).toString();
};

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  try {
    const { title, deadline }: CreateTodoRequest = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newTodo: Todo = {
      id: generateId(),
      title: title.trim(),
      status: "未着手",
      deadline: deadline || undefined,
      createdAt: new Date().toISOString()
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates: UpdateTodoRequest = req.body;
    
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const updatedTodo = {
      ...todos[todoIndex],
      ...updates,
      title: updates.title?.trim() || todos[todoIndex].title
    };

    todos[todoIndex] = updatedTodo;
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/todos/:id', (req, res) => {
  try {
    const { id } = req.params;
    const todoIndex = todos.findIndex(todo => todo.id === id);
    
    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todos.splice(todoIndex, 1);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
