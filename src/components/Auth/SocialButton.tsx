import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface SocialButtonProps {
  provider: 'google' | 'github';
  onClick: () => Promise<void>;
  icon: LucideIcon;
  text: string;
  isLoading?: boolean;
}

export function SocialButton({ provider, onClick, icon: Icon, text, isLoading = false }: SocialButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={isLoading}
      className={`
        btn btn-outline gap-2 w-full mb-3 
        ${provider === 'github' ? 'bg-neutral text-neutral-content hover:bg-neutral-focus' : ''}
        ${provider === 'google' ? 'bg-base-100 border-neutral-content/30 text-base-content hover:bg-base-200' : ''}
      `}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-sm"></span>
      ) : (
        <Icon size={20} />
      )}
      {text}
    </motion.button>
  );
} 