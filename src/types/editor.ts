export interface EditorProps {
  code?: string;
  language?: string;
  theme?: 'light' | 'dark';
  onChange?: (value: string) => void;
} 