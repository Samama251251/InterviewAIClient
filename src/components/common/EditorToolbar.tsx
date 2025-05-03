import { motion } from "framer-motion";
import { useState } from "react";
import Button from "./Button";

interface EditorToolbarProps {
  onLanguageChange: (language: string) => void;
  onThemeChange: () => void;
  onMinimapToggle: () => void;
  onAutoSaveToggle: () => void;
  currentLanguage: string;
  theme: "light" | "dark";
  showMinimap: boolean;
  autoSave: boolean;
  lastSaved?: Date;
}

const languages = [
  {
    id: "javascript",
    name: "JavaScript",
    icon: "📜",
  },
  {
    id: "typescript",
    name: "TypeScript",
    icon: "💎",
  },
  {
    id: "python",
    name: "Python",
    icon: "🐍",
  },
  {
    id: "java",
    name: "Java",
    icon: "☕",
  },
];

const EditorToolbar = ({
  onLanguageChange,
  onThemeChange,
  onMinimapToggle,
  onAutoSaveToggle,
  currentLanguage,
  theme,
  showMinimap,
  autoSave,
  lastSaved,
}: EditorToolbarProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative inline-block"
      >
        <div className="relative inline-flex items-center">
          <select
            value={currentLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="appearance-none bg-muted text-foreground pl-10 pr-10 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 font-medium text-sm"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.icon} {lang.name}
              </option>
            ))}
          </select>
          <span className="absolute left-3 pointer-events-none">
            {languages.find((l) => l.id === currentLanguage)?.icon}
          </span>
          <span className="absolute right-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-muted-foreground"
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
          </span>
        </div>
      </motion.div>

      <div className="h-6 w-px bg-border"></div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onThemeChange}
          title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Theme`}
        >
          <motion.div
            initial={false}
            animate={{ rotate: isHovered ? 180 : 0 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            {theme === "dark" ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </motion.div>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onMinimapToggle}
          title="Toggle Minimap"
          className={showMinimap ? "text-primary bg-primary/10" : ""}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
            />
          </svg>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onAutoSaveToggle}
          title="Toggle Auto-save"
          className={autoSave ? "text-primary bg-primary/10" : ""}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
        </Button>
      </div>

      {lastSaved && (
        <div className="text-xs text-muted-foreground">
          Last saved: {lastSaved.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default EditorToolbar;
