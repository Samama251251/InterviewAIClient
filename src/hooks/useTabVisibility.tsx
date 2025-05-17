import { useCallback, useEffect, useState, useRef } from 'react';

const useTabVisibility = () => {
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [switchCount, setSwitchCount] = useState(0);
  const fullscreenEventRecentRef = useRef(false);
  const timeoutIdRef = useRef<number | null>(null); // For browser, setTimeout returns a number

  // This function updates the state based on visibility.
  // It's called by handleVisibilityChange when a change is not ignored.
  const updateVisibilityState = useCallback((isVisible: boolean) => {
    setIsTabVisible(isVisible);
    if (!isVisible) {
      setSwitchCount(prevCount => prevCount + 1);
    }
  }, []); // Dependencies: setIsTabVisible and setSwitchCount are stable

  const handleVisibilityChange = useCallback(() => {
    // If a fullscreen event happened recently and the tab is now trying to become hidden,
    // ignore this specific "hidden" event as it might be part of the transition.
    if (fullscreenEventRecentRef.current && document.visibilityState === 'hidden') {
      console.log("Tab hidden event ignored due to recent fullscreen change.");
      return;
    }
    updateVisibilityState(document.visibilityState === 'visible');
  }, [updateVisibilityState]); // Dependency: updateVisibilityState

  const handleFullscreenChange = useCallback(() => {
    fullscreenEventRecentRef.current = true;
    if (timeoutIdRef.current !== null) {
      clearTimeout(timeoutIdRef.current);
    }
    timeoutIdRef.current = window.setTimeout(() => { // Explicitly use window.setTimeout
      fullscreenEventRecentRef.current = false;
    }, 300); // 300ms window to ignore visibility changes
  }, []); // Dependencies: refs are stable
  
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    // Consider adding vendor-prefixed versions for older browsers if necessary,
    // though 'fullscreenchange' is widely supported.
    // e.g., document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (timeoutIdRef.current !== null) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [handleVisibilityChange, handleFullscreenChange]);
  
  return { isTabVisible, switchCount };
};

export default useTabVisibility;
