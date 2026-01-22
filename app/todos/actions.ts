'use server';

import db from '@/lib/db';
import { todos, users } from '@/lib/schema';
import { authServer } from '@/lib/auth/server';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

async function ensureUserSynced(sessionUser: any) {
  await db.insert(users)
    .values({
      userId: sessionUser.id,
      email: sessionUser.email,
      name: sessionUser.name,
    })
    .onConflictDoUpdate({
      target: users.userId,
      set: {
        email: sessionUser.email,
        name: sessionUser.name,
        updatedAt: new Date(),
      }
    });
}

export async function addTodo(text: string) {
  const result: any = await authServer.getSession();
  if (!result?.data?.user) {
    throw new Error('Not authenticated');
  }

  await ensureUserSynced(result.data.user);

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

  await ensureUserSynced(result.data.user);

  await db
    .update(todos)
    .set({ completed, updatedAt: new Date() })
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

