import { useEffect } from 'react';
import useTabVisibility from '../../hooks/useTabVisibility';
import axios from 'axios';

const InterviewSession = () => {
  const { isTabVisible, switchCount } = useTabVisibility();
  
  useEffect(() => {
    if (!isTabVisible) {
      console.warn('Tab switch detected!');
        alert('Please do not leave the interview tab. This incident has been recorded.');
        axios.post('/api/interview/violation', {
        type: 'TAB_SWITCH',
        timestamp: new Date().toISOString()
      });
    }
  }, [isTabVisible]);
  
  useEffect(() => {
    if (switchCount >= 3) {
      axios.post('/api/interview/terminate', {
        reason: 'EXCESSIVE_TAB_SWITCHING',
        count: switchCount
      });
    }
  }, [switchCount]);
  
  return (
    <>
    </>
  );
};

export default InterviewSession;
