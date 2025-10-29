import { Badge } from "@/components/ui/badge";

interface ProgressBarProps {
  questionCount: number;
  confidence: number;
}

export function ProgressBar({ questionCount, confidence }: ProgressBarProps) {
  return (
    <div 
      className="flex items-center justify-between px-4 py-3 bg-card border-b border-border"
      data-testid="progress-bar"
    >
      <Badge 
        variant="secondary" 
        className="text-sm font-medium px-3 py-1"
        data-testid="badge-question-count"
      >
        質問 {questionCount}/50
      </Badge>

      <Badge 
        variant="outline" 
        className="text-sm font-semibold px-3 py-1"
        data-testid="badge-confidence"
      >
        確信度 {confidence}%
      </Badge>
    </div>
  );
}
