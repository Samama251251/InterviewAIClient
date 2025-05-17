import { useCallback, useEffect, useState } from 'react';

const useTabVisibility = () => {
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [switchCount, setSwitchCount] = useState(0);
  
  const handleVisibilityChange = useCallback(() => {
    const isVisible = document.visibilityState === 'visible';
    setIsTabVisible(isVisible);
    
    if (!isVisible) {
      setSwitchCount(prevCount => prevCount + 1);
    }
  }, []);
  
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);
  
  return { isTabVisible, switchCount };
};

export default useTabVisibility;
