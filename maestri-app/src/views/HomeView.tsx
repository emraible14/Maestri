import { Card } from "primereact/card";
import {useNavigate} from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const mapHeader = (
    <img alt="Card" className="" src="https://images.genius.com/3cabe9f21c01e9758d908e30fc1cd772.1000x1000x1.jpg"/>
  );
  const artistHeader = (
    <img alt="Card" src="https://images.genius.com/4ed0ec8b6c4f5b4f5b74d72f83877d72.1000x1000x1.jpg"/>
  );


  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <h1>Welcome to Maestri</h1>
        <p>Your one-stop shop for comparing artists, here you'll find who's contributing to who.</p>
        <h4>Get started!</h4>
      </div>
      
      <div className="flex flex-row justify-center" >
        <div className="flex flex-row w-1/2">
          <div onClick={() =>  navigate('/artist?id=1405')}>
            <Card title="Artist" subTitle="Check out an artist and their contributors" header={artistHeader}/>
          </div>
          <div className="w-1/10"/>
            <div onClick={() =>  navigate('/network?id=447')}>
              <Card title="Explore Connections" subTitle="See how different artists have collaborated" header={mapHeader}/>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home