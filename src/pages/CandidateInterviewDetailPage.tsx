import { useMemo, useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Building,
  ArrowLeft,
  AlertCircle,
  Award,
  MessageSquare,
  CheckCircle2,
  XCircle,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  Play,
  Star,
  TrendingUp,
  Upload,
  FileText
} from "lucide-react";
import { useInterviews } from "@/hooks/useInterviews";
import { InterviewRound } from "@/types/interview";
import InterviewConfirmationModal from "@/components/Interview/InterviewConfirmationModal";
import { LoadingOverlay } from "@/components/common/LoadingOverlay";
import { useToast } from "@/hooks/useToast";
import { fileToBase64, isPdf } from "@/utils/fileUtils";
import * as cvService from "@/services/cvService";

const RoundStatusIcon = ({ status }: { status?: string }) => {
  if (status === 'completed') {
    return <CheckCircle2 className="w-5 h-5 text-success" />;
  } else if (status === 'failed') {
    return <XCircle className="w-5 h-5 text-error" />;
  }
  return <ClipboardList className="w-5 h-5 text-secondary" />;
};

const CandidateInterviewDetailPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();
  const { success, error: showError, warning } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State to track which rounds are expanded
  const [expandedRounds, setExpandedRounds] = useState<number[]>([]);
  // State for confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoundIndex, setSelectedRoundIndex] = useState<number | null>(null);
  // CV upload states
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingCv, setIsLoadingCv] = useState(false);
  const [cvData, setCvData] = useState<{url?: string, parsedText?: string | null}>({});

  // Toggle round expansion
  const toggleRoundExpansion = (index: number) => {
    setExpandedRounds(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  // Check if a round is expanded
  const isRoundExpanded = (index: number) => expandedRounds.includes(index);

  // Fetch the specific interview
  const { getInterviewById } = useInterviews();
  const { data: interview, isLoading, isError, refetch } = getInterviewById(interviewId || "");

  // Check if there's already a CV uploaded
  useEffect(() => {
    if (interviewId) {
      fetchExistingCv();
    }
  }, [interviewId]);

  // Fetch existing CV
  const fetchExistingCv = async () => {
    try {
      setIsLoadingCv(true);
      const cvData = await cvService.getCV(interviewId!);
      
      setCvData({
        url: cvData.cvUrl,
        parsedText: cvData.parsedCv
      });
    } catch (error) {
      // If it's a 404, it means no CV is uploaded yet (not an error)
      if (error instanceof Error && !error.message.includes('404')) {
        console.error('Error fetching CV:', error);
      }
    } finally {
      setIsLoadingCv(false);
    }
  };

  // Get job and company information
  const jobDetails = useMemo(() => {
    if (!interview) return { jobName: '', companyName: '', description: '' };

    const jobRef = interview.job_id;
    
    if (typeof jobRef === 'string') {
      return {
        jobName: 'Unknown Job',
        companyName: 'Unknown Company',
        description: ''
      };
    } else {
      return {
        jobName: jobRef.name,
        companyName: typeof jobRef.company_id === 'string'
          ? jobRef.company_id
          : jobRef.company_id.name || 'Unknown Company',
        description: jobRef.description
      };
    }
  }, [interview]);

  // Check if the interview has started or completed
  const interviewStatus = useMemo(() => {
    if (!interview) return { status: 'pending', progress: 0 };
    
    const completedRounds = interview.rounds.filter(round => 
      round.status === 'completed'
    ).length;
    
    const totalRounds = interview.rounds.length;
    const progress = totalRounds > 0 ? (completedRounds / totalRounds) * 100 : 0;
    
    if (completedRounds === 0) return { status: 'not_started', progress };
    if (completedRounds < totalRounds) return { status: 'in_progress', progress };
    return { status: 'completed', progress: 100 };
  }, [interview]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Get average score for completed rounds
  const averageScore = useMemo(() => {
    if (!interview) return null;
    
    const completedRounds = interview.rounds.filter(round => 
      round.status === 'completed' && typeof round.score === 'number'
    );
    
    if (completedRounds.length === 0) return null;
    
    const totalScore = completedRounds.reduce((sum, round) => 
      sum + (round.score || 0), 0
    );
    
    return totalScore / completedRounds.length;
  }, [interview]);
  
  // Format round status for display
  const getRoundStatusLabel = (round: InterviewRound) => {
    if (round.status === 'completed') return 'Completed';
    if (round.status === 'pending') return 'Pending';
    return round.status || 'Unknown';
  };

  // Show confirmation modal before starting a round
  const showConfirmationModal = (roundIndex: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedRoundIndex(roundIndex);
    setIsModalOpen(true);
  };
  
  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Navigate to take an interview round after confirmation
  const handleConfirmNavigation = () => {
    if (selectedRoundIndex === null || !interview) return;
    
    navigateToTakeRound(selectedRoundIndex);
    setIsModalOpen(false);
  };
  
  // Navigate to take an interview round
  const navigateToTakeRound = (roundIndex: number) => {
    if (!interview) return;
    
    const round = interview.rounds[roundIndex];
    
    if (round.type === 'KnowledgeBased') {
      // Navigate to knowledge-based interview with jobId
      const jobId = typeof interview.job_id === 'string' ? interview.job_id : interview.job_id._id;
      navigate(`/knowledge-based?jobId=${jobId}&interviewId=${interview._id}`);
    } else if (round.type === 'Coding') {
      // Navigate to coding problem with interviewId and roundIndex
      navigate(`/coding-problem?interviewId=${interview._id}&roundIndex=${roundIndex}`);
    } else if (round.type === 'SystemDesign') {
      // Navigate to system design interview with interviewId and roundIndex
      navigate(`/system-design/${interviewId}/${roundIndex}`);
    } else {
      navigate(`/candidate/interviews/${interviewId}/rounds/${roundIndex}/take`);
    }
  };

  // Handle CV file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Only allow PDF files
    if (!isPdf(file)) {
      showError("Please upload a PDF file.");
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Convert file to base64
      const base64 = await fileToBase64(file);
      
      // Upload to server using the cvService
      const uploadResponse = await cvService.uploadCV(interviewId!, base64);
      
      setCvData({
        url: uploadResponse.cvUrl,
        parsedText: uploadResponse.parsedCv
      });
      
      if (uploadResponse.parsedCv === null) {
        warning("Your CV was uploaded but could not be parsed. You may need to try again later.");
      } else {
        success("Your CV was uploaded and parsed successfully.");
      }
      
      // Refresh interview data
      refetch();
    } catch (error) {
      console.error('Error uploading CV:', error);
      showError("There was an error uploading your CV. Please try again.");
    } finally {
      setIsUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  // Trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError || !interview) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="alert alert-error max-w-md">
          <AlertCircle />
          <span>Failed to load interview details. Please try again later.</span>
        </div>
      </div>
    );
  }

  return (

    <motion.div 
      className="p-4 md:p-6 space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >      
      {/* Back Button and Header */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <button 
          className="btn btn-ghost btn-sm self-start"
          onClick={() => navigate('/candidate/interviews')}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Interviews
        </button>
        
        <div className="md:ml-auto">
          <div className="badge badge-lg">
            Interview #{interviewId?.substring(0, 6)}
          </div>
        </div>
      </div>      {/* CV Upload Section */}
      <motion.div variants={itemVariants} className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body relative">
          {isUploading && <LoadingOverlay message="Uploading CV..." />}
          
          <h2 className="card-title flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Resume / CV
          </h2>
          
          {isLoadingCv ? (
            <div className="flex justify-center items-center p-10">
              <span className="loading loading-spinner loading-md text-primary"></span>
            </div>
          ) : cvData.url ? (
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <span>CV uploaded successfully</span>
                </div>
                <button 
                  className="btn btn-ghost btn-sm"
                  onClick={triggerFileInput}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Replace
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-base-300 rounded-lg p-6 cursor-pointer hover:bg-base-200 transition-colors" onClick={triggerFileInput}>
                <Upload className="w-8 h-8 mb-2 text-primary" />
                <p className="text-center">
                  Upload your resume/CV to enhance your interview experience
                </p>
                <p className="text-center text-sm text-base-content/60 mt-1">
                  Supported format: PDF
                </p>
                <button className="btn btn-primary btn-sm mt-4" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Uploading...
                    </>
                  ) : (
                    <>Select File</>
                  )}
                </button>
              </div>
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="application/pdf" 
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
      </motion.div>

      {/* Overall Performance Score Card */}
      {averageScore !== null && (
        <motion.div 
          variants={itemVariants} 
          className="card bg-base-100 shadow-sm border border-base-300 overflow-hidden"
        >
          <div className="card-body p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <h2 className="card-title flex items-center gap-2">
                  <Star className="text-warning w-5 h-5" />
                  Overall Performance
                </h2>
                <p className="text-base-content/70 mt-1">
                  Your average score across all completed rounds
                </p>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="stats shadow">
                  <div className="stat place-items-center">
                    <div className="stat-title">Average Score</div>
                    <div className="stat-value text-primary">{Math.round(averageScore)}</div>
                    <div className="stat-desc">out of 100</div>
                  </div>
                </div>
                
                <div className="hidden md:block">
                  <div className="radial-progress text-primary" style={{ "--value": Math.round(averageScore), "--size": "5rem" } as React.CSSProperties}>
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="badge badge-lg badge-outline">
                {averageScore >= 80 
                  ? "Excellent Performance" 
                  : averageScore >= 65 
                    ? "Strong Performance" 
                    : averageScore >= 50 
                      ? "Good Performance" 
                      : "Needs Improvement"}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Job and Company Info */}
      <motion.div variants={itemVariants} className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <h1 className="card-title text-2xl">{jobDetails.jobName}</h1>
          <div className="flex items-center text-base-content/70 mt-1">
            <Building className="w-4 h-4 mr-2" />
            <span>{jobDetails.companyName}</span>
          </div>
          
          {jobDetails.description && (
            <p className="mt-4">{jobDetails.description}</p>
          )}
        </div>
      </motion.div>

      {/* Progress and Status */}
      <motion.div variants={itemVariants} className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body">
          <h2 className="card-title">Interview Progress</h2>
          
          <div className="mt-4">
            <div className="flex justify-between mb-1 text-sm">
              <span>
                {interviewStatus.status === 'not_started' && 'Not Started'}
                {interviewStatus.status === 'in_progress' && 'In Progress'}
                {interviewStatus.status === 'completed' && 'Completed'}
              </span>
              <span>
                {interview.rounds.filter(r => r.status === 'completed').length}/{interview.rounds.length} Rounds
              </span>
            </div>
            <progress
              className={`progress w-full ${
                interviewStatus.status === 'completed' 
                  ? 'progress-success' 
                  : interviewStatus.status === 'in_progress'
                    ? 'progress-primary'
                    : 'progress-secondary'
              }`}
              value={interviewStatus.progress}
              max="100"
            />
          </div>

          {averageScore !== null && (
            <div className="mt-4 flex items-center">
              <Award className="w-5 h-5 text-warning mr-2" />
              <div>
                <div className="text-sm text-base-content/70">Average Score</div>
                <div className="font-medium">{Math.round(averageScore)}/100</div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Interview Rounds */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-bold mb-4">Interview Rounds</h2>
        
        <div className="space-y-4">
          {interview.rounds.map((round, index) => (
            <div 
              key={index}
              className="card bg-base-100 shadow-sm border border-base-300 transition-all hover:shadow-md"
            >
              <div 
                className="card-body p-4 md:p-6"
                onClick={() => toggleRoundExpansion(index)}
              >
                {/* Round Header - Always Visible */}
                <div className="flex justify-between items-center cursor-pointer">
                  <div className="flex items-center">
                    <RoundStatusIcon status={round.status} />
                    <div className="ml-3">
                      <h3 className="font-medium text-lg">{round.type} Round</h3>
                      <span className={`badge ${
                        round.status === 'completed' ? 'badge-success' : 'badge-secondary'
                      } badge-sm mt-1`}>
                        {getRoundStatusLabel(round)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {round.score !== undefined && (
                      <div className="badge badge-lg badge-primary hidden md:flex">
                        Score: {round.score}/100
                      </div>
                    )}
                    
                    {isRoundExpanded(index) ? (
                      <ChevronUp className="w-5 h-5 text-base-content/70" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-base-content/70" />
                    )}
                  </div>
                </div>

                {/* Score badge for mobile */}
                {round.score !== undefined && (
                  <div className="badge badge-lg badge-primary md:hidden mt-2">
                    Score: {round.score}/100
                  </div>
                )}
                
                {/* Expanded Content */}
                {isRoundExpanded(index) && (
                  <div className="mt-4 pt-4 border-t border-base-200">
                    {/* Round details */}
                    <div className="space-y-4">
                      {/* If there are remarks */}
                      {round.remarks ? (
                        <div className="flex items-start">
                          <MessageSquare className="w-5 h-5 text-base-content/70 mr-2 shrink-0 mt-1" />
                          <div>
                            <div className="text-sm text-base-content/70 mb-1">Feedback</div>
                            <p className="text-base-content">{round.remarks}</p>
                          </div>
                        </div>
                      ) : round.status !== 'completed' ? (
                        <div className="flex items-start">
                          <MessageSquare className="w-5 h-5 text-base-content/70 mr-2 shrink-0 mt-1" />
                          <div>
                            <div className="text-sm text-base-content/70 mb-1">Feedback</div>
                            <p className="text-base-content/70 italic">No feedback available yet</p>
                          </div>
                        </div>
                      ) : null}
                      
                      {/* If there's a score */}
                      {round.score !== undefined ? (
                        <div className="flex items-start">
                          <Award className="w-5 h-5 text-warning mr-2 shrink-0 mt-1" />
                          <div>
                            <div className="text-sm text-base-content/70 mb-1">Score</div>
                            <div className="flex items-center">
                              <div className="radial-progress text-primary" style={{ "--value": round.score, "--size": "4rem" } as React.CSSProperties}>
                                {round.score}
                              </div>
                              <div className="ml-4">
                                {round.score >= 80 ? (
                                  <span className="text-success">Excellent</span>
                                ) : round.score >= 60 ? (
                                  <span className="text-primary">Good</span>
                                ) : round.score >= 40 ? (
                                  <span className="text-warning">Average</span>
                                ) : (
                                  <span className="text-error">Needs Improvement</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : round.status !== 'completed' ? (
                        <div className="flex items-start">
                          <Award className="w-5 h-5 text-base-content/70 mr-2 shrink-0 mt-1" />
                          <div>
                            <div className="text-sm text-base-content/70 mb-1">Score</div>
                            <p className="text-base-content/70 italic">Score will be available after completion</p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* Quick action button (not part of the clickable area) */}
                {!isRoundExpanded(index) && (
                  <div className="mt-4" onClick={e => e.stopPropagation()}>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={(e) => showConfirmationModal(index, e)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Take Interview
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      {/* Confirmation Modal */}
      <InterviewConfirmationModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmNavigation}
      />
    </motion.div>
  );
};

export default CandidateInterviewDetailPage; 