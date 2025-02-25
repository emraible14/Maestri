import 'primereact/resources/themes/lara-dark-amber/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { BrowserRouter as Router, Route, Routes} from "react-router-dom";

import Home from './views/Home';
import Artist from './views/ArtistView';
import Comparison from './views/ComparisonView';
import Network from './views/NetworkView';
import MapView from './views/MapView';
import Navbar from './components/Navbar';

function App() {
  return (
    <div>
      <Navbar/>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/artist" element={<Artist/>}></Route>
          <Route path="/comparison" element={<Comparison/>}></Route>
          <Route path="/network" element={<Network/>}></Route>
          <Route path="/mapview" element={<MapView/>}></Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App
