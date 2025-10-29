import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { DisclaimerModal } from "@/components/DisclaimerModal";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { ProgressBar } from "@/components/ProgressBar";
import { EmergencyBanner } from "@/components/EmergencyBanner";
import { TypingIndicator } from "@/components/TypingIndicator";
import { FinalReport } from "@/components/FinalReport";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, Stethoscope } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ConversationState, ChatResponse, Message } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [isEmergency, setIsEmergency] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [finalReport, setFinalReport] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom && messages.length > 0);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const savedState = localStorage.getItem("medicalConsultation");
    if (savedState) {
      try {
        const state: ConversationState = JSON.parse(savedState);
        setConversationId(state.id);
        setMessages(state.messages);
        setQuestionCount(state.questionCount);
        setConfidence(state.confidence);
        setIsEmergency(state.isEmergency);
        setIsComplete(state.status === "completed" || state.status === "emergency");
        setFinalReport(state.finalReport || null);
        setShowDisclaimer(false);
      } catch (error) {
        console.error("Failed to restore conversation:", error);
      }
    }
  }, []);

  const sendMessageMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const res = await apiRequest(
        "POST",
        "/api/chat",
        {
          conversationId,
          message: userMessage,
        }
      );

      const response: ChatResponse = await res.json();
      return response;
    },
    onSuccess: (response) => {
      setConversationId(response.conversationId);
      setQuestionCount(response.questionCount);
      setConfidence(response.confidence);
      setIsEmergency(response.isEmergency);
      setIsComplete(response.isComplete);
      
      if (response.finalReport) {
        setFinalReport(response.finalReport);
      }

      setMessages((prev) => {
        const newMessages = [...prev, response.userMessage, response.assistantMessage];
        
        const newState: ConversationState = {
          id: response.conversationId,
          messages: newMessages,
          questionCount: response.questionCount,
          confidence: response.confidence,
          isEmergency: response.isEmergency,
          status: response.isComplete ? "completed" : response.isEmergency ? "emergency" : "active",
          finalReport: response.finalReport,
        };
        
        localStorage.setItem("medicalConsultation", JSON.stringify(newState));
        return newMessages;
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "エラーが発生しました",
        description: error.message || "メッセージの送信に失敗しました。もう一度お試しください。",
      });
    },
  });

  const handleAcceptDisclaimer = () => {
    setShowDisclaimer(false);
    
    const initialMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: "まず、現在最もお困りの症状は何ですか？一つ教えてください。",
      timestamp: Date.now(),
    };
    
    setMessages([initialMessage]);
    setQuestionCount(0);
    setConfidence(0);
    
    const tempId = `temp-${Date.now()}`;
    const newState: ConversationState = {
      id: tempId,
      messages: [initialMessage],
      questionCount: 0,
      confidence: 0,
      isEmergency: false,
      status: "active",
      finalReport: undefined,
    };
    
    localStorage.setItem("medicalConsultation", JSON.stringify(newState));
  };

  const handleSendMessage = (message: string) => {
    if (!isComplete && !isEmergency) {
      sendMessageMutation.mutate(message);
    }
  };

  const handleNewConsultation = () => {
    localStorage.removeItem("medicalConsultation");
    setConversationId(null);
    setMessages([]);
    setQuestionCount(0);
    setConfidence(0);
    setIsEmergency(false);
    setIsComplete(false);
    setFinalReport(null);
    setShowDisclaimer(true);
  };

  if (isComplete && finalReport) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-primary" />
              <h1 className="text-lg font-semibold text-foreground">医療問診AI</h1>
            </div>
          </div>
        </header>

        <FinalReport
          report={finalReport}
          questionCount={questionCount}
          confidence={confidence}
          onNewConsultation={handleNewConsultation}
        />
      </div>
    );
  }

  return (
    <>
      <DisclaimerModal open={showDisclaimer} onAccept={handleAcceptDisclaimer} />

      <div className="flex flex-col h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-primary" />
              <h1 className="text-lg font-semibold text-foreground">医療問診AI</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNewConsultation}
              data-testid="button-menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          {messages.length > 0 && (
            <ProgressBar questionCount={questionCount} confidence={confidence} />
          )}
        </header>

        {isEmergency && <EmergencyBanner />}

        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto"
          data-testid="chat-container"
        >
          <div className="space-y-2 py-4">
            {messages.filter(m => m && m.id).map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {sendMessageMutation.isPending && <TypingIndicator />}
          </div>

          <div ref={messagesEndRef} />
        </div>

        {showScrollButton && (
          <Button
            onClick={scrollToBottom}
            size="icon"
            className="fixed bottom-24 right-4 rounded-full shadow-lg z-10"
            data-testid="button-scroll-bottom"
          >
            <ChevronDown className="w-5 h-5" />
          </Button>
        )}

        <ChatInput
          onSend={handleSendMessage}
          disabled={sendMessageMutation.isPending || isEmergency || isComplete}
          placeholder={
            isEmergency
              ? "緊急の状態です。すぐに医療機関へ"
              : isComplete
              ? "問診が完了しました"
              : "ご回答を入力してください..."
          }
        />
      </div>
    </>
  );
}
