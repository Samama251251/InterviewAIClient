import { Excalidraw, exportToBlob } from "@excalidraw/excalidraw";
import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, FileDown, Clock, Check, AlertTriangle, X, FileText, ChevronLeft, ChevronRight, GripVertical } from "lucide-react";
import { useInterviews } from "@/hooks/useInterviews";
import WhiteboardService from "@/services/whiteboardService";
import { InterviewRound } from "@/types/interview";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SystemDesignProps {
  fullScreen?: boolean;
}

export default function SystemDesign({ fullScreen = false }: SystemDesignProps) {
    const { interviewId = '', roundIndex = '0' } = useParams<{ interviewId: string, roundIndex: string }>();
    const navigate = useNavigate();
    const excalidrawRef = useRef<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [remainingTime, setRemainingTime] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isProblemPanelOpen, setIsProblemPanelOpen] = useState(true);
    const [screenshot, setScreenshot] = useState<string | null>(null);
    
    // Resize functionality states
    const [panelWidth, setPanelWidth] = useState(33); // Width as percentage
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Get interview data
    const { getInterviewById } = useInterviews();
    const { data: interview, isLoading: isLoadingInterview } = getInterviewById(interviewId);

    // Find the system design round
    const systemDesignRound = interview?.rounds?.find(round => round.type === 'SystemDesign') as InterviewRound | undefined;

    // Get the problem statement from the round's remarks field or use a default
    const problemStatement = useMemo(() => {
        if (systemDesignRound?.remarks) return systemDesignRound.remarks;
        
        // Default problem statement if none is provided
        return `
# E-commerce Platform System Design Challenge

## Requirements:
Design a scalable architecture for an e-commerce platform that can handle:
- 10 million active users per month
- 100,000 concurrent users during peak times
- Product catalog with 1 million products
- Order processing with payment integration
- Real-time inventory management
- Search functionality with filtering options
- User reviews and ratings
- Personalized recommendations

## Deliverables:
1. System architecture diagram showing all components
2. Database schema design
3. API endpoints for key functionality
4. Explanation of scalability approach
5. Handling of failure scenarios

Consider how your design addresses high availability, fault tolerance, and performance at scale.
        `;
    }, [systemDesignRound]);

    // Check if the session is already submitted
    useEffect(() => {
        const submittedFlag = localStorage.getItem(`systemDesign_${interviewId}_submitted`);
        if (submittedFlag === 'true') {
            setIsSubmitted(true);
        }
        
        // Check for existing screenshot
        const savedScreenshot = localStorage.getItem(`systemDesign_${interviewId}_screenshot`);
        if (savedScreenshot) {
            setScreenshot(savedScreenshot);
        }
    }, [interviewId]);

    // Initialize timer if round has a time limit
    useEffect(() => {
        if (!isSubmitted) {
            // Currently hardcoded to 100 minutes
            // Convert minutes to seconds
            let timeInSeconds = 100 * 60;
            
            // Get start time from local storage if exists
            const startTimeStr = localStorage.getItem(`systemDesign_${interviewId}_startTime`);
            if (startTimeStr) {
                const startTime = parseInt(startTimeStr, 10);
                const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
                timeInSeconds = Math.max(0, 100 * 60 - elapsedSeconds);
                
                if (timeInSeconds <= 0) {
                    setIsSubmitted(true);
                    localStorage.setItem(`systemDesign_${interviewId}_submitted`, 'true');
                    saveDrawing(true); // Auto-save on time expiration
                    captureScreenshot();
                }
            } else {
                // Set start time in local storage
                localStorage.setItem(`systemDesign_${interviewId}_startTime`, Date.now().toString());
            }
            
            setRemainingTime(timeInSeconds);
            
            // Start countdown
            const timer = setInterval(() => {
                setRemainingTime(prev => {
                    if (prev === null || prev <= 1) {
                        clearInterval(timer);
                        setIsSubmitted(true);
                        localStorage.setItem(`systemDesign_${interviewId}_submitted`, 'true');
                        saveDrawing(true); // Auto-save on time expiration
                        captureScreenshot();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            
            return () => clearInterval(timer);
        }
    }, [systemDesignRound, interviewId, isSubmitted]);

    // Capture screenshot of the canvas
    const captureScreenshot = async () => {
        if (!excalidrawRef.current) return;
        
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
            reader.onloadend = () => {
                const base64data = reader.result as string;
                setScreenshot(base64data);
                localStorage.setItem(`systemDesign_${interviewId}_screenshot`, base64data);
            };
            reader.readAsDataURL(blob);
        } catch (error) {
            console.error("Error capturing screenshot:", error);
        }
    };

    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Simulate loading state
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    // Load saved drawing if exists
    useEffect(() => {
        const loadDrawing = async () => {
            try {
                // Try to load from API first
                const savedData = await WhiteboardService.getDiagram(interviewId);
                if (savedData && excalidrawRef.current) {
                    excalidrawRef.current.updateScene(savedData);
                }
            } catch (error) {
                // Fallback to local storage
                const localData = WhiteboardService.loadLocal(`systemDesign_${interviewId}`);
                if (localData && excalidrawRef.current) {
                    excalidrawRef.current.updateScene(localData);
                }
            }
        };

        if (!isLoading && excalidrawRef.current) {
            loadDrawing();
        }
    }, [isLoading, interviewId]);

    // Save drawing function
    const saveDrawing = useCallback(async (isAutoSave = false) => {
        if (!excalidrawRef.current) return;
        
        setSaveStatus('saving');
        
        try {
            const elements = excalidrawRef.current.getSceneElements();
            const appState = excalidrawRef.current.getAppState();
            const files = excalidrawRef.current.getFiles();
            
            const drawingData = {
                elements,
                appState,
                files,
                name: `System Design - ${interviewId}`,
                id: interviewId
            };
            
            // Try to save to API
            try {
                await WhiteboardService.updateDiagram(interviewId, drawingData);
            } catch (error) {
                // Fallback to local storage if API fails
                WhiteboardService.saveLocal(drawingData, `systemDesign_${interviewId}`);
            }
            
            setSaveStatus('saved');
            
            if (!isAutoSave) {
                // Reset status after 3 seconds
                setTimeout(() => {
                    setSaveStatus('idle');
                }, 3000);
            }
        } catch (error) {
            setSaveStatus('error');
            console.error('Error saving diagram:', error);
            
            // Reset status after 3 seconds
            setTimeout(() => {
                setSaveStatus('idle');
            }, 3000);
        }
    }, [interviewId]);

    // Autosave every 30 seconds
    useEffect(() => {
        if (isLoading || isSubmitted) return;
        
        const autosaveInterval = setInterval(() => {
            saveDrawing(true);
        }, 30000);
        
        return () => clearInterval(autosaveInterval);
    }, [isLoading, saveDrawing, isSubmitted]);

    // Handle submission
    const handleSubmit = async () => {
        await saveDrawing(true);
        await captureScreenshot();
        setIsSubmitted(true);
        localStorage.setItem(`systemDesign_${interviewId}_submitted`, 'true');
        
        // Navigate back to interview detail
        setTimeout(() => {
            navigate(`/employee/interviews/${interviewId}`);
        }, 2000);
    };

    // Handle exit from fullscreen mode
    const handleExit = () => {
      if (window.confirm("Are you sure you want to exit? Your progress will be saved, but the session will end.")) {
        saveDrawing(true);
        navigate(`/candidate/interviews/${interviewId}`);
      }
    };

    // Toggle problem panel
    const toggleProblemPanel = () => {
        setIsProblemPanelOpen(!isProblemPanelOpen);
    };

    // Drag handler to resize panels
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    // Handle mouse movement while dragging
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !containerRef.current) return;
            
            const containerRect = containerRef.current.getBoundingClientRect();
            const containerWidth = containerRect.width;
            const mouseX = e.clientX - containerRect.left;
            
            // Calculate width as percentage (min 15%, max 80%)
            const newWidthPercent = Math.min(Math.max((mouseX / containerWidth) * 100, 15), 80);
            setPanelWidth(newWidthPercent);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <motion.div 
            className={`${fullScreen ? 'h-screen w-screen flex flex-col overflow-hidden' : 'space-y-6'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header */}
            <div className={`flex justify-between items-center ${fullScreen ? 'bg-base-100 p-4 shadow-md z-10' : ''}`}>
                <div>
                    {!fullScreen ? (
                      <button 
                          className="btn btn-ghost mb-4 flex items-center gap-2"
                          onClick={() => navigate(`/employee/interviews/${interviewId}`)} 
                      >
                          <ArrowLeft className="h-4 w-4" />
                          Back to Interview
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">System Design Interview</h1>
                        <div className="badge badge-lg">Round #{roundIndex}</div>
                      </div>
                    )}
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Timer display */}
                    {remainingTime !== null && (
                        <div className={`flex items-center gap-2 ${remainingTime < 300 ? 'text-error' : ''} ${fullScreen ? 'text-lg' : ''}`}>
                            <Clock className={`${fullScreen ? 'h-6 w-6' : 'h-5 w-5'}`} />
                            <span className="font-mono font-bold">{formatTime(remainingTime)}</span>
                        </div>
                    )}
                    
                    {/* Save button */}
                    {!isSubmitted && (
                        <button 
                            className={`btn ${fullScreen ? 'btn-md' : 'btn-sm'} btn-outline gap-2`}
                            onClick={() => saveDrawing()}
                            disabled={saveStatus === 'saving'}
                        >
                            {saveStatus === 'idle' && <Save className="h-4 w-4" />}
                            {saveStatus === 'saving' && <span className="loading loading-spinner loading-xs" />}
                            {saveStatus === 'saved' && <Check className="h-4 w-4 text-success" />}
                            {saveStatus === 'error' && <AlertTriangle className="h-4 w-4 text-error" />}
                            {saveStatus === 'idle' && 'Save'}
                            {saveStatus === 'saving' && 'Saving...'}
                            {saveStatus === 'saved' && 'Saved!'}
                            {saveStatus === 'error' && 'Error!'}
                        </button>
                    )}
                    
                    {/* Submit button */}
                    {!isSubmitted ? (
                        <button 
                            className={`btn ${fullScreen ? 'btn-md' : 'btn-sm'} btn-primary gap-2`}
                            onClick={handleSubmit}
                        >
                            <FileDown className="h-4 w-4" />
                            Submit
                        </button>
                    ) : (
                        <div className="badge badge-success gap-1">
                            <Check className="h-4 w-4" />
                            Submitted
                        </div>
                    )}
                    
                    {/* Exit button (only in fullscreen mode) */}
                    {fullScreen && !isSubmitted && (
                      <button 
                        className="btn btn-error btn-md"
                        onClick={handleExit}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Exit
                      </button>
                    )}
                </div>
            </div>

            {/* Main content area with side-by-side layout */}
            <div 
                className={`flex flex-grow ${fullScreen ? 'h-[calc(100vh-64px)]' : 'h-[700px]'}`}
                ref={containerRef}
                style={{ cursor: isDragging ? 'col-resize' : 'default' }}
            >
                {/* Problem Statement Panel - Left Side */}
                <div 
                    className={`bg-base-200 flex flex-col transition-all duration-300 z-10 border-r border-base-300 ${
                        isProblemPanelOpen ? '' : 'w-12'
                    }`}
                    style={{ 
                        width: isProblemPanelOpen ? `${panelWidth}%` : '3rem',
                        transition: isDragging ? 'none' : 'width 0.3s ease' 
                    }}
                >
                    {/* Toggle button */}
                    <button 
                        className="flex items-center justify-center p-3 bg-base-300 hover:bg-base-200"
                        onClick={toggleProblemPanel}
                    >
                        {isProblemPanelOpen ? (
                            <ChevronLeft className="h-5 w-5" />
                        ) : (
                            <ChevronRight className="h-5 w-5" />
                        )}
                    </button>
                    
                    {/* Problem statement content */}
                    {isProblemPanelOpen && (
                        <div className="p-4 overflow-y-auto flex-grow">
                            <div className="flex items-center gap-2 mb-4">
                                <FileText className="h-5 w-5 text-primary" />
                                <h3 className="font-medium text-lg">Problem Statement</h3>
                            </div>
                            <div className="markdown-content bg-base-100 p-4 rounded-lg shadow-sm">
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        // Add custom styling for different Markdown elements
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
                                    {problemStatement}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Resizer handle */}
                {isProblemPanelOpen && (
                    <div 
                        className="w-2 bg-base-300 hover:bg-primary hover:bg-opacity-30 cursor-col-resize flex items-center justify-center z-20"
                        onMouseDown={handleMouseDown}
                    >
                        <GripVertical className="h-6 w-6 text-base-content opacity-30" />
                    </div>
                )}
                
                {/* Drawing Canvas - Right Side */}
                <div className="flex-grow bg-white">
                    {isLoading || isLoadingInterview ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="loading loading-spinner loading-lg text-primary"></div>
                        </div>
                    ) : isSubmitted && screenshot ? (
                        <div className="flex flex-col items-center justify-center h-full p-4">
                            <h2 className="text-xl font-bold mb-4">Your Submitted Design</h2>
                            <div className="border border-base-300 rounded-lg shadow-md overflow-hidden max-w-full max-h-[80vh]">
                                <img 
                                    src={screenshot} 
                                    alt="Submitted design" 
                                    className="max-w-full max-h-[80vh] object-contain"
                                />
                            </div>
                        </div>
                    ) : (
                        <Excalidraw
                            ref={excalidrawRef}
                            initialData={{
                                appState: {
                                    theme: "light",
                                    viewBackgroundColor: "#ffffff"
                                }
                            }}
                            zenModeEnabled={fullScreen}
                            viewModeEnabled={isSubmitted}
                        />
                    )}
                </div>
            </div>
            
            {/* Submit confirmation toast */}
            {isSubmitted && (
                <div className="toast toast-center">
                    <div className="alert alert-success">
                        <Check className="h-5 w-5" />
                        <span>Your system design has been submitted!</span>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
