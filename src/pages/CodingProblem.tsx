import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CodeEditor } from '../components/Interview/Coding/CodeEditor';
import { codingProblems } from '../data/codingProblems';
import { LoadingOverlay } from '../components/common/LoadingOverlay';
import { ResultPanel } from '../components/common/ResultPanel';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import axios from 'axios';

export const CodingProblem: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const interviewId = searchParams.get('interviewId');
  const roundIndex = searchParams.get('roundIndex');

  // Get problems based on difficulty
  const easyProblems = codingProblems.filter(p => p.difficulty === 'easy');
  const mediumProblems = codingProblems.filter(p => p.difficulty === 'medium');
  const hardProblems = codingProblems.filter(p => p.difficulty === 'hard');

  // Select one problem from each difficulty
  const [selectedProblems] = useState(() => [
    easyProblems[Math.floor(Math.random() * easyProblems.length)],
    mediumProblems[Math.floor(Math.random() * mediumProblems.length)],
    hardProblems[Math.floor(Math.random() * hardProblems.length)]
  ]);

  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
  const [code, setCode] = useState(selectedProblems[0].starterCode[language]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [completedProblems, setCompletedProblems] = useState<boolean[]>([]);

  useEffect(() => {
    if (!interviewId || !roundIndex) {
      navigate('/candidate/interviews');
      return;
    }
  }, [interviewId, roundIndex, navigate]);

  const updateInterviewRound = async (score: number) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/interviews/${interviewId}/rounds`, {
        rounds: [{
          type: 'Coding',
          score: score,
          status: 'completed',
          remarks: `Completed ${completedProblems.filter(Boolean).length + 1}/3 problems`
        }]
      }, {
        withCredentials: true
      });

      if (response.data.status === 'success') {
        toast.success('Interview round updated successfully!');
      }
    } catch (error) {
      console.error('Error updating interview round:', error);
      toast.error('Failed to update interview round');
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setResult(null);
    setTimedOut(false);
    try {
      setIsSubmitting(true);
      const example = selectedProblems[currentProblemIndex].examples[0];
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/submissions`, {
        code,
        language,
        input: example.input,
        output: example.output,
      }, {
        withCredentials: true
      });
      
      if (!response.data) throw new Error('Failed to submit code');
      const data = response.data;
      
      const pollInterval = setInterval(async () => {
        try {
          const resultResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/submissions/${data.submissionId}`, {
            withCredentials: true
          });
          
          if (!resultResponse.data) throw new Error('Failed to fetch result');
          const resultData = resultResponse.data;
          if (resultData.status === 'completed' || resultData.status === 'failed') {
            clearInterval(pollInterval);
            setResult(resultData);
            setIsSubmitting(false);
            
            if (resultData.result && typeof resultData.result.isCorrect !== 'undefined') {
              if (resultData.result.isCorrect) {
                toast.success('🎉 Correct! Your code passed the test case.');
                const newScores = [...scores];
                newScores[currentProblemIndex] = 100;
                setScores(newScores);
                
                const newCompletedProblems = [...completedProblems];
                newCompletedProblems[currentProblemIndex] = true;
                setCompletedProblems(newCompletedProblems);

                // Calculate average score
                const averageScore = Math.round(newScores.reduce((a, b) => a + b, 0) / newScores.length);
                
                // Update interview round with score
                await updateInterviewRound(averageScore);

                // Move to next problem or finish interview
                if (currentProblemIndex < selectedProblems.length - 1) {
                  setTimeout(() => {
                    setCurrentProblemIndex(prev => prev + 1);
                    setCode(selectedProblems[currentProblemIndex + 1].starterCode[language]);
                  }, 2000);
                } else {
                  setTimeout(() => {
                    navigate('/candidate/interviews');
                  }, 2000);
                }
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

  const handleSkip = () => {
    const newScores = [...scores];
    newScores[currentProblemIndex] = 0;
    setScores(newScores);
    
    const newCompletedProblems = [...completedProblems];
    newCompletedProblems[currentProblemIndex] = true;
    setCompletedProblems(newCompletedProblems);

    // Calculate average score
    const averageScore = Math.round(newScores.reduce((a, b) => a + b, 0) / newScores.length);
    
    // Update interview round with score
    updateInterviewRound(averageScore);

    // Move to next problem or finish interview
    if (currentProblemIndex < selectedProblems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1);
      setCode(selectedProblems[currentProblemIndex + 1].starterCode[language]);
    } else {
      navigate('/candidate/interviews');
    }
  };

  const handleRetry = () => {
    setError(null);
    setResult(null);
    setTimedOut(false);
    handleSubmit();
  };

  const currentProblem = selectedProblems[currentProblemIndex];

  return (
    <div className="min-h-screen bg-base-100">
      <div className="mx-auto py-8 px-2 max-w-[1600px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Problem Description */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="relative h-full">
              <div className="bg-base-200 rounded-2xl shadow-xl border-l-8 border-primary h-full flex flex-col p-8">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-extrabold text-primary tracking-tight leading-tight">
                    Problem {currentProblemIndex + 1} of 3
                  </h1>
                  <span className={`badge badge-lg text-base-100 ${
                    currentProblem.difficulty === 'easy' ? 'badge-success' :
                    currentProblem.difficulty === 'medium' ? 'badge-warning' :
                    'badge-error'
                  }`}>
                    {currentProblem.difficulty}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-base-content/90 mt-4 mb-2">Description</h2>
                <div className="prose prose-sm lg:prose-base max-w-none text-base-content/90 leading-relaxed">
                  {currentProblem.description.split(/(\d+\.)/g).map((part, idx) =>
                    /^\d+\.$/.test(part) ? (
                      <span key={idx} className="block font-semibold text-primary mt-2">{part}</span>
                    ) : (
                      <span key={idx}>{part}</span>
                    )
                  )}
                </div>
                <h2 className="text-lg font-bold text-primary mt-6 mb-3">Examples</h2>
                <div className="flex flex-col gap-4">
                  {currentProblem.examples.map((example, index) => (
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
                      setCode(currentProblem.starterCode.javascript);
                    }}
                    disabled={isSubmitting}
                  >
                    JavaScript
                  </button>
                  <button
                    className={`join-item btn ${language === 'python' ? 'btn-primary' : 'btn-ghost'} transition-all`}
                    onClick={() => {
                      setLanguage('python');
                      setCode(currentProblem.starterCode.python);
                    }}
                    disabled={isSubmitting}
                  >
                    Python
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    className="btn btn-error btn-lg transition-all shadow-md"
                    onClick={handleSkip}
                    disabled={isSubmitting}
                  >
                    Skip Problem
                  </button>
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
              </div>
              <div className="h-[60vh] min-h-[350px] max-h-[700px] relative rounded-lg overflow-hidden border border-base-300">
                <CodeEditor
                  problem={currentProblem}
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