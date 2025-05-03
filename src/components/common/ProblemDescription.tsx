import { motion } from "framer-motion";

interface Example {
  input: string;
  output: string;
  explanation: string;
}

interface ProblemDescriptionProps {
  description: string;
  examples: Example[];
  constraints: string[];
}

const ProblemDescription = ({
  description,
  examples,
  constraints,
}: ProblemDescriptionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Problem Description */}
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <p className="text-foreground text-base leading-relaxed whitespace-pre-wrap">
          {description}
        </p>
      </div>

      {/* Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Examples:</h3>
        {examples.map((example, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-muted/50 rounded-lg p-4 space-y-2"
          >
            <div>
              <span className="font-medium text-sm">Example {index + 1}:</span>
            </div>
            <div className="bg-background/50 rounded-md p-3 font-mono text-sm">
              <div>
                <span className="text-primary">Input:</span> {example.input}
              </div>
              <div>
                <span className="text-primary">Output:</span> {example.output}
              </div>
              {example.explanation && (
                <div>
                  <span className="text-primary">Explanation:</span>{" "}
                  {example.explanation}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Constraints */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Constraints:
        </h3>
        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
          className="list-disc list-inside space-y-1 text-muted-foreground"
        >
          {constraints.map((constraint, index) => (
            <motion.li
              key={index}
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { opacity: 1, x: 0 },
              }}
              className="text-sm font-mono"
            >
              {constraint}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.div>
  );
};

export default ProblemDescription;
