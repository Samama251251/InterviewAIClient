import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthContextProvider } from '@/contexts/AuthContext.tsx'
import { TooltipProvider } from '@/components/ui/tooltip'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(

    <TooltipProvider>
    <QueryClientProvider client = {queryClient}>
      <AuthContextProvider>
        <App />
        <ReactQueryDevtools/>
      </AuthContextProvider>
      </QueryClientProvider>
    </TooltipProvider>

)
