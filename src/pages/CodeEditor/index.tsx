import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EditorToolbar from '@/components/common/EditorToolbar';
import Editor from '@monaco-editor/react';

const CodeEditor = () => {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState('light');
  const [code, setCode] = useState('// Start coding here...');
  const [language, setLanguage] = useState('javascript');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const handleThemeChange = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSubmit = () => {
    // Handle code submission here
    console.log('Submitting code:', code);
  };

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100"
    >
      <div className="max-w-7xl mx-auto p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700"
        >
          <EditorToolbar
            onLanguageChange={handleLanguageChange}
            onThemeChange={handleThemeChange}
            onSubmit={handleSubmit}
            currentLanguage={language}
            theme={theme}
          />
          <div className="h-[calc(100vh-16rem)]">
            <Editor
              height="100%"
              language={language}
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              value={code}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                padding: { top: 20, bottom: 20 },
                smoothScrolling: true,
                cursorSmoothCaretAnimation: 'on',
                cursorBlinking: 'phase',
                renderLineHighlight: 'all',
              }}
              className="px-4"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CodeEditor; 