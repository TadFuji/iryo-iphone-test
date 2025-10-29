import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface FinalReportProps {
  report: string;
  questionCount: number;
  confidence: number;
  onNewConsultation: () => void;
}

export function FinalReport({ report, questionCount, confidence, onNewConsultation }: FinalReportProps) {
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([report], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `医療問診レポート_${new Date().toLocaleDateString("ja-JP")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const parseReport = (text: string) => {
    const sections = text.split(/■/g).filter(Boolean);
    return sections;
  };

  const reportSections = parseReport(report);

  return (
    <div className="flex-1 overflow-y-auto pb-6" data-testid="final-report">
      <div className="px-6 py-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
            <FileText className="w-8 h-8" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              問診結果のご報告
            </h1>
            <p className="text-sm text-muted-foreground">
              合計質問回数：{questionCount}回
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-base font-semibold">AI確信度: {confidence}%</span>
          </div>
        </div>

        <Separator />

        <div className="prose prose-sm max-w-none space-y-6">
          <p className="text-base text-foreground leading-relaxed">
            詳細なご回答ありがとうございました。お伺いした内容を基に、AIが分析した結果をご報告します。
          </p>

          {reportSections.map((section, index) => {
            const lines = section.trim().split("\n");
            const title = lines[0];
            const content = lines.slice(1).join("\n");

            return (
              <div key={index} className="space-y-3">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  ■ {title}
                </h2>
                <div className="text-base text-foreground leading-relaxed whitespace-pre-wrap">
                  {content}
                </div>
              </div>
            );
          })}
        </div>

        <Separator />

        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-2">
          <p className="font-bold text-destructive flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            重要なお願い（再掲）
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            この結果はAIによる情報提供であり、医師の診断ではありません。診断や治療方針の決定には、必ず医師の診察が必要です。この結果を持参して、医療機関にご相談ください。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleDownload}
            className="h-12 text-base"
            data-testid="button-download-report"
          >
            <Download className="w-5 h-5 mr-2" />
            レポートをダウンロード
          </Button>
          
          <Button
            onClick={onNewConsultation}
            className="h-12 text-base font-semibold"
            data-testid="button-new-consultation"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            新規問診を開始
          </Button>
        </div>
      </div>
    </div>
  );
}
