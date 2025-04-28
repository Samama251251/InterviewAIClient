import { motion } from 'framer-motion';

interface EditorToolbarProps {
  onLanguageChange: (language: string) => void;
  onThemeChange: () => void;
  onSubmit: () => void;
  currentLanguage: string;
  theme: string;
}

const EditorToolbar = ({
  onLanguageChange,
  onThemeChange,
  onSubmit,
  currentLanguage,
  theme,
}: EditorToolbarProps) => {
  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700"
    >
      <div className="flex items-center space-x-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative inline-block"
        >
          <select
            value={currentLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="appearance-none bg-gray-700 text-gray-100 px-4 py-2 pr-8 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSubmit}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center space-x-2"
        >
          <span>Submit</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </motion.button>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onThemeChange}
        className="p-2.5 rounded-lg bg-gray-700 text-gray-100 hover:bg-gray-600 transition-colors duration-200"
      >
        {theme === 'dark' ? '🌞' : '🌙'}
      </motion.button>
    </motion.div>
  );
};

export default EditorToolbar; 