import React, { useEffect, useState } from 'react';
import Vapi from "@vapi-ai/web";
import { KnowledgeBasedInterviewProps } from './types';
import Button from './Button';
import ActiveCallDetail from './ActiveCallDetail';

// Initialize Vapi with your key
const vapi = new Vapi("10b7081e-70b3-472f-9c24-fc0ef584c46a");

const KnowledgeBasedInterview: React.FC<KnowledgeBasedInterviewProps> = ({ resume, role, frameworks }) => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [interviewComplete, setInterviewComplete] = useState(false);

  // hook into Vapi events
  console.log(resume, role, frameworks);
  useEffect(() => {
    vapi.on("call-start", () => {
      setConnecting(false);
      setConnected(true);
    });

    vapi.on("call-end", () => {
      setConnecting(false);
      setConnected(false);
      setInterviewComplete(true);
    });

    vapi.on("speech-start", () => {
      setAssistantIsSpeaking(true);
    });

    vapi.on("speech-end", () => {
      setAssistantIsSpeaking(false);
    });

    vapi.on("volume-level", (level) => {
      setVolumeLevel(level);
    });

    vapi.on("error", (error) => {
      console.error(error);
      setConnecting(false);
    });

  }, []);
  const assistantOptions = {
    clientMessages: [
      "conversation-update",
      "function-call",
      "hang",
      "model-output",
      "speech-update",
      "status-update",
      "transcript"
    ],
    serverMessages: [
      "conversation-update",
      "end-of-call-report",
      "function-call"
    ],
    name: "Technical Interviewer", 
    server: {
      url: "https://heard-dealt-rt-dial.trycloudflare.com/api/end-of-call-report"
    },
    firstMessage: "Hello! I'll be conducting your technical interview today. I'll ask you questions based on your experience and the role you're applying for. Let's begin!",
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en-US",
    },
    voice: {
      provider: "playht",
      voiceId: "jennifer",
    },
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert technical interviewer conducting a knowledge-based interview. 
The role they are applying for:
${JSON.stringify(role)}
            Required frameworks and technologies:
            ${JSON.stringify(frameworks)}

            Your task is to:
            1. Ask relevant technical questions based on their experience and the role requirements
            2. Focus on their projects and past experiences mentioned in their resume
            3. Ask follow-up questions to dive deeper into their technical knowledge
            4. Evaluate their responses and ask for clarification when needed
            5. Keep the conversation professional but conversational
            6. After 5-6 questions, conclude the interview with a summary

            Guidelines for questions:
            - Start with easier questions and gradually increase difficulty
            - Mix theoretical and practical questions
            - Ask about specific technologies mentioned in their resume
            - Include scenario-based questions related to their experience
            - Ask about their problem-solving approach in past projects
            - Focus on the required frameworks and technologies for this role
            - Ask about their experience with the specific role requirements

            Keep your responses concise and focused. After each answer, provide brief feedback and move to the next question.
            If the candidate goes off-topic, politely guide them back to the question.
            After 5-6 questions, thank them and conclude the interview.`
        },
      ],
    },
  };

  const startInterview = () => {
    setConnecting(true);
    vapi.start(assistantOptions as unknown as Parameters<typeof vapi.start>[0]);
  };

  const endInterview = () => {
    vapi.stop();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-base-100">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-3xl font-bold mb-8">Knowledge-Based Interview</h1>
        
        {!connected ? (
          <div className="space-y-4">
            <p className="text-lg mb-4">
              {interviewComplete 
                ? "Thank you for completing the interview!"
                : "Click the button below to start your technical interview"}
            </p>
            <Button
              label={interviewComplete ? "Start New Interview" : "Start Interview"}
              onClick={startInterview}
              isLoading={connecting}
            />
          </div>
        ) : (
          <div className="space-y-8">
            <ActiveCallDetail
              assistantIsSpeaking={assistantIsSpeaking}
              volumeLevel={volumeLevel}
              onEndCallClick={endInterview}
            />
            
            <div className="mt-8 p-6 bg-base-200 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Interview in Progress</h2>
              <p className="text-lg mb-4">
                {assistantIsSpeaking 
                  ? "The interviewer is speaking..."
                  : "Please provide your response..."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBasedInterview; 