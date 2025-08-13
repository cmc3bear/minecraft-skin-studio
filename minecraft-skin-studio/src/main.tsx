import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { validateEnvironment, envConfig } from './config/environment'

// Validate environment variables before app initialization
try {
  validateEnvironment();
  
  // Log environment info in development mode
  if (import.meta.env.DEV) {
    envConfig.logEnvironmentInfo();
  }
} catch (error) {
  console.error('Environment validation failed:', error);
  // Display error in UI instead of crashing silently
  document.getElementById('root')!.innerHTML = `
    <div style="padding: 20px; color: red; font-family: monospace;">
      <h1>Configuration Error</h1>
      <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
      <p>Please check your .env file and restart the application.</p>
    </div>
  `;
  throw error; // Re-throw to prevent app from starting
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
