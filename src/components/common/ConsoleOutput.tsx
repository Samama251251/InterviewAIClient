import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

interface ConsoleOutput {
  type: "input" | "output" | "error";
  content: string;
  timestamp: string;
}

interface ConsoleOutputProps {
  outputs: ConsoleOutput[];
  onClear: () => void;
  isVisible: boolean;
  onToggle: () => void;
}

const ConsoleOutput = ({
  outputs,
  onClear,
  isVisible,
  onToggle,
}: ConsoleOutputProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="border-t border-border bg-card"
        >
          <div className="flex items-center justify-between p-2 border-b border-border bg-muted/50">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
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
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                }
              >
                Console
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={onClear}>
              Clear
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-h-[300px] overflow-auto font-mono text-sm p-4 space-y-2"
          >
            {outputs.map((output, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-2 rounded-lg ${
                  output.type === "error"
                    ? "bg-red-500/10 text-red-500"
                    : output.type === "input"
                    ? "bg-muted/50 text-muted-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs text-muted-foreground shrink-0">
                    {output.timestamp}
                  </span>
                  <pre className="whitespace-pre-wrap break-words flex-1">
                    {output.content}
                  </pre>
                </div>
              </motion.div>
            ))}

            {outputs.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No output to display
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConsoleOutput;
