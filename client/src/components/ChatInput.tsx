import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder = "ご回答を入力してください..." }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
      
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 120;
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [input]);

  return (
    <div 
      className="sticky bottom-0 bg-background border-t border-border px-4 py-4 safe-bottom"
      style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom))" }}
      data-testid="chat-input-container"
    >
      <div className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "min-h-[44px] max-h-[120px] resize-none rounded-[20px] px-4 py-3 text-base leading-relaxed",
            "focus-visible:ring-2 focus-visible:ring-primary"
          )}
          style={{ lineHeight: "1.5" }}
          rows={1}
          data-testid="input-message"
        />
        
        <Button
          onClick={handleSubmit}
          disabled={!input.trim() || disabled}
          size="icon"
          className="h-11 w-11 rounded-full flex-shrink-0"
          data-testid="button-send"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
