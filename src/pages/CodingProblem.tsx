import React, { useState } from 'react';
import { CodeEditor } from '../components/CodeEditor';
import { codingProblems } from '../data/codingProblems';

export const CodingProblem: React.FC = () => {
  const [selectedProblem] = useState(codingProblems[1]);
  const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
  const [code, setCode] = useState(selectedProblem.starterCode[language]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Get the first example input and output
      const example = selectedProblem.examples[0];
      
      const response = await fetch('http://localhost:5000/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          input: example.input,
          output: example.output,
          userId: '681b134dc1099d2a69261d6a', // Replace with actual user ID
        }),
      });

      const data = await response.json();
      
      // Poll for results
      const pollInterval = setInterval(async () => {
        const resultResponse = await fetch(`http://localhost:5000/api/submissions/${data.submissionId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const resultData = await resultResponse.json();
        
        if (resultData.status === 'completed' || resultData.status === 'failed') {
          clearInterval(pollInterval);
          setResult(resultData);
          setIsSubmitting(false);
        }
      }, 1000);

      // Clear interval after 30 seconds
      setTimeout(() => {
        clearInterval(pollInterval);
        setIsSubmitting(false);
      }, 30000);
    } catch (error) {
      console.error('Error submitting code:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-4">
        {/* Problem Description */}
        <div className="w-1/3 bg-base-200 p-4 rounded-lg">
          <h1 className="text-2xl font-bold mb-4">{selectedProblem.title}</h1>
          <div className="mb-4">
            <span className={`badge ${
              selectedProblem.difficulty === 'easy' ? 'badge-success' :
              selectedProblem.difficulty === 'medium' ? 'badge-warning' :
              'badge-error'
            }`}>
              {selectedProblem.difficulty}
            </span>
          </div>
          <div className="prose">
            <p>{selectedProblem.description}</p>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Examples:</h2>
            {selectedProblem.examples.map((example, index) => (
              <div key={index} className="mb-4">
                <p><strong>Input:</strong> {example.input}</p>
                <p><strong>Output:</strong> {example.output}</p>
                {example.explanation && (
                  <p><strong>Explanation:</strong> {example.explanation}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Code Editor */}
        <div className="w-2/3">
          <div className="bg-base-200 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="join">
                <button
                  className={`join-item btn ${language === 'javascript' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => {
                    setLanguage('javascript');
                    setCode(selectedProblem.starterCode.javascript);
                  }}
                >
                  JavaScript
                </button>
                <button
                  className={`join-item btn ${language === 'python' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => {
                    setLanguage('python');
                    setCode(selectedProblem.starterCode.python);
                  }}
                >
                  Python
                </button>
              </div>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
            <div className="h-[600px]">
              <CodeEditor
                problem={selectedProblem}
                onCodeChange={setCode}
                language={language}
              />
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="bg-base-200 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Results:</h2>
              <div className="prose">
                <p><strong>Status:</strong> {result.status}</p>
                {result.result && (
                  <>
                    <p><strong>Output:</strong> {result.result.stdout}</p>
                    {result.result.stderr && (
                      <p><strong>Error:</strong> {result.result.stderr}</p>
                    )}
                    <p><strong>Time:</strong> {result.result.time}</p>
                    <p><strong>Memory:</strong> {result.result.memory}</p>
                    <p><strong>Correct:</strong> {result.result.isCorrect ? 'Yes' : 'No'}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 