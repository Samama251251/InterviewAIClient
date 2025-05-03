import { motion } from "framer-motion";
import { ReactNode } from "react";
import Button from "./Button";

interface EditorHeaderProps {
  title: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  likes?: number;
  dislikes?: number;
  companies?: string[];
  onFullScreen?: () => void;
  isFullScreen?: boolean;
  rightContent?: ReactNode;
}

const difficultyColors = {
  Easy: "text-green-500 bg-green-500/10",
  Medium: "text-yellow-500 bg-yellow-500/10",
  Hard: "text-red-500 bg-red-500/10",
};

const EditorHeader = ({
  title,
  difficulty,
  likes,
  dislikes,
  companies,
  onFullScreen,
  isFullScreen,
  rightContent,
}: EditorHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-10 bg-card border-b border-border"
    >
      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground truncate">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {difficulty && (
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${difficultyColors[difficulty]}`}
              >
                {difficulty}
              </span>
            )}

            {rightContent}

            {onFullScreen && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onFullScreen}
                title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
              >
                {isFullScreen ? (
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
                      d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25"
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
                      d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                )}
              </Button>
            )}
          </div>
        </div>

        {(likes !== undefined ||
          dislikes !== undefined ||
          companies?.length) && (
          <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
            {likes !== undefined && (
              <div className="flex items-center gap-2">
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
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
                {likes}K
              </div>
            )}

            {dislikes !== undefined && (
              <div className="flex items-center gap-2">
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
                    d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2"
                  />
                </svg>
                {dislikes}K
              </div>
            )}

            {companies?.length && (
              <>
                <div className="h-4 w-px bg-border"></div>
                <div className="flex items-center gap-2">
                  <span>Companies:</span>
                  <div className="flex gap-1">
                    {companies.map((company) => (
                      <span
                        key={company}
                        className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium"
                      >
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EditorHeader;
