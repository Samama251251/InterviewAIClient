import React from 'react';
import { motion } from 'framer-motion';

interface ResultPanelProps {
  result: any;
  error?: string;
  onRetry?: () => void;
}

const StatusIcon = ({ correct, error }: { correct?: boolean; error?: boolean }) => {
  if (error) return <span className="text-2xl text-error">❗</span>;
  if (correct) return <span className="text-2xl text-success">✔️</span>;
  return <span className="text-2xl text-error">❌</span>;
};

export const ResultPanel: React.FC<ResultPanelProps> = ({ result, error, onRetry }) => {
  if (error) {
    return (
      <motion.div
        className="bg-error/90 text-white p-6 rounded-lg mb-4 flex flex-col items-center shadow-lg border-l-8 border-error"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <StatusIcon error />
          <span className="font-bold text-lg">Error</span>
        </div>
        <pre className="bg-error/70 rounded p-3 w-full overflow-x-auto text-sm mb-2"><code>{error}</code></pre>
        {onRetry && (
          <button className="btn btn-sm btn-white mt-2" onClick={onRetry}>Retry</button>
        )}
      </motion.div>
    );
  }
  if (!result) return null;
  const isCorrect = result.result?.isCorrect;
  const isError = !!result.result?.stderr;
  return (
    <motion.div
      className={`p-6 rounded-lg mb-4 shadow-lg border-l-8 ${isCorrect ? 'border-success bg-success/10' : isError ? 'border-error bg-error/10' : 'border-warning bg-warning/10'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <StatusIcon correct={isCorrect} error={isError} />
        <h2 className="text-xl font-semibold">Results</h2>
        {isCorrect && <span className="ml-2 text-success font-bold">Correct</span>}
        {!isCorrect && !isError && <span className="ml-2 text-warning font-bold">Incorrect</span>}
        {isError && <span className="ml-2 text-error font-bold">Error</span>}
      </div>
      <div className="prose max-w-none">
        <p><strong>Status:</strong> {result.status}</p>
        {result.result && (
          <>
            <p><strong>Output:</strong></p>
            <pre className="bg-base-300 rounded p-3 w-full overflow-x-auto text-sm mb-2"><code>{result.result.stdout || '-'}</code></pre>
            {result.result.stderr && (
              <>
                <p><strong>Error:</strong></p>
                <pre className="bg-error/20 text-error rounded p-3 w-full overflow-x-auto text-sm mb-2"><code>{result.result.stderr}</code></pre>
              </>
            )}
            <div className="flex gap-6 mt-2 text-xs text-base-content/70">
              <span><strong>Time:</strong> {result.result.time} s</span>
              <span><strong>Memory:</strong> {result.result.memory} KB</span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}; 