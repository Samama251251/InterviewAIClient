import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Resizable } from "re-resizable";
import Editor, { OnMount } from "@monaco-editor/react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import useHotkeys from "@/hooks/useHotkeys";
import EditorHeader from "@/components/common/EditorHeader";
import EditorToolbar from "@/components/common/EditorToolbar";
import ConsoleOutput from "@/components/common/ConsoleOutput";
import TestCases from "@/components/common/TestCases";
import ProblemDescription from "@/components/common/ProblemDescription";
import Button from "@/components/common/Button";
import type { editor } from "monaco-editor";

const SAMPLE_PROBLEM = {
  title: "3. Longest Substring Without Repeating Characters",
  difficulty: "Medium",
  likes: 32.5,
  dislikes: 1.4,
  companies: ["Amazon", "Microsoft", "Meta"],
  description: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
  examples: [
    {
      input: 's = "abcabcbb"',
      output: "3",
      explanation: 'The answer is "abc", with the length of 3.',
    },
    {
      input: 's = "bbbbb"',
      output: "1",
      explanation: 'The answer is "b", with the length of 1.',
    },
    {
      input: 's = "pwwkew"',
      output: "3",
      explanation:
        'The answer is "wke", with the length of 3.\nNotice that the answer must be a substring, "pwke" is a subsequence and not a substring.',
    },
  ],
  constraints: [
    "0 <= s.length <= 5 * 104",
    "s consists of English letters, digits, symbols and spaces.",
  ],
};

const SAMPLE_TESTCASES = [
  {
    id: 1,
    input: 's = "abcabcbb"',
    output: "3",
    explanation: "The longest substring without repeating characters is 'abc'",
  },
  {
    id: 2,
    input: 's = "bbbbb"',
    output: "1",
    explanation: "The longest substring without repeating characters is 'b'",
  },
  {
    id: 3,
    input: 's = "pwwkew"',
    output: "3",
    explanation: "The longest substring without repeating characters is 'wke'",
  },
];

interface ConsoleOutputItem {
  type: "input" | "output" | "error";
  content: string;
  timestamp: string;
}

type EditorInstance = editor.IStandaloneCodeEditor;

interface ResizeData {
  width: number;
  height: number;
}

interface ResizeEvent {
  e: MouseEvent | TouchEvent;
  direction: string;
  ref: HTMLElement;
  d: ResizeData;
}

const MIN_PANE_WIDTH = 400;
const MAX_PANE_WIDTH = 800;

