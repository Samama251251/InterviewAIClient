import React from 'react';
import { SystemDesignQuestion } from '@/types/systemDesign';
import { QuestionData } from './SystemDesignQuestionPage';

interface SystemDesignSubmissionViewProps {
  questions: SystemDesignQuestion[];
  questionsData: Record<number, QuestionData>;
}

const SystemDesignSubmissionView: React.FC<SystemDesignSubmissionViewProps> = ({
  questions,
  questionsData,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Your Submissions</h2>
      <div className="max-w-3xl w-full">
        {questions.map((question, index) => {
          const data = questionsData[index];
          return (
            <div key={index} className="mb-10 border border-base-300 rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">{question.question}</h3>
              
              {/* Text answer */}
              {data?.textAnswer && (
                <div className="mb-4">
                  <h4 className="font-medium text-base mb-2">Your Description:</h4>
                  <div className="p-3 bg-base-200 rounded-md whitespace-pre-wrap">
                    {data.textAnswer}
                  </div>
                </div>
              )}
              
              {/* Diagram */}
              <h4 className="font-medium text-base mb-2">Your Diagram:</h4>
              {data?.screenshot ? (
                <div className="border border-base-200 rounded-md overflow-hidden">
                  <img 
                    src={data.screenshot} 
                    alt={`Design for ${question.question}`}
                    className="max-w-full h-auto"
                  />
                </div>
              ) : (
                <div className="text-center p-6 bg-base-200 text-base-content/70">
                  No diagram submitted for this question
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SystemDesignSubmissionView; 