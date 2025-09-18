// Utility functions for encoding/decoding puzzles

export const decodeBase64 = (encoded: string): string => {
  try {
    return atob(encoded);
  } catch {
    return '';
  }
};

export const encodeBase64 = (text: string): string => {
  return btoa(text);
};

export const decodeROT13 = (text: string): string => {
  return text.replace(/[a-zA-Z]/g, (char) => {
    const start = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start);
  });
};

export const encodeROT13 = (text: string): string => {
  return decodeROT13(text); // ROT13 is its own inverse
};

export const normalizeAnswer = (answer: string): string => {
  return answer.toLowerCase().trim().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ');
};

export const checkAnswer = (userAnswer: string, expectedAnswer: string): boolean => {
  return normalizeAnswer(userAnswer) === normalizeAnswer(expectedAnswer);
};

export const unscrambleHint = (scrambled: string): string[] => {
  // For word scrambles, provide hints by showing word lengths
  const words = scrambled.split(' ');
  return words.map(word => '_'.repeat(word.length));
};

export const decodeMultiStep = (encoded: string, steps: string[]): string => {
  let result = encoded;
  
  for (const step of steps) {
    if (step.includes('ROT13')) {
      result = decodeROT13(result);
    } else if (step.includes('Base64')) {
      result = decodeBase64(result);
    }
  }
  
  return result;
};