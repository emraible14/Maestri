import { useState } from "react";
import { Artist } from "../utils/interfaces";
import RadarChart from "../components/RadarChart";

interface ComparisonProps {
   readonly artists?: Array<Artist>;
}

function Comparison(props: ComparisonProps) {

    const [artists, setArtists] = useState(props.artists || []);

    if (artists.length === 0) {
      setArtists([
        {
          id: 1,
          name: "Eminem",
          image: "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg",
        },
        {
          id: 2,
          name: "Taylor Swift",
          image: "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg",
        },
        {
          id: 3,
          name: "Madonna",
          image: "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg",
        },
        {
          id: 4,
          name: "Avicii",
          image: "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg",
        },
        {
          id: 5,
          name: "Beyonce",
          image: "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg",
        },
      ]);
    }

    return (
      <>
        <h1>Compare Artists</h1>

        <div className="px-8 grid grid-cols-5">
          { artists.map(singleArtist) }
        </div>
        <div>
          <RadarChart data={null}></RadarChart>
        </div>
      </>
    );

    function singleArtist(artist: Artist) {
      return (
        <div key={artist.id}>
          <h2>{ artist.name }</h2>
          <img src={artist.image} width={150} alt={"image of " + artist.name}></img>
          <br/>
          <div>TBD</div>
        </div>
      )
    }
  }
  
  export default Comparison