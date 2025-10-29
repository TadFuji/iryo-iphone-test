export interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

export function validateSingleQuestion(text: string): ValidationResult {
  if (text.length > 200) {
    return {
      isValid: false,
      reason: `応答が200文字を超えています（${text.length}文字）`,
    };
  }

  const questionMarkCount = (text.match(/[？?]/g) || []).length;
  
  if (questionMarkCount > 1) {
    return {
      isValid: false,
      reason: `複数の疑問符が含まれています（${questionMarkCount}個）`,
    };
  }

  const questionPatterns = [
    /ありましたか/g,
    /ありませんか/g,
    /しましたか/g,
    /いますか/g,
    /でしょうか/g,
    /ましたか/g,
    /ませんか/g,
    /ですか/g,
    /ますか/g,
  ];
  
  function countQuestionEndings(str: string): number {
    let count = 0;
    let remaining = str;
    
    for (const pattern of questionPatterns) {
      const matches = remaining.match(pattern);
      if (matches) {
        count += matches.length;
        for (const match of matches) {
          const index = remaining.indexOf(match);
          if (index !== -1) {
            remaining = remaining.substring(0, index) + 
                       ' '.repeat(match.length) + 
                       remaining.substring(index + match.length);
          }
        }
      }
    }
    
    return count;
  }

  const totalQuestionEndingsCount = countQuestionEndings(text);

  const hasQuestionMarkAfterEnding = /か[？?]/.test(text);
  
  let totalQuestionIndicators;
  if (hasQuestionMarkAfterEnding && questionMarkCount === 1 && totalQuestionEndingsCount === 1) {
    totalQuestionIndicators = 1;
  } else {
    totalQuestionIndicators = totalQuestionEndingsCount + questionMarkCount;
  }

  if (totalQuestionIndicators === 0) {
    const endsWithKa = /か[。、]?$/.test(text);
    if (!endsWithKa) {
      return {
        isValid: false,
        reason: "質問文が含まれていません（疑問符または質問終助詞が見つかりません）",
      };
    }
  }

  if (totalQuestionIndicators > 1) {
    return {
      isValid: false,
      reason: `複数の質問が含まれています（質問マーカー${totalQuestionIndicators}個検出）`,
    };
  }

  const sentences = text.split(/[。！!]/g).filter(s => {
    const trimmed = s.trim();
    return trimmed.length > 0 && !trimmed.match(/^[？?]+$/);
  });
  
  if (sentences.length > 2) {
    return {
      isValid: false,
      reason: `複数の文が含まれています（${sentences.length}個）。簡潔な1つの質問にしてください。`,
    };
  }

  if (sentences.length === 2) {
    const firstSentence = sentences[0];
    const secondSentence = sentences[1];
    
    const firstHasQuestion = countQuestionEndings(firstSentence) > 0 || firstSentence.match(/[？?]/);
    const secondHasQuestion = countQuestionEndings(secondSentence) > 0 || secondSentence.match(/[？?]/);
    
    if (firstHasQuestion && secondHasQuestion) {
      return {
        isValid: false,
        reason: "2つの文にそれぞれ質問が含まれています",
      };
    }
  }

  return { isValid: true };
}
