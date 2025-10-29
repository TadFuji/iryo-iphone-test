import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const conversations = pgTable("conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  status: text("status").notNull().default("active"),
  questionCount: integer("question_count").notNull().default(0),
  confidence: integer("confidence").default(0),
  isEmergency: integer("is_emergency").notNull().default(0),
  messages: jsonb("messages").notNull().default(sql`'[]'::jsonb`),
  finalReport: text("final_report"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  characterCount?: number;
}

export interface ChatRequest {
  conversationId?: string;
  message: string;
}

export interface ChatResponse {
  conversationId: string;
  userMessage: Message;
  assistantMessage: Message;
  questionCount: number;
  confidence: number;
  isEmergency: boolean;
  isComplete: boolean;
  finalReport?: string;
}

export interface ConversationState {
  id: string;
  status: "active" | "completed" | "emergency";
  messages: Message[];
  questionCount: number;
  confidence: number;
  isEmergency: boolean;
  finalReport?: string;
}
