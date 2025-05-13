import React, { useEffect, useState } from 'react';
import Vapi from "@vapi-ai/web";
import { KnowledgeBasedInterviewProps } from './types';
import Button from './Button';
import ActiveCallDetail from './ActiveCallDetail';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// Initialize Vapi with your key
const vapi = new Vapi("10b7081e-70b3-472f-9c24-fc0ef584c46a");

const KnowledgeBasedInterview: React.FC<KnowledgeBasedInterviewProps> = ({ 
  resume, 
  role, 
  frameworks,
  interviewId,
  roundIndex 
}) => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);
  const [associationError, setAssociationError] = useState<string | null>(null);
  const [associationSuccess, setAssociationSuccess] = useState(false);

  // hook into Vapi events
  console.log(resume, role, frameworks);
  useEffect(() => {
    vapi.on("call-start", () => {
      // call-start doesn't provide the call ID
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

  // Effect to associate the call ID with the interview round when callId is set
  useEffect(() => {
    const associateCallId = async () => {
      if (callId && interviewId && roundIndex !== undefined) {
        try {
          setAssociationError(null);
          setAssociationSuccess(false);
          const response = await axios.post(
            `http://localhost:5000/api/interviews/${interviewId}/associate-call`,
            { callId, roundIndex },
            { withCredentials: true }
          );
          console.log('Call ID associated with interview round:', response.data);
          setAssociationSuccess(true);
        } catch (error) {
          console.error('Failed to associate call ID with interview round:', error);
          setAssociationError('Failed to associate call with interview. The transcript may not be saved.');
          setAssociationSuccess(false);
        }
      }
    };

    associateCallId();
  }, [callId, interviewId, roundIndex]);

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
      url: "http://localhost:5000/api/end-of-call-report"
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

  const startInterview = async () => {
    setConnecting(true);
    try {
      // vapi.start returns a Promise that resolves with the call object
      const call = await vapi.start(assistantOptions as unknown as Parameters<typeof vapi.start>[0]);
      // Save the call ID from the returned call object

      console.log(" this is the call object", call);
      if (call && call.id) {
        setCallId(call.id);
        console.log("Call started with ID:", call.id);
      }
    } catch (error) {
      console.error("Failed to start call:", error);
      setConnecting(false);
    }
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
            
            <motion.div 
              className="mt-8 p-6 bg-base-200 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold mb-4">Interview in Progress</h2>
              <AnimatePresence>
                {associationError && (
                  <motion.p 
                    className="text-sm text-error mb-2 px-3 py-2 bg-error bg-opacity-10 rounded"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {associationError}
                  </motion.p>
                )}
                {associationSuccess && (
                  <motion.p 
                    className="text-sm text-success mb-2 px-3 py-2 bg-success bg-opacity-10 rounded"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    Interview session successfully linked. Your conversation will be saved.
                  </motion.p>
                )}
              </AnimatePresence>
              <p className="text-lg mb-4">
                {assistantIsSpeaking 
                  ? "The interviewer is speaking..."
                  : "Please provide your response..."}
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBasedInterview; 