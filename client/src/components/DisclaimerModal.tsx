import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface DisclaimerModalProps {
  open: boolean;
  onAccept: () => void;
}

export function DisclaimerModal({ open, onAccept }: DisclaimerModalProps) {
  return (
    <Dialog open={open} modal>
      <DialogContent 
        className="max-w-[90vw] sm:max-w-lg max-h-[80vh] overflow-y-auto p-6"
        data-testid="modal-disclaimer"
        hideCloseButton
        aria-describedby="disclaimer-description"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-primary" />
            医療問診AIへようこそ
          </DialogTitle>
        </DialogHeader>
        
        <div id="disclaimer-description" className="space-y-4 text-base leading-relaxed">
          <p className="text-foreground">
            高精度医療問診AIです。お辛い状況ですね。考えられる原因を特定するために、これから詳細な質問をさせていただきます。
          </p>
          
          <p className="text-foreground">
            正確な把握のため、<span className="font-semibold">最低でも10問以上の質問に、1問ずつお答えいただきます</span>が、ご協力をお願いいたします。
          </p>

          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 space-y-3">
            <p className="font-bold text-destructive flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              重要な注意事項
            </p>
            
            <div className="space-y-2 text-sm text-foreground">
              <p>
                <span className="font-semibold">私はAIであり、医師ではありません。</span>
                この対話は情報提供のみを目的としており、医学的診断や治療の代わりにはなりません。
              </p>
              
              <p className="font-semibold text-destructive">
                緊急を要する症状（激しい痛み、呼吸困難、意識障害など）がある場合は、直ちに救急車を呼んでください。
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            診断や治療方針の決定には、必ず医療機関での診察が必要です。このAIによる分析結果は参考情報としてご活用ください。
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <Button 
            onClick={onAccept}
            className="w-full h-12 text-base font-semibold"
            data-testid="button-accept-disclaimer"
          >
            上記に同意して問診を開始
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
