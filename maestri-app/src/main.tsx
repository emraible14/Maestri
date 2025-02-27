import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PrimeReactProvider } from 'primereact/api'
import { DataModel } from './DataModel.ts'

const dataModel = new DataModel();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider value={{ unstyled: false }}>
      <App model={dataModel}/>
    </PrimeReactProvider>
  </StrictMode>,
)
