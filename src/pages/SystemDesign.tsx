import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, FileDown, Clock, Check, X, 
  ArrowLeftCircle, ArrowRightCircle 
} from "lucide-react";
import { useInterviews } from "@/hooks/useInterviews";
import * as systemDesignService from "@/services/systemDesign";
import { SystemDesignQuestion, SystemDesignSubmission } from "@/types/systemDesign";
import SystemDesignQuestionPage, { QuestionData, SystemDesignQuestionPageRef } from "@/components/Interview/SystemDesign/SystemDesignQuestionPage";
import SystemDesignSubmissionView from "@/components/Interview/SystemDesign/SystemDesignSubmissionView";

interface SystemDesignProps {
  fullScreen?: boolean;
}

export default function SystemDesign({ fullScreen = false }: SystemDesignProps) {
  const { interviewId = '', roundIndex = '0' } = useParams<{ interviewId: string, roundIndex: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [remainingTime, setRemainingTime] = useState<number>(100 * 60); // 100 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Questions array - hardcoded for simplicity
  const [questions] = useState<SystemDesignQuestion[]>([
    {
      question: "Design a scalable e-commerce platform",
      difficulty: "Medium"
    },
    {
      question: "Design a real-time chat system",
      difficulty: "Medium"
    },
    {
      question: "Design a URL shortening service",
      difficulty: "Easy"
    },
    {
      question: "Design a distributed file storage system",
      difficulty: "Hard"
    },
    {
      question: "Design a social media news feed",
      difficulty: "Medium"
    }
  ]);

  // Current question index for navigation
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Store data for each question
  const [questionsData, setQuestionsData] = useState<Record<number, QuestionData>>({});
  
  // References to question components for method access
  const questionRefs = useRef<Record<number, SystemDesignQuestionPageRef>>({});

  // Get interview data
  const { isLoading: isLoadingInterview } = useInterviews().getInterviewById(interviewId);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Initialize timer
  useEffect(() => {
    if (!isSubmitted) {
      // Start countdown
      const timer = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isSubmitted]);

  // Auto submit function
  const handleAutoSubmit = () => {
    if (isSubmitted) return;
    submitAllAnswers();
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Navigate to previous question
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      // Save current question data
      if (questionRefs.current[currentQuestionIndex]) {
        questionRefs.current[currentQuestionIndex].saveDrawingData();
      }
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Navigate to next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Save current question data
      if (questionRefs.current[currentQuestionIndex]) {
        questionRefs.current[currentQuestionIndex].saveDrawingData();
      }
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handle data change for a question
  const handleQuestionDataChange = (index: number, data: QuestionData) => {
    setQuestionsData(prev => {
      // If data is the same as what's already in state, don't update
      if (JSON.stringify(prev[index]) === JSON.stringify(data)) {
        return prev;
      }
      
      return {
        ...prev,
        [index]: data
      };
    });
  };

  // Prepare and submit all answers
  const submitAllAnswers = async () => {
    try {
      // Save current question data
      if (questionRefs.current[currentQuestionIndex]) {
        questionRefs.current[currentQuestionIndex].saveDrawingData();
      }
      
      // Capture screenshots for all questions with drawings
      await Promise.all(
        Object.keys(questionsData).map(async (indexStr) => {
          const index = parseInt(indexStr, 10);
          const data = questionsData[index];
          
          // If we have drawing data but no screenshot, capture it
          if (data.drawingData && !data.screenshot && questionRefs.current[index]) {
            // Switch to this question if needed
            if (index !== currentQuestionIndex) {
              setCurrentQuestionIndex(index);
              // Wait for component to update
              await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // Capture screenshot
            await questionRefs.current[index].captureScreenshot();
          }
          
          return true;
        })
      );
      
      // Prepare submissions for all questions
      const submissions: SystemDesignSubmission[] = [];
      
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const data = questionsData[i];
        
        if (question && data?.screenshot) {
          submissions.push({
            question: question.question,
            answer: data.textAnswer || `System design solution for: ${question.question}`,
            designed_system_image_base64: data.screenshot
          });
        }
      }
      
      if (submissions.length === 0) {
        alert("No designs to submit. Please draw something before submitting.");
        return;
      }
      
      // Submit to API
      await systemDesignService.submitSystemDesign(interviewId, submissions);
      
      // Mark as submitted
      setIsSubmitted(true);
      
      // Navigate back to interview detail after a delay
      setTimeout(() => {
        navigate(`/candidate/interviews/${interviewId}`);
      }, 2000);
    } catch (error) {
      console.error("Error submitting system designs:", error);
      alert("There was an error submitting your designs. Please try again.");
    }
  };

  // Handle exit from fullscreen mode
  const handleExit = () => {
    if (window.confirm("Are you sure you want to exit?")) {
      navigate(`/candidate/interviews/${interviewId}`);
    }
  };

  // Set ref for question component
  const setQuestionRef = (index: number, ref: SystemDesignQuestionPageRef | null) => {
    if (ref) {
      questionRefs.current[index] = ref;
    }
  };

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
              onClick={() => navigate(`/candidate/interviews/${interviewId}`)} 
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
          <div className={`flex items-center gap-2 ${remainingTime < 300 ? 'text-error' : ''} ${fullScreen ? 'text-lg' : ''}`}>
            <Clock className={`${fullScreen ? 'h-6 w-6' : 'h-5 w-5'}`} />
            <span className="font-mono font-bold">{formatTime(remainingTime)}</span>
          </div>
          
          {/* Question counter */}
          <div className="badge badge-lg">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          
          {/* Submit button */}
          {!isSubmitted ? (
            <button 
              className={`btn ${fullScreen ? 'btn-md' : 'btn-sm'} btn-primary gap-2`}
              onClick={submitAllAnswers}
            >
              <FileDown className="h-4 w-4" />
              Submit All
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

      {/* Navigation buttons */}
      {!isSubmitted && (
        <div className="flex justify-between px-4">
          <button 
            className="btn btn-outline gap-2" 
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeftCircle className="h-5 w-5" />
            Previous Question
          </button>
          
          <button 
            className="btn btn-outline gap-2" 
            onClick={goToNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Next Question
            <ArrowRightCircle className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Main content area */}
      <div className={`flex-grow ${fullScreen ? 'h-[calc(100vh-130px)]' : 'h-[700px]'}`}>
        {isLoading || isLoadingInterview ? (
          <div className="flex justify-center items-center h-full">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        ) : isSubmitted ? (
          <SystemDesignSubmissionView 
            questions={questions}
            questionsData={questionsData}
          />
        ) : (
          // Render all question pages, only the active one will be visible
          questions.map((question, index) => (
            <div 
              key={index} 
              style={{ display: index === currentQuestionIndex ? 'block' : 'none' }}
              className="h-full"
            >
              <SystemDesignQuestionPage
                ref={(ref) => setQuestionRef(index, ref)}
                question={question}
                isActive={index === currentQuestionIndex}
                isSubmitted={isSubmitted}
                onDataChange={(data) => handleQuestionDataChange(index, data)}
                initialData={questionsData[index]}
              />
            </div>
          ))
        )}
      </div>
      
      {/* Submit confirmation toast */}
      {isSubmitted && (
        <div className="toast toast-center">
          <div className="alert alert-success">
            <Check className="h-5 w-5" />
            <span>Your system designs have been submitted!</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
