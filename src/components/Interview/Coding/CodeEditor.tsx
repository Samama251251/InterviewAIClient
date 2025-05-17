import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { CodingProblem as CodingProblemType } from '@/data/codingProblems';
import { reportViolation } from '@/services/interviewService';
import { useToast } from '@/hooks/useToast';

interface CodeEditorProps {
  problem: CodingProblemType;
  onCodeChange: (code: string) => void;
  language: 'javascript' | 'python';
  interviewId?: string | null;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ problem, onCodeChange, language, interviewId }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef<HTMLDivElement>(null);
  const { warning } = useToast();

  useEffect(() => {
    if (monacoEl.current && !editorRef.current) {
      const editor = monaco.editor.create(monacoEl.current, {
        value: problem.starterCode[language],
        language: language === 'javascript' ? 'javascript' : 'python',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: {
          enabled: false
        },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        tabSize: 2,
        wordWrap: 'on'
      });
      editorRef.current = editor;

      const modelContentListener = editor.onDidChangeModelContent(() => {
        const code = editor.getValue() || '';
        onCodeChange(code);
      });

      const pasteListener = editor.onDidPaste((e: monaco.editor.IPasteEvent) => {
        warning("Copy-paste detected, please do not copy-paste code.");
        if (interviewId) {
          reportViolation(interviewId, { type: "COPY_PASTE", timestamp: new Date() })
            .then(() => console.log(`Violation (COPY_PASTE - editor paste) reported for ${interviewId}`))
            .catch((err: unknown) => console.error(`Failed to report COPY_PASTE (editor paste) for ${interviewId}:`, err));
        } else {
          console.warn("Paste detected in editor, but no interviewId provided. Violation not reported.");
        }
      });

      return () => {
        modelContentListener.dispose();
        pasteListener.dispose();
        editor.dispose();
        editorRef.current = null;
      };
    }
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      if (editorRef.current.getModel()?.getLanguageId() !== language) {
        monaco.editor.setModelLanguage(editorRef.current.getModel()!, language);
      }
      if (editorRef.current.getValue() !== problem.starterCode[language]) {
        editorRef.current.setValue(problem.starterCode[language]);
      }
    }
  }, [language, problem.starterCode]);

  return (
    <div className="h-full w-full">
      <div ref={monacoEl} className="h-full w-full" />
    </div>
  );
}; 