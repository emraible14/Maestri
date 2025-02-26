import { Button } from "primereact/button";
import { Card } from "primereact/card";

function Home() {

  const header = (
    <img alt="Card" className="" src="https://images.genius.com/073372f6cd316f7c68b4c4b7d8c610c9.675x675x1.jpg"/>
  );


  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <h1>Maestri App Home</h1>
      </div>
      <p>Welcome to Maestri your one-stop shop for comparing artists</p>
      
      <div className="flex flex-row justify-center w-90% h-60% gap-10" >
        <a href="/mapview" className="w-1/4 no-underline">
          <Card title="Map" subTitle="See how your favorite artist charts around the world" header={
              <img alt="Card" src="https://images.genius.com/073372f6cd316f7c68b4c4b7d8c610c9.675x675x1.jpg"/>
            }/>
        </a>
        <a href="/artist" className="w-1/4 no-underline">
          <Card title="Artist" subTitle="Checkout a random artist and their contributors" header={
              <img alt="Card" src="https://images.genius.com/df3ebb0ffe60340ec5ca9b5139c24649.675x675x1.jpg"/>
            }/>
        </a>
      </div>
    </div>
  )
}

export default Home