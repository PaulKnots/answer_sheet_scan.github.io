
export enum AppState {
  KEY_ENTRY = 'KEY_ENTRY',
  SCANNING = 'SCANNING',
  GRADING = 'GRADING',
  RESULTS = 'RESULTS',
}

// Represents the answers for a sheet, mapping question number to the selected option.
export interface Answers {
  [questionNumber: string]: string; // e.g., { '1': 'A', '2': 'C', ... '60': 'BLANK' }
}

export interface GradedResultDetail {
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface GradedResult {
  score: number;
  total: number;
  details: {
    [questionNumber: string]: GradedResultDetail;
  };
}
