import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeMedicalConsultation } from "./medicalConsultation";
import { ChatRequest, ChatResponse, Message } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/chat", async (req, res) => {
    try {
      const { conversationId, message } = req.body as ChatRequest;

      let conversation;
      let messages: Message[] = [];
      let questionCount = 0;

      if (conversationId) {
        conversation = await storage.getConversation(conversationId);
        if (conversation) {
          messages = Array.isArray(conversation.messages) ? conversation.messages as Message[] : [];
          questionCount = conversation.questionCount;
        }
      }

      if (!conversation) {
        conversation = await storage.createConversation({
          status: "active",
          questionCount: 0,
          confidence: 0,
          isEmergency: 0,
          messages: [],
        });
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: message,
        timestamp: Date.now(),
      };

      messages.push(userMessage);

      const analysis = await analyzeMedicalConsultation(messages, questionCount);

      console.log(`[Chat] Question count: ${questionCount}, Confidence: ${analysis.confidence}%, Emergency: ${analysis.isEmergency}, Complete: ${analysis.shouldComplete}`);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: analysis.response,
        timestamp: Date.now(),
        characterCount: analysis.response.length,
      };

      messages.push(assistantMessage);

      if (!analysis.shouldComplete && !analysis.isEmergency) {
        questionCount += 1;
      }

      const isComplete = analysis.shouldComplete || analysis.isEmergency;
      const finalReport = analysis.shouldComplete ? analysis.response : undefined;

      const updatedConversation = await storage.updateConversation(conversation.id, {
        messages: messages as any,
        questionCount,
        confidence: analysis.confidence,
        isEmergency: analysis.isEmergency ? 1 : 0,
        status: isComplete ? "completed" : analysis.isEmergency ? "emergency" : "active",
        finalReport: finalReport || null,
      });

      const response: ChatResponse = {
        conversationId: updatedConversation.id,
        userMessage,
        assistantMessage,
        questionCount,
        confidence: analysis.confidence,
        isEmergency: analysis.isEmergency,
        isComplete,
        finalReport,
      };

      res.json(response);
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "サーバーエラーが発生しました",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
