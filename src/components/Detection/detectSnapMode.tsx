import { useState, useEffect } from "react";
import { useToast } from "@/hooks/useToast";
import { useParams, useLocation } from 'react-router-dom';
import { reportViolation } from '../../services/interviewService';

interface SnapModeProps {
  onSnapModeChange?: (isSnapped: boolean) => void;
  snapThresholdPercentage?: number; // What percentage width change indicates a snap
}

const DetectSnapMode: React.FC<SnapModeProps> = ({
  onSnapModeChange,
  snapThresholdPercentage = 30, // Default: 30% width change indicates snap
}) => {
  const [isSnapped, setIsSnapped] = useState<boolean>(false);
  const [previousWidth, setPreviousWidth] = useState<number>(window.innerWidth);
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
        console.warn("Could not parse searchParams for interviewId in DetectSnapMode:", e);
        setCurrentInterviewId(undefined);
      }
    }
  }, [params, location.search]);

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      // Clear timeout if it exists
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      // Add a small delay to avoid processing every single resize event
      resizeTimeout = setTimeout(() => {
        const currentWidth = window.innerWidth;
        const widthChangePercentage = Math.abs(currentWidth - previousWidth) / previousWidth * 100;

        // Determine if this is a snap event based on width change percentage
        const snapOccurred = widthChangePercentage >= snapThresholdPercentage;
        
        if (snapOccurred) {
          const newSnappedState = currentWidth < previousWidth;
          setIsSnapped(newSnappedState);
          onSnapModeChange?.(newSnappedState);

          if (newSnappedState) {
            warning("Snap mode detected: Window has been resized to a snap layout.");
            if (currentInterviewId) {
              reportViolation(currentInterviewId, { type: "SNAP_MODE", timestamp: new Date() })
                .then(() => console.log(`Violation (SNAP_MODE) reported for ${currentInterviewId}`))
                .catch((err: unknown) => console.error(`Failed to report SNAP_MODE for ${currentInterviewId}:`, err));
            } else {
              console.warn("Snap mode detected, but no interviewId found. Violation not reported to server.");
            }
          }
        }
        
        // Update previous width
        setPreviousWidth(currentWidth);
      }, 250);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
    };
  }, [previousWidth, onSnapModeChange, snapThresholdPercentage, warning, currentInterviewId]);

  return (
    <>
      {/* Development-only visual indicator can be removed if not desired */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ position: 'fixed', bottom: 0, right: 0, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px', fontSize: '12px', zIndex: 9999 }}>
          {isSnapped ? 'Window Snapped (Dev)' : 'Window Normal (Dev)'}
        </div>
      )}
    </>
  );
};

export default DetectSnapMode;