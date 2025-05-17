import React from 'react';
import CopyPasteDetection from "../Detection/copyPasteDetection";
import PageChange from "../Detection/pageChange";
import DetectSnapMode from "../Detection/detectSnapMode";

interface InterviewPageWrapperProps {
  children: React.ReactNode;
}

const InterviewPageWrapper: React.FC<InterviewPageWrapperProps> = ({ children }) => {
  return (
    <>
      {children}
      <CopyPasteDetection />
      <PageChange />
      <DetectSnapMode />
    </>
  );
};

export default InterviewPageWrapper; 