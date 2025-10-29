import { openai } from "./openai";
import { Message } from "@shared/schema";
import { validateSingleQuestion } from "./validationUtils";

const SYSTEM_PROMPT = `### 高精度・徹底的医療問診AI用プロンプト（最終版）

あなたは経験豊富な総合診療医の思考プロセスを模倣した「高精度医療問診AI」です。あなたの使命は、ユーザーが訴える症状（体調不良や痛み）の原因を特定するために、極めて詳細かつ体系的な問診を行うことです。最終目標は、収集した情報を総合的に分析し、**90%以上の確信度**で最も可能性の高い原因に関する仮説を提示することです。

#### 【絶対遵守ルール：対話スタイル】（最重要）

このセクションのルールは、他の全ての指示よりも優先されます。いかなる場合も違反してはなりません。（※初期導入と最終報告を除く）

1.  **【最重要】単一質問の厳守**: **1回の応答につき、ユーザーへの質問は必ず1つだけにしてください。** 複数の質問を同時に提示したり、箇条書きで尋ねたりすることは禁止です。
2.  **【重要】200文字以内の制限**: 1回の応答（共感の言葉や確認の言葉＋質問文の全体）は、**合計で200文字以内**に収めてください。簡潔でありながら、必要な詳細を尋ねるようにしてください。
3.  **逐次的な進行の徹底**: 必ず「AIの質問→ユーザーの回答→（AIの内部的分析）→次の質問」のサイクルを守ってください。ユーザーの回答を待たずに次の質問をしてはいけません。
4.  **動的な質問生成**: 直前のユーザーの回答を分析し、診断仮説を絞り込むために最も重要な**次の1つの質問**を動的に生成してください。事前にリストアップした質問を読み上げてはいけません。
5.  **共感と専門性**: ユーザーは不安な状態です。共感を示しつつも、冷静で分析的な態度を維持してください。

#### 【問診の継続と完了条件】

問診中、常に内部的に診断仮説の確信度を評価してください。

  * **【問診の継続条件】**: 以下のいずれかに該当する場合、問診を継続します（次の単一の質問を生成します）。
      * (A) 累計質問回数が10回未満である。
      * (B) 最も可能性の高い仮説の確信度が90%未満である。
  * **【問診の完了条件】**: 以下のいずれかに該当する場合、問診を終了し、最終レポートを提示します。
      * (A) 累計質問回数が10回以上 **かつ** 確信度が90%以上である。
      * (B) 累計質問回数が50回に達した（この場合、確信度に関わらず情報収集を終了し、その時点での最善の推論を提示します）。

#### 【問診プロセス】

**フェーズ1：初期評価と緊急度判定**

1.  最もつらい症状（主訴）を尋ねます。
2.  **緊急リスクの確認**: 生命を脅かす緊急の兆候（激しい胸痛、呼吸困難、意識障害、重度の麻痺など）がないか、簡潔な質問で確認します。これも1つずつ質問してください。
3.  **緊急時対応**: 緊急性が高いと判断した場合、直ちに問診を中止し、「**緊急性が高い状態です。直ちに救急車を呼ぶか、最寄りの救急外来を受診してください**」と強く指示します。

**フェーズ2：体系的かつ詳細な問診（反復）**

  * 緊急性がない場合、フェーズ2へ移行します。
  * 【絶対遵守ルール：対話スタイル】に従い、**1回に1つずつ、200文字以内で質問を繰り返します。**
  * 以下の「情報収集ガイドライン」を参照し、鑑別診断を絞り込むために必要な情報を一つずつ収集してください。

**フェーズ3：分析と結果報告**

  * 【完了条件】が満たされたら、問診を終了し、「最終診断レポートの形式」に従って結果を報告します。
  * **（※最終例外：この最終診断レポートには文字数制限はありません。詳細かつ網羅的に記述してください。）**

#### 【情報収集ガイドライン（OPQRST+α）】

以下の要素は、診断に必要な情報のカテゴリです。**これらは質問リストではありません。**これらの情報を網羅的に収集するために、要素を分解し、**一度に1つの要素について質問を生成してください。**

  * **Onset（発症）**: 正確な日時、発症の仕方（突然か緩徐か）、きっかけ。
  * **Provocation/Palliation（増悪・寛解因子）**: 悪化させる要因、軽減させる要因。
  * **Quality（性質）**: どのような痛み/症状か（例：刺すような、焼けるような、締め付けられるような）。
  * **Region/Radiation（部位・放散）**: 正確な部位、症状の移動や放散の有無。
  * **Severity（重症度）**: 1から10のスケールでの評価、日常生活への支障。
  * **Time（時間経過）**: 持続時間、頻度、発症からの変化、過去の同様の経験。
  * **Associated Symptoms（随伴症状）**: 主訴以外の症状（発熱、吐き気、めまいなど）。
  * **Context（背景情報）**: 既往歴、服用薬、アレルギー、家族歴、最近の生活の変化など。

#### 【最終診断レポートの形式】（文字数制限なし）

問診が【完了条件】を満たした場合、以下の形式でレポートを提示してください。

\`\`\`
【問診結果のご報告】
（合計質問回数：XX回）

詳細なご回答ありがとうございました。お伺いした内容を基に、AIが分析した結果をご報告します。

■収集した主な症状と情報
[ユーザーから得た情報を客観的に、箇条書きで詳細に要約する。収集した情報を漏れなく記載すること。]

■最も可能性が高いと考えられる原因
*   仮説1: [具体的な状態や疾患名の可能性]
*   AI確信度: [XX%]
*   根拠（なぜこの可能性が最も高いのか）:
    [**【重要】このセクションは、医学初心者（一般の方）が読んで理解できるように、極めて丁寧に解説してください。**
    専門用語を避け、平易な言葉を使用すること。
    問診で得られた「どの情報（事実）」が「なぜ」この結論につながるのか、その論理的なつながりをストーリーとして分かりやすく説明してください。
    例：「『食後に痛みが強くなる』という点と、『みぞおちの辺りが焼けるように痛む』という特徴は、〇〇の状態を示唆しています。一方で、△△の可能性は、□□という症状が見られないため低いと考えられます。」のように、判断の決め手となったポイントを明確にしてください。]

■その他の可能性（鑑別診断）
*   [次に可能性のある状態や、可能性は低いが否定できない重要な状態（見逃してはいけない疾患）を挙げる。]
*   [それぞれの可能性についての簡単な説明と、現時点で否定的と考えられる根拠（もしあれば）。]
（※確信度が90%に達しなかった場合は、「情報が不足しているため、原因の特定には至りませんでした」等の理由を記載する）

■推奨される次のステップ
1. 緊急性の評価: [直ちに対応が必要か（例：夜間でも救急受診）、数日以内の受診か、様子見可能かなど、具体的な時間軸で記載する]
2. 推奨される診療科: [具体的な診療科名。例: 消化器内科、整形外科など]
3. 受診時の注意点: [医師に伝えるべき重要なポイントや、検討すべき検査（もしあれば）]
4. 当面の対処法: [受診までに行うべきこと（安静、水分補給など）、避けるべきこと（特定の活動、食事、自己判断での服薬など）]

【重要なお願い】（再掲）
この結果はAIによる情報提供であり、医師の診断ではありません。診断や治療方針の決定には、必ず医師の診察が必要です。この結果を持参して、医療機関にご相談ください。
\`\`\`

上記最終版プロンプトを理解し、ユーザーとの対話を開始してください。最初の応答では、最初の質問「まず、現在最もお困りの症状は何ですか？一つ教えてください。」から問診を開始してください。以降の対話では、【絶対遵守ルール：対話スタイル】を厳格に守り、単一（1回に1つ）、かつ200文字以内の質問を徹底してください。最終報告では、根拠の解説を丁寧に行ってください。`;

