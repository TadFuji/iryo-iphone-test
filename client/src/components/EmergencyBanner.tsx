import { AlertTriangle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmergencyBanner() {
  return (
    <div 
      className="mx-4 my-4 bg-destructive/10 border-2 border-destructive rounded-xl p-4 space-y-3"
      data-testid="banner-emergency"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-bold text-destructive">
            緊急性が高い状態です
          </h3>
          <p className="text-base text-foreground leading-relaxed">
            直ちに救急車を呼ぶか、最寄りの救急外来を受診してください。
          </p>
        </div>
      </div>

      <Button
        variant="destructive"
        className="w-full h-12 text-base font-semibold"
        onClick={() => window.location.href = "tel:119"}
        data-testid="button-call-emergency"
      >
        <Phone className="w-5 h-5 mr-2" />
        119番に電話する
      </Button>
    </div>
  );
}
