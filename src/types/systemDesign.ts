/**
 * Represents a system design question
 */
export interface SystemDesignQuestion {
  question: string;
  difficulty: string;
}

/**
 * Represents a system design submission to be sent to the server
 */
export interface SystemDesignSubmission {
  question: string;
  answer: string;
  designed_system_image_base64: string;
}

/**
 * Request payload for submitting system design answers
 */
export interface SystemDesignSubmitRequest {
  interviewId: string;
  submissions: SystemDesignSubmission[];
}

/**
 * Response from the system design submission endpoint
 */
export interface SystemDesignSubmitResponse {
  status: string;
  message: string;
}

/**
 * Response from fetching system design questions
 */
export interface SystemDesignQuestionsResponse {
  status: string;
  data: SystemDesignQuestion[];
}

/**
 * Represents the evaluation result from the AI service
 */
export interface SystemDesignEvaluation {
  score: number;
  feedback: string;
} 