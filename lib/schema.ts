import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable("users", {
  userId: text("user_id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const todos = pgTable(
  "todos",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    text: text("text").notNull(),
    completed: boolean("completed").default(false).notNull(),
    userId: text("userId").references(() => users.userId),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;

export type SerializedTodo = Omit<Todo, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};


