import db from '@/lib/db';
import { todos } from '@/lib/schema';
import { authServer } from '@/lib/auth/server';
import { eq, desc } from 'drizzle-orm';
import { TodoList } from '@/components/todos/todo-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Home() {
  const result: any = await authServer.getSession();
  const session = result?.data;

  if (!session?.user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">Stay Organized</h1>
          <p className="text-muted-foreground text-lg">
            A simple, powerful todo app to manage your daily tasks.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const userTodos = await db
    .select()
    .from(todos)
    .where(eq(todos.userId, session.user.id))
    .orderBy(desc(todos.createdAt));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 pt-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {session.user.name}</h1>
            <p className="text-muted-foreground">Here are your tasks for today.</p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/account/settings">Settings</Link>
          </Button>
        </header>

        <TodoList initialTodos={userTodos} />
      </div>
    </div>
  );
}

