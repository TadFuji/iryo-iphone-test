import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 px-4 py-3" data-testid="typing-indicator">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
        <Bot className="w-4 h-4" />
      </div>

      <div className="bg-accent text-accent-foreground px-4 py-3 rounded-[18px] rounded-tl-sm">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-accent-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-accent-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-accent-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
