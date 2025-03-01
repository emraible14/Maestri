import { Card } from "primereact/card";

function Home() {

  const mapHeader = (
    <img alt="Card" className="" src="https://images.genius.com/073372f6cd316f7c68b4c4b7d8c610c9.675x675x1.jpg"/>
  );
  const artistHeader = (
    <img alt="Card" src="https://images.genius.com/df3ebb0ffe60340ec5ca9b5139c24649.675x675x1.jpg"/>
  );


  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <h1>Welcome to Maestri</h1>
        <p>Your one-stop shop for comparing artists, here you'll find who's contributing to who.</p>
        <h4>Get started!</h4>
      </div>c
      
      <div className="flex flex-row justify-center" >
        <div className="flex flex-row w-1/2">
          <a href="/network" className="no-underline">
            <Card title="Explore Connections" subTitle="See how different artists have collaborated" header={mapHeader}/>
          </a>
          <div className="w-1/10"/>
          <a href="/artist" className="no-underline">
            <Card title="Artist" subTitle="Checkout a random artist and their contributors" header={artistHeader}/>
          </a>
        </div>

      </div>
    </div>
  )
}

export default Home