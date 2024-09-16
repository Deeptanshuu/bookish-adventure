import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, ColorModeScript  } from '@chakra-ui/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import LeaderBoard from './LeaderBoard.jsx'
import './index.css'
import Theme from './Theme.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider theme={Theme}>
      <ColorModeScript initialColorMode={Theme.config.initialColorMode} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/lb" element={<LeaderBoard />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>,
)