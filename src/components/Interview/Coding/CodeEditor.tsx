import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { CodingProblem } from '@/data/codingProblems';

interface CodeEditorProps {
  problem: CodingProblem;
  onCodeChange: (code: string) => void;
  language: 'javascript' | 'python';
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ problem, onCodeChange, language }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (monacoEl.current) {
      editorRef.current = monaco.editor.create(monacoEl.current, {
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

      // Add change listener
      editorRef.current.onDidChangeModelContent(() => {
        const code = editorRef.current?.getValue() || '';
        onCodeChange(code);
      });
    }

    return () => {
      editorRef.current?.dispose();
    };
  }, [language, problem.id]);

  return (
    <div className="h-full w-full">
      <div ref={monacoEl} className="h-full w-full" />
    </div>
  );
}; 