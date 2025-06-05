import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
});

export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  videoUrl: text("video_url").notNull(),
  videoDuration: text("video_duration").notNull(),
  orderIndex: integer("order_index").notNull(),
  isLocked: boolean("is_locked").default(true),
});

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull(),
  questions: json("questions").notNull().$type<QuizQuestion[]>(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  moduleId: integer("module_id").notNull(),
  completed: boolean("completed").default(false),
  quizScore: integer("quiz_score"),
  labCompleted: boolean("lab_completed").default(false),
  lastAccessed: timestamp("last_accessed").defaultNow(),
});

export const sqlLabs = pgTable("sql_labs", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull(),
  initialQuery: text("initial_query").notNull(),
  expectedResult: json("expected_result").notNull().$type<any[]>(),
  instructions: text("instructions").notNull(),
});

export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertModuleSchema = createInsertSchema(modules).omit({
  id: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  lastAccessed: true,
});

export const insertSqlLabSchema = createInsertSchema(sqlLabs).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modules.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertSqlLab = z.infer<typeof insertSqlLabSchema>;
export type SqlLab = typeof sqlLabs.$inferSelect;
