import { useState, useEffect } from "react";

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
  }, [previousWidth, onSnapModeChange, snapThresholdPercentage]);

  return (
    <>
      {/* This is a non-visual component, but you could render something that shows snap state */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ position: 'fixed', bottom: 0, right: 0, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '5px', fontSize: '12px', zIndex: 9999 }}>
          {isSnapped ? 'Window Snapped' : 'Window Normal'}
        </div>
      )}
    </>
  );
};

export default DetectSnapMode;