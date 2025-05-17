import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { useParams, useLocation } from 'react-router-dom';
import { reportViolation } from '../../services/interviewService';

const CopyPasteDetectionComponent = () => {
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
        console.warn("Could not parse searchParams for interviewId in CopyPasteDetection:", e);
        setCurrentInterviewId(undefined);
      }
    }
  }, [params, location.search]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      console.log("User pasted something!");
      warning("Copy-paste detected: Content has been pasted.");
      if (currentInterviewId) {
        reportViolation(currentInterviewId, { type: "COPY_PASTE", timestamp: new Date() })
          .then(() => console.log(`Violation (COPY_PASTE - paste) reported for ${currentInterviewId}`))
          .catch((err: unknown) => console.error(`Failed to report COPY_PASTE - paste for ${currentInterviewId}:`, err));
      } else {
        console.warn("Paste detected, but no interviewId found. Violation not reported to server.");
      }
    };

    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [warning, currentInterviewId]);

  return (
    <>
      {/* This component does not render anything visible */}
    </>
  );
};

export default CopyPasteDetectionComponent;
