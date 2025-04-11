import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PrimeReactProvider } from 'primereact/api'
import { DataModel } from './DataModel.ts'



const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <PrimeReactProvider value={{ unstyled: false }}>
        <p>Loading...</p>
    </PrimeReactProvider>
  </StrictMode>
);


const initializeApp = async () => {
  const dataModel = new DataModel();
  await dataModel.loadData();

  root.render(
    <StrictMode>
      <PrimeReactProvider value={{ unstyled: false }}>
        <App model={dataModel}/>
      </PrimeReactProvider>
    </StrictMode>
  );
};

initializeApp()
