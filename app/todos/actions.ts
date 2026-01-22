'use server';

import db from '@/lib/db';
import { todos } from '@/lib/schema';
import { authServer } from '@/lib/auth/server';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function addTodo(text: string) {
  const result: any = await authServer.getSession();
  if (!result?.data?.user) {
    throw new Error('Not authenticated');
  }

  await db.insert(todos).values({
    text,
    userId: result.data.user.id,
  });

  revalidatePath('/');
}

export async function toggleTodo(id: string, completed: boolean) {
  const result: any = await authServer.getSession();
  if (!result?.data?.user) {
    throw new Error('Not authenticated');
  }

  await db
    .update(todos)
    .set({ completed })
    .where(and(eq(todos.id, id), eq(todos.userId, result.data.user.id)));

  revalidatePath('/');
}

export async function deleteTodo(id: string) {
  const result: any = await authServer.getSession();
  if (!result?.data?.user) {
    throw new Error('Not authenticated');
  }

  await db
    .delete(todos)
    .where(and(eq(todos.id, id), eq(todos.userId, result.data.user.id)));

  revalidatePath('/');
}

