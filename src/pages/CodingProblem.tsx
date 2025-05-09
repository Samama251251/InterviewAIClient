import React, { useState } from 'react';
import { CodeEditor } from '../components/CodeEditor';
import { codingProblems } from '../data/codingProblems';
import { LoadingOverlay } from '../components/common/LoadingOverlay';
import { ResultPanel } from '../components/common/ResultPanel';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

export const CodingProblem: React.FC = () => {
  const [selectedProblem] = useState(codingProblems[1]);
  const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
  const [code, setCode] = useState(selectedProblem.starterCode[language]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setResult(null);
    setTimedOut(false);
    try {
      setIsSubmitting(true);
      // Get the first example input and output
      const example = selectedProblem.examples[0];
      const response = await fetch('http://localhost:5000/api/submissions', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          input: example.input,
          output: example.output,
        }),
      });
      if (!response.ok) throw new Error('Failed to submit code');
      const data = await response.json();
      // Poll for results
      const pollInterval = setInterval(async () => {
        try {
          const resultResponse = await fetch(`http://localhost:5000/api/submissions/${data.submissionId}`, {
            credentials: 'include',
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!resultResponse.ok) throw new Error('Failed to fetch result');
          const resultData = await resultResponse.json();
          if (resultData.status === 'completed' || resultData.status === 'failed') {
            clearInterval(pollInterval);
            setResult(resultData);
            setIsSubmitting(false);
            // Show toast based on result
            if (resultData.result && typeof resultData.result.isCorrect !== 'undefined') {
              if (resultData.result.isCorrect) {
                toast.success('🎉 Correct! Your code passed the test case.');
              } else {
                toast.error('❌ Incorrect. Your code did not pass the test case.');
              }
            }
          }
        } catch {
          clearInterval(pollInterval);
          setError('Error fetching result. Please try again.');
          setIsSubmitting(false);
          toast.error('Error fetching result. Please try again.');
        }
      }, 1000);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Error submitting code');
      setIsSubmitting(false);
      toast.error(error instanceof Error ? error.message : 'Error submitting code');
    }
  };

  const handleRetry = () => {
    setError(null);
    setResult(null);
    setTimedOut(false);
    handleSubmit();
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="mx-auto py-8 px-2 max-w-[1600px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Problem Description */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="relative h-full">
              <div className="bg-base-200 rounded-2xl shadow-xl border-l-8 border-primary h-full flex flex-col p-8">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-extrabold text-primary tracking-tight leading-tight">{selectedProblem.title}</h1>
                  <span className={`badge badge-lg text-base-100 ${
                    selectedProblem.difficulty === 'easy' ? 'badge-success' :
                    selectedProblem.difficulty === 'medium' ? 'badge-warning' :
                    'badge-error'
                  }`}>
                    {selectedProblem.difficulty}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-base-content/90 mt-4 mb-2">Description</h2>
                <div className="prose prose-sm lg:prose-base max-w-none text-base-content/90 leading-relaxed">
                  {selectedProblem.description.split(/(\d+\.)/g).map((part, idx) =>
                    /^\d+\.$/.test(part) ? (
                      <span key={idx} className="block font-semibold text-primary mt-2">{part}</span>
                    ) : (
                      <span key={idx}>{part}</span>
                    )
                  )}
                </div>
                <h2 className="text-lg font-bold text-primary mt-6 mb-3">Examples</h2>
                <div className="flex flex-col gap-4">
                  {selectedProblem.examples.map((example, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.025, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.10)' }}
                      className="bg-base-100 border border-base-300 rounded-xl p-4 transition-all"
                    >
                      <div className="text-sm font-medium text-base-content/80 mb-1">
                        <span className="text-base-content/60">Input:</span> <span className="font-mono bg-base-200 px-1 py-0.5 rounded text-primary-content/90">{example.input}</span>
                      </div>
                      <div className="text-sm font-medium text-base-content/80 mb-1">
                        <span className="text-base-content/60">Output:</span> <span className="font-mono bg-base-200 px-1 py-0.5 rounded text-success-content/90">{example.output}</span>
                      </div>
                      {example.explanation && (
                        <div className="text-xs text-base-content/70 mt-1"><span className="font-semibold">Explanation:</span> {example.explanation}</div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Code Editor Section */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
            <div className="bg-base-200 p-4 sm:p-8 rounded-2xl shadow-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="join">
                  <button
                    className={`join-item btn ${language === 'javascript' ? 'btn-primary' : 'btn-ghost'} transition-all`}
                    onClick={() => {
                      setLanguage('javascript');
                      setCode(selectedProblem.starterCode.javascript);
                    }}
                    disabled={isSubmitting}
                  >
                    JavaScript
                  </button>
                  <button
                    className={`join-item btn ${language === 'python' ? 'btn-primary' : 'btn-ghost'} transition-all`}
                    onClick={() => {
                      setLanguage('python');
                      setCode(selectedProblem.starterCode.python);
                    }}
                    disabled={isSubmitting}
                  >
                    Python
                  </button>
                </div>
                <button
                  className="btn btn-primary btn-lg transition-all shadow-md"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
              <div className="h-[60vh] min-h-[350px] max-h-[700px] relative rounded-lg overflow-hidden border border-base-300">
                <CodeEditor
                  problem={selectedProblem}
                  onCodeChange={setCode}
                  language={language}
                />
                {isSubmitting && <LoadingOverlay message={timedOut ? 'Timed out...' : 'Evaluating...'} />}
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-base-200 p-4 sm:p-8 rounded-2xl shadow-xl">
              <ResultPanel result={result} error={error || undefined} onRetry={timedOut ? handleRetry : undefined} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 