// import 'primereact/resources/themes/lara-dark-amber/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { BrowserRouter, Route, Routes} from "react-router-dom";

import Home from './views/Home';
import Artist from './views/ArtistView';
import Comparison from './views/ComparisonView';
import Network from './views/NetworkView';
import MapView from './views/MapView';
import Navbar from './components/Navbar';
import { DataModel } from './DataModel';

function App(props: { readonly model: DataModel }) {
    return (
        <div>
        <Navbar/>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/artist" element={<Artist model={props.model}/>}></Route>
                <Route path="/comparison" element={<Comparison model={props.model}/>}></Route>
                <Route path="/network" element={<Network model={props.model}/>}></Route>
                <Route path="/mapview" element={<MapView/>}></Route>
            </Routes>
        </BrowserRouter>
        </div>
    )
}

export default App
