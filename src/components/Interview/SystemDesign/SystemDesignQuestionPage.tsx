import { useState, useRef, forwardRef, useImperativeHandle, useCallback, useEffect } from 'react';
import { Excalidraw, exportToBlob } from "@excalidraw/excalidraw";
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SystemDesignQuestion } from '@/types/systemDesign';
import SystemDesignTextAnswer from './SystemDesignTextAnswer';

interface SystemDesignQuestionPageProps {
  question: SystemDesignQuestion;
  isActive: boolean;
  isSubmitted: boolean;
  onDataChange: (data: QuestionData) => void;
  initialData?: QuestionData;
}

export interface QuestionData {
  drawingData: any | null;
  screenshot: string | null;
  textAnswer: string;
}

// Export methods that will be available through ref
export interface SystemDesignQuestionPageRef {
  saveDrawingData: () => void;
  captureScreenshot: () => Promise<string | null>;
}

// Debounce utility function
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const SystemDesignQuestionPage = forwardRef<SystemDesignQuestionPageRef, SystemDesignQuestionPageProps>(({
  question,
  isActive,
  isSubmitted,
  onDataChange,
  initialData,
}, ref) => {
  const [viewMode, setViewMode] = useState<'question' | 'answer'>('question');
  const [textAnswer, setTextAnswer] = useState(initialData?.textAnswer || '');
  const excalidrawRef = useRef<any>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [panelWidth] = useState(33); // Width as percentage
  const [localDrawingData, setLocalDrawingData] = useState<any>(initialData?.drawingData || null);

  // Save the current drawing
  const saveDrawingData = () => {
    if (!excalidrawRef.current) return;

    const elements = excalidrawRef.current.getSceneElements();
    const appState = excalidrawRef.current.getAppState();
    const files = excalidrawRef.current.getFiles();
    
    const drawingData = { elements, appState, files };
    
    // Update local state first
    setLocalDrawingData(drawingData);
    
    // Then update parent
    onDataChange({
      drawingData,
      screenshot: null, // Screenshot is captured explicitly
      textAnswer,
    });
  };

  // Handle text answer changes
  const handleTextAnswerChange = (text: string) => {
    setTextAnswer(text);
    onDataChange({
      drawingData: localDrawingData,
      screenshot: null,
      textAnswer: text,
    });
  };

  // Capture a screenshot of the current drawing
  const captureScreenshot = async (): Promise<string | null> => {
    if (!excalidrawRef.current) return null;
    
    try {
      const blob = await exportToBlob({
        elements: excalidrawRef.current.getSceneElements(),
        appState: {
          ...excalidrawRef.current.getAppState(),
          exportWithDarkMode: false,
        },
        files: excalidrawRef.current.getFiles(),
        getDimensions: () => ({
          width: 2000,
          height: 1500,
        }),
      });
      
      const reader = new FileReader();
      
      const screenshotPromise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64data = reader.result as string;
          resolve(base64data);
        };
      });
      
      reader.readAsDataURL(blob);
      const base64data = await screenshotPromise;
      
      // Get current drawing data without triggering a save
      const currentDrawingData = localDrawingData || {
        elements: excalidrawRef.current.getSceneElements(),
        appState: excalidrawRef.current.getAppState(),
        files: excalidrawRef.current.getFiles(),
      };
      
      // Update data with screenshot directly
      onDataChange({
        drawingData: currentDrawingData,
        screenshot: base64data,
        textAnswer,
      });
      
      return base64data;
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      return null;
    }
  };

  // Toggle the problem panel
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  // Handle Excalidraw changes - debounced
  const debouncedSave = useCallback(
    debounce(() => {
      saveDrawingData();
    }, 500),
    [textAnswer] // Only recreate when textAnswer changes
  );

  // Handle Excalidraw changes
  const handleExcalidrawChange = () => {
    debouncedSave();
  };

  // Make methods available to parent through ref
  useImperativeHandle(ref, () => ({
    saveDrawingData,
    captureScreenshot,
  }));

  // Effect to handle component activation
  useEffect(() => {
    if (isActive && excalidrawRef.current && localDrawingData) {
      try {
        // We need to manually update the scene when returning to this question
        excalidrawRef.current.updateScene({
          elements: localDrawingData.elements || [],
          appState: {
            ...excalidrawRef.current.getAppState(),
            ...(localDrawingData.appState || {})
          },
          files: localDrawingData.files || {}
        });
      } catch (error) {
        console.error("Error restoring drawing data:", error);
      }
    }
  }, [isActive, localDrawingData]);

  // Force save when component unmounts or becomes inactive
  useEffect(() => {
    return () => {
      if (excalidrawRef.current) {
        saveDrawingData();
      }
    };
  }, [isActive]);

  // If not active, just return null
  if (!isActive && !isSubmitted) {
    return null;
  }

  // For submitted view, show a static screenshot summary
  if (isSubmitted) {
    return (
      <div className="mb-10 border border-base-300 rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-2">{question.question}</h3>
        
        {/* Text answer */}
        {textAnswer && (
          <div className="mb-4">
            <h4 className="font-medium text-base mb-2">Your Description:</h4>
            <div className="p-3 bg-base-200 rounded-md whitespace-pre-wrap">
              {textAnswer}
            </div>
          </div>
        )}
        
        {/* Diagram - will be filled in by parent with screenshot */}
        <h4 className="font-medium text-base mb-2">Your Diagram:</h4>
        <div className="text-center p-6 bg-base-200 text-base-content/70">
          [Diagram will appear here when submitted]
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-grow h-full">
      {/* Problem/Answer Panel - Left Side */}
      <div 
        className={`bg-base-200 flex flex-col transition-all duration-300 z-10 border-r border-base-300 ${
          isPanelOpen ? '' : 'w-12'
        }`}
        style={{ 
          width: isPanelOpen ? `${panelWidth}%` : '3rem',
          transition: 'width 0.3s ease' 
        }}
      >
        {/* Toggle button */}
        <button 
          className="flex items-center justify-center p-3 bg-base-300 hover:bg-base-200"
          onClick={togglePanel}
        >
          {isPanelOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
        
        {/* Panel content */}
        {isPanelOpen && (
          <div className="p-4 overflow-y-auto flex-grow flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-medium text-lg">
                  {viewMode === 'question' ? 'Problem Statement' : 'Your Answer'}
                </h3>
                {viewMode === 'question' && (
                  <div className={`badge ${
                    question.difficulty === 'Easy' ? 'badge-success' : 
                    question.difficulty === 'Medium' ? 'badge-warning' : 
                    'badge-error'
                  }`}>
                    {question.difficulty}
                  </div>
                )}
              </div>

              {/* Toggle between question and answer */}
              <div className="tabs tabs-boxed">
                <button 
                  className={`tab ${viewMode === 'question' ? 'tab-active' : ''}`}
                  onClick={() => setViewMode('question')}
                >
                  Question
                </button>
                <button 
                  className={`tab ${viewMode === 'answer' ? 'tab-active' : ''}`}
                  onClick={() => setViewMode('answer')}
                >
                  Answer
                </button>
              </div>
            </div>
            
            {viewMode === 'question' ? (
              <div className="markdown-content bg-base-100 p-4 rounded-lg shadow-sm">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => <h1 className="text-xl font-bold my-4" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-lg font-bold my-3" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-md font-bold my-2" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2" {...props} />,
                    li: ({ node, ...props }) => <li className="my-1" {...props} />,
                    p: ({ node, ...props }) => <p className="my-2" {...props} />,
                    code: ({ node, ...props }) => <code className="bg-base-300 px-1 rounded text-sm" {...props} />
                  }}
                >
                  {question.question}
                </ReactMarkdown>
                
                <div className="alert alert-info mt-4">
                  <div>
                    <p className="font-medium">Design Task</p>
                    <p>Create a detailed system design diagram addressing the problem above. Include architecture components, data flow, and how your solution handles scale and reliability.</p>
                  </div>
                </div>
              </div>
            ) : (
              <SystemDesignTextAnswer 
                answer={textAnswer} 
                onAnswerChange={handleTextAnswerChange}
                readOnly={isSubmitted}
              />
            )}
          </div>
        )}
      </div>
      
      {/* Drawing Canvas - Right Side */}
      <div className="flex-grow bg-white">
        <Excalidraw
          ref={excalidrawRef}
          initialData={{
            elements: localDrawingData?.elements || [],
            appState: {
              theme: "light",
              viewBackgroundColor: "#ffffff",
              ...(localDrawingData?.appState || {})
            },
            files: localDrawingData?.files || {}
          }}
          onChange={handleExcalidrawChange}
          zenModeEnabled
          viewModeEnabled={false}
        />
      </div>
    </div>
  );
});

// Add display name for debugging
SystemDesignQuestionPage.displayName = 'SystemDesignQuestionPage';

export default SystemDesignQuestionPage; 