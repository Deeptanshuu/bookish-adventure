import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import LeaderBoard from './LeaderBoard.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/lb" element={<LeaderBoard />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
)