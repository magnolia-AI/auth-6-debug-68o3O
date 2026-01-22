'use client';

import { useState, useTransition } from 'react';
import { Todo } from '@/lib/schema';
import { addTodo, toggleTodo, deleteTodo } from '@/app/todos/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TodoListProps {
  initialTodos: Todo[];
}

export function TodoList({ initialTodos }: TodoListProps) {
  const [text, setText] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    startTransition(async () => {
      await addTodo(text);
      setText('');
    });
  };

  const handleToggleTodo = (id: string, completed: boolean) => {
    startTransition(async () => {
      await toggleTodo(id, !completed);
    });
  };

  const handleDeleteTodo = (id: string) => {
    startTransition(async () => {
      await deleteTodo(id);
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>My Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleAddTodo} className="flex gap-2">
          <Input
            placeholder="Add a new task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isPending}
          />
          <Button type="submit" size="icon" disabled={isPending || !text.trim()}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          </Button>
        </form>

        <div className="space-y-2">
          {initialTodos.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No tasks yet. Add one above!</p>
          ) : (
            initialTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => handleToggleTodo(todo.id, todo.completed)}
                    disabled={isPending}
                  />
                  <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                    {todo.text}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  onClick={() => handleDeleteTodo(todo.id)}
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

