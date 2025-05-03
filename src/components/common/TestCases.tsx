import { motion } from "framer-motion";
import Button from "./Button";

interface TestCase {
  id: number;
  input: string;
  output: string;
  explanation: string;
}

interface TestCasesProps {
  testCases: TestCase[];
  onRunTest: (input: string) => void;
  isRunning: boolean;
}

const TestCases = ({ testCases, onRunTest, isRunning }: TestCasesProps) => {
  return (
    <div className="space-y-4">
      {testCases.map((testCase) => (
        <motion.div
          key={testCase.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm text-foreground">
              Test Case {testCase.id}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRunTest(testCase.input)}
              isLoading={isRunning}
              leftIcon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            >
              Run Test
            </Button>
          </div>

          <div className="space-y-2">
            <div className="bg-background/50 rounded-md p-3 font-mono">
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Input:
              </div>
              <pre className="text-sm text-foreground whitespace-pre-wrap break-words">
                {testCase.input}
              </pre>
            </div>

            <div className="bg-background/50 rounded-md p-3 font-mono">
              <div className="text-xs font-medium text-muted-foreground mb-1">
                Expected Output:
              </div>
              <pre className="text-sm text-foreground whitespace-pre-wrap break-words">
                {testCase.output}
              </pre>
            </div>

            {testCase.explanation && (
              <div className="bg-background/50 rounded-md p-3">
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  Explanation:
                </div>
                <p className="text-sm text-foreground font-mono whitespace-pre-wrap break-words">
                  {testCase.explanation}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      ))}

      {testCases.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No test cases available
        </div>
      )}
    </div>
  );
};

export default TestCases;
