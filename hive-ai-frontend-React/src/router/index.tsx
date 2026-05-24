import { HomePage } from '@/pages/HomePage'
import { ManusChatPage } from '@/pages/ManusChatPage'
import { StudyChatPage } from '@/pages/StudyChatPage'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/study', element: <StudyChatPage /> },
  { path: '/manus', element: <ManusChatPage /> },
])
