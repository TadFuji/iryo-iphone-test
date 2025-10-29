import { Message } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center px-4 py-2" data-testid={`message-system-${message.id}`}>
        <div className="bg-muted/50 text-muted-foreground text-sm px-4 py-2 rounded-lg max-w-[85%] text-center">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
      data-testid={`message-${message.role}-${message.id}`}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div
        className={cn(
          "flex flex-col gap-1",
          isUser ? "items-end" : "items-start",
          "max-w-[85%]"
        )}
      >
        <div
          className={cn(
            "px-4 py-3 rounded-[18px] text-base leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-accent text-accent-foreground rounded-tl-sm"
          )}
          style={{ lineHeight: "1.75" }}
        >
          {message.content}
        </div>

        <div className="flex items-center gap-2 px-1">
          <span className="text-xs text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString("ja-JP", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {message.characterCount !== undefined && !isUser && (
            <span className="text-xs text-muted-foreground">
              ({message.characterCount}/200)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
