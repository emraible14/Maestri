import { useState } from "react";
import { Artist } from "../utils/interfaces";

function Comparison(props) {

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

        <div className="flex flex-row">
          { artists.map(singleArtist) }
        </div>
      </>
    );

    function singleArtist(artist: Artist) {

      return <div key={artist.id}>
        <h2>{ artist.name }</h2>
      </div>
    }
  }
  
  export default Comparison