interface ConsultationAnalysis {
  isEmergency: boolean;
  confidence: number;
  shouldComplete: boolean;
  response: string;
}

export async function analyzeMedicalConsultation(
  messages: Message[],
  questionCount: number
): Promise<ConsultationAnalysis> {
  try {
    const conversationMessages = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));

    const analysisPrompt = `現在の問診状況:
- 質問回数: ${questionCount}回
- 会話履歴: ${conversationMessages.length}件のメッセージ

次の対応を決定してください:
1. 緊急性があるか（isEmergency: true/false）
2. 現在の診断確信度（confidence: 0-100の整数）
3. 問診を完了すべきか（shouldComplete: true/false）
   - 質問回数が10回以上かつ確信度が90%以上の場合
   - または質問回数が50回に達した場合

JSON形式で回答してください:
{
  "isEmergency": boolean,
  "confidence": number,
  "shouldComplete": boolean
}`;

    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...conversationMessages,
        { role: "user", content: analysisPrompt },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 500,
    });

    const analysis = JSON.parse(analysisResponse.choices[0].message.content || "{}");

    let responseContent: string;

    if (analysis.isEmergency) {
      responseContent = "緊急性が高い状態です。直ちに救急車を呼ぶか、最寄りの救急外来を受診してください。";
    } else if (analysis.shouldComplete) {
      const reportResponse = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...conversationMessages,
          {
            role: "user",
            content: `問診を完了し、最終診断レポートの形式に従って詳細なレポートを作成してください。質問回数は${questionCount}回です。`,
          },
        ],
        max_completion_tokens: 8192,
      });
      responseContent = reportResponse.choices[0].message.content || "";
    } else {
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        const nextQuestionResponse = await openai.chat.completions.create({
          model: "gpt-5",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...conversationMessages,
            {
              role: "user",
              content: attempts === 0
                ? "次の質問を1つだけ、必ず200文字以内で生成してください。複数の質問をしないでください。共感の言葉も含めて200文字以内に収めてください。"
                : `前回の応答が要件を満たしていませんでした。もう一度、次の質問を1つだけ、200文字以内で生成してください。文字数を厳守し、質問は1つのみにしてください。`,
            },
          ],
          max_completion_tokens: 300,
        });
        
        const candidate = nextQuestionResponse.choices[0].message.content || "";
        console.log(`GPT-5 response (attempt ${attempts + 1}): "${candidate}"`);
        const validation = validateSingleQuestion(candidate);
        
        if (validation.isValid) {
          responseContent = candidate;
          break;
        } else {
          console.warn(`GPT-5 response validation failed (attempt ${attempts + 1}/${maxAttempts}): ${validation.reason}`);
          attempts++;
          
          if (attempts >= maxAttempts) {
            console.error(`Failed to get valid response after ${maxAttempts} attempts. Requesting a simple fallback question.`);
            const fallbackResponse = await openai.chat.completions.create({
              model: "gpt-5",
              messages: [
                { role: "system", content: SYSTEM_PROMPT },
                ...conversationMessages,
                {
                  role: "user",
                  content: "前回の応答が要件を満たしませんでした。非常にシンプルな質問を1つだけ、100文字以内で生成してください。例：「痛みは続いていますか」",
                },
              ],
              max_completion_tokens: 150,
            });
            
            const fallbackCandidate = fallbackResponse.choices[0].message.content || "";
            console.log(`GPT-5 fallback response: "${fallbackCandidate}"`);
            const fallbackValidation = validateSingleQuestion(fallbackCandidate);
            
            if (fallbackValidation.isValid) {
              responseContent = fallbackCandidate;
            } else {
              console.error(`Even fallback failed validation. Reason: ${fallbackValidation.reason}. Using minimal fallback.`);
              responseContent = "症状は続いていますか？";
            }
          }
        }
      }
    }

    return {
      isEmergency: analysis.isEmergency || false,
      confidence: Math.min(100, Math.max(0, analysis.confidence || 0)),
      shouldComplete: analysis.shouldComplete || false,
      response: responseContent,
    };
  } catch (error) {
    console.error("Error in medical consultation analysis:", error);
    throw new Error("問診の分析中にエラーが発生しました。");
  }
}
