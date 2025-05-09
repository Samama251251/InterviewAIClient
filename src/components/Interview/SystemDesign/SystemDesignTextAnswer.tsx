import React from 'react';

interface SystemDesignTextAnswerProps {
  answer: string;
  onAnswerChange: (answer: string) => void;
  readOnly?: boolean;
}

const SystemDesignTextAnswer: React.FC<SystemDesignTextAnswerProps> = ({
  answer,
  onAnswerChange,
  readOnly = false
}) => {
  return (
    <div className="h-full flex flex-col">
      <h3 className="font-medium text-lg mb-4">Your Solution Description</h3>
      
      <div className="flex-grow bg-base-100 rounded-lg overflow-hidden border border-base-300">
        <textarea
          className="w-full h-full p-4 bg-base-100 resize-none focus:outline-none"
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Describe your solution approach, key components, trade-offs, and any additional considerations..."
          disabled={readOnly}
        />
      </div>
      
      {!readOnly && (
        <div className="mt-2 text-sm text-base-content/70">
          <p>Include details that complement your diagram. Explain your reasoning, scalability considerations, and any trade-offs.</p>
        </div>
      )}
    </div>
  );
};

export default SystemDesignTextAnswer; 