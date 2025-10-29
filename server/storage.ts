import { type Conversation, type InsertConversation, type Message } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation>;
}

export class MemStorage implements IStorage {
  private conversations: Map<string, Conversation>;

  constructor() {
    this.conversations = new Map();
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const id = randomUUID();
    const now = new Date();
    const conversation: Conversation = {
      id,
      status: "active",
      questionCount: 0,
      confidence: 0,
      isEmergency: 0,
      messages: [],
      finalReport: null,
      createdAt: now,
      updatedAt: now,
      ...insertConversation,
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation> {
    const conversation = this.conversations.get(id);
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const updatedConversation: Conversation = {
      ...conversation,
      ...updates,
      updatedAt: new Date(),
    };

    this.conversations.set(id, updatedConversation);
    return updatedConversation;
  }
}

export const storage = new MemStorage();
