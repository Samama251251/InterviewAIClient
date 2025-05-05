import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthContextProvider } from '@/contexts/AuthContext.tsx'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ToastProvider } from '@/hooks/useToast.tsx'

const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client = {queryClient}>
      <AuthContextProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthContextProvider>
      </QueryClientProvider>
)
