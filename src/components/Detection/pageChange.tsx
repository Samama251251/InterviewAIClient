import { useEffect, useState } from 'react';
import useTabVisibility from '../../hooks/useTabVisibility';
import { useToast } from "@/hooks/useToast";
import { useParams, useLocation } from 'react-router-dom';
import { reportViolation } from '../../services/interviewService';

const InterviewSession = () => {
  const { isTabVisible } = useTabVisibility();
  const { warning } = useToast();
  
  const [currentInterviewId, setCurrentInterviewId] = useState<string | undefined>(undefined);

  const params = useParams<{ interviewId?: string; [key: string]: string | undefined }>();
  const location = useLocation();

  useEffect(() => {
    let idFromParams = params.interviewId;
    if (idFromParams) {
      setCurrentInterviewId(idFromParams);
    } else {
      try {
        const searchParams = new URLSearchParams(location.search);
        const idFromSearch = searchParams.get('interviewId');
        if (idFromSearch) {
          setCurrentInterviewId(idFromSearch);
        } else {
          setCurrentInterviewId(undefined);
        }
      } catch (e) {
        console.warn("Could not parse searchParams for interviewId in PageChange detection:", e);
        setCurrentInterviewId(undefined);
      }
    }
  }, [params, location.search]);
  
  useEffect(() => {
    if (!isTabVisible) {
      console.warn('Tab switch detected!');
      warning('Page change detected: Please remain on the interview tab.');

      if (currentInterviewId) {
        reportViolation(currentInterviewId, { type: "TAB_SWITCH", timestamp: new Date() })
          .then(() => {
            console.log(`Violation (TAB_SWITCH) reported for interview ${currentInterviewId}`);
          })
          .catch((err: unknown) => {
            console.error(`Failed to report TAB_SWITCH violation for interview ${currentInterviewId}:`, err);
            if (err instanceof Error) {
              // You could use err.message here if needed, e.g., for a more specific user warning
            }
          });
      } else {
        console.warn("Tab switch detected, but no interviewId found. Violation not reported to server.");
      }
    }
  }, [isTabVisible, warning, currentInterviewId]);
  
  return (
    <>
    </>
  );
};

export default InterviewSession;