const CodeEditor = () => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [code, setCode] = useState("// Start coding here...");
  const [language, setLanguage] = useState("javascript");
  const [activeTab, setActiveTab] = useState<"description" | "testcases">(
    "description"
  );
  const [showConsole, setShowConsole] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState<ConsoleOutputItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [leftPaneWidth, setLeftPaneWidth] = useState(600);
  const [autoSave, setAutoSave] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | undefined>(undefined);
  const editorRef = useRef<EditorInstance | null>(null);

  // Auto-save functionality
  const [, setSavedCode] = useLocalStorage("code-draft", code);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (autoSave) {
      const timer = setTimeout(() => {
        setSavedCode(code);
        setLastSaved(new Date());
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [code, autoSave, setSavedCode]);

  // Keyboard shortcuts
  useHotkeys([
    {
      keys: ["mod + enter"],
      callback: () => handleRun(),
      description: "Run Code",
    },
    {
      keys: ["mod + s"],
      callback: (event: KeyboardEvent) => {
        event.preventDefault();
        handleSubmit();
      },
      description: "Submit Solution",
    },
    {
      keys: ["mod + b"],
      callback: () => setShowConsole((prev) => !prev),
      description: "Toggle Console",
    },
    {
      keys: ["f11"],
      callback: (event: KeyboardEvent) => {
        event.preventDefault();
        setIsFullScreen((prev) => !prev);
      },
      description: "Toggle Full Screen",
    },
  ]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor as EditorInstance;

    // Add custom actions
    editor.addAction({
      id: "run-code",
      label: "Run Code",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => handleRun(),
    });
  };

  const handleRun = (customInput?: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setIsRunning(true);
    setShowConsole(true);

    setConsoleOutput((prev) => [
      ...prev,
      {
        type: "input",
        content: customInput
          ? `Running code with input: ${customInput}`
          : "Running code...",
        timestamp,
      },
    ]);

    // Simulate code execution
    setTimeout(() => {
      setConsoleOutput((prev) => [
        ...prev,
        {
          type: "output",
          content: "Output: 3\nExecution Time: 52ms\nMemory Usage: 41.2 MB",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setIsRunning(false);
    }, 1500);
  };

  const handleSubmit = () => {
    const timestamp = new Date().toLocaleTimeString();
    setIsRunning(true);
    setShowConsole(true);

    setConsoleOutput((prev) => [
      ...prev,
      {
        type: "input",
        content: "Submitting solution...",
        timestamp,
      },
    ]);

    // Simulate submission
    setTimeout(() => {
      setConsoleOutput((prev) => [
        ...prev,
        {
          type: "output",
          content:
            "✅ Accepted\nRuntime: 76 ms (faster than 95.23%)\nMemory: 42.1 MB (less than 87.65%)",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
      setIsRunning(false);
    }, 2000);
  };

  const clearConsole = () => {
    setConsoleOutput([]);
  };

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background"
    >
      <div className="h-screen flex">
        {!isFullScreen && (
          <Resizable
            size={{ width: leftPaneWidth, height: "100%" }}
            minWidth={MIN_PANE_WIDTH}
            maxWidth={MAX_PANE_WIDTH}
            enable={{ right: true }}
            onResizeStop={({ d }: ResizeEvent) => {
              setLeftPaneWidth(leftPaneWidth + d.width);
            }}
            className="border-r border-border bg-card"
          >
            <div className="h-full flex flex-col">
              <EditorHeader
                title={SAMPLE_PROBLEM.title}
                difficulty={
                  SAMPLE_PROBLEM.difficulty as "Easy" | "Medium" | "Hard"
                }
                likes={SAMPLE_PROBLEM.likes}
                dislikes={SAMPLE_PROBLEM.dislikes}
                companies={SAMPLE_PROBLEM.companies}
                onFullScreen={() => setIsFullScreen((prev) => !prev)}
                isFullScreen={isFullScreen}
              />

              {/* Tab Navigation */}
              <div className="flex border-b border-border bg-muted/30">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`px-6 py-3 font-medium text-sm transition-all ${
                    activeTab === "description"
                      ? "text-primary border-b-2 border-primary bg-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("testcases")}
                  className={`px-6 py-3 font-medium text-sm transition-all ${
                    activeTab === "testcases"
                      ? "text-primary border-b-2 border-primary bg-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  Test Cases
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-auto">
                {activeTab === "description" ? (
                  <div className="p-6">
                    <ProblemDescription
                      description={SAMPLE_PROBLEM.description}
                      examples={SAMPLE_PROBLEM.examples}
                      constraints={SAMPLE_PROBLEM.constraints}
                    />
                  </div>
                ) : (
                  <div className="p-6">
                    <TestCases
                      testCases={SAMPLE_TESTCASES}
                      onRunTest={handleRun}
                      isRunning={isRunning}
                    />
                  </div>
                )}
              </div>
            </div>
          </Resizable>
        )}

        {/* Right Panel - Code Editor and Console */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex-1 flex flex-col bg-background"
          layout
        >
          <div className="border-b border-border bg-card shadow-sm">
            <div className="p-4 flex items-center justify-between">
              <EditorToolbar
                onLanguageChange={setLanguage}
                onThemeChange={() =>
                  setTheme((prev) => (prev === "dark" ? "light" : "dark"))
                }
                onMinimapToggle={() => setShowMinimap((prev) => !prev)}
                onAutoSaveToggle={() => setAutoSave((prev) => !prev)}
                currentLanguage={language}
                theme={theme}
                showMinimap={showMinimap}
                autoSave={autoSave}
                lastSaved={lastSaved}
              />

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => handleRun()}
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
                  Run
                </Button>

                <Button
                  onClick={handleSubmit}
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
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  }
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 relative">
            <Editor
              height="100%"
              defaultLanguage="javascript"
              language={language}
              theme={theme === "dark" ? "vs-dark" : "light"}
              value={code}
              onChange={(value) => setCode(value || "")}
              onMount={handleEditorDidMount}
              options={{
                fontSize: 14,
                fontFamily: "JetBrains Mono",
                fontLigatures: true,
                minimap: {
                  enabled: showMinimap,
                },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorSmoothCaretAnimation: "on",
                cursorBlinking: "smooth",
                renderWhitespace: "selection",
                lineNumbers: "on",
                glyphMargin: true,
                folding: true,
                bracketPairColorization: {
                  enabled: true,
                },
                formatOnPaste: true,
                formatOnType: true,
                tabSize: 2,
                automaticLayout: true,
                wordWrap: "on",
              }}
            />
          </div>

          <ConsoleOutput
            outputs={consoleOutput}
            onClear={clearConsole}
            isVisible={showConsole}
            onToggle={() => setShowConsole((prev) => !prev)}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CodeEditor;
