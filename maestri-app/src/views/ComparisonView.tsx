import { useEffect, useState } from "react";
import { Artist } from "../utils/interfaces";
import RadarChart from "../components/RadarChart";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import BarChart from "../components/BarChart";
import artistsJson from "../../../data/artists.json";

interface ComparisonProps {
   readonly artists?: Array<Artist>;
}

function Comparison(props: ComparisonProps) {

    const [currentArtists, setCurrentArtists] = useState(props.artists || []);
    const [allArtists, setAllArtists] = useState([]);
    useEffect(generateData, []);

    function generateData() {
      setAllArtists(artistsJson);
      // setAllArtists(artistsJson.map((art: Artist) => { return art.name }));
    }
    console.log(artistsJson)
    

    if (currentArtists.length === 0) {
      const defaultIds = [-4043408050707122655, 3838202909945381961, 8568695472008302015, -4863524118309718222,  -753560469549657056];
      const defaultArtists = artistsJson.filter((art: Artist) => defaultIds.includes(art.artist_id))
      setCurrentArtists(defaultArtists);
    }

    const radarPoints = [
      "top chart",
      "avg. team size",
      "# weeks on chart",
      "# top 5 tracks",
      "# credits"
    ];
    const radarIndexKey = "attribute";
    const radarData: Array<{[key: string]: string | number}> = [];
    radarPoints.forEach((point) => {
      const result: {[key: string]: string | number} = {};
      result[radarIndexKey] = point;
      currentArtists.forEach((artist) => {
        result[artist.name] = Math.floor(Math.random() * (Math.floor(20) - Math.ceil(1) + 1) + Math.ceil(1)); // random value
      });
      radarData.push(result)
    })
    const radarKeys = currentArtists.map((artist) => { return artist.name });

    const barIndexKey = "artist";
    const barKeys = [
      '1 week',
      '2-5 weeks',
      '6-10 weeks',
      '11+ weeks',
    ]

    const barData: Array<{[key: string]: string | number}> = [];
    currentArtists.forEach((artist) => {
      const result: {[key: string]: string | number} = {};
      result[barIndexKey] = artist.name;
      barKeys.forEach((key) => {
        result[key] = Math.floor(Math.random() * (Math.floor(20) - Math.ceil(1) + 1) + Math.ceil(1)); // random value
      });
      barData.push(result);
    });
    console.log(barData)
    const barType = "weeks on charts"

    return (
      <>
        <div className="grid grid-cols-5 justify-around">
          { currentArtists.map(singleArtist) }
          { addArtistCard() }
        </div>
        <div className="flex justify-around">
          <RadarChart data={radarData} keys={radarKeys} indexKey={radarIndexKey}></RadarChart>
          <BarChart data={barData} keys={barKeys} indexKey={barIndexKey} type={barType}></BarChart>
        </div>
      </>
    );

    function singleArtist(artist: Artist) {
      function removeArtist() {
        setCurrentArtists(currentArtists.filter((art) => art.artist_id !== artist.artist_id))
      }

      const artistImageLink = artist.image_link || "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg";
      const header = (
        <div className="rounded-s header-image">
          <img src={artistImageLink} alt={"image of " + artist.name}></img>
        </div>
      );
      const footer = (
        <div>
            <Button onClick={removeArtist} label={"Remove Arist"} icon="pi pi-times" rounded outlined severity="danger" aria-label="Cancel" disabled={currentArtists.length === 1}/>
        </div>
      );

      return (
        <Card key={artist.artist_id} title={artist.name} className="margin-10 md:w-25rem" header={header} footer={footer}>
            <div>More details here</div>
        </Card>
      )
    }

    function addArtistCard() {
      function addArtist(event) {
        console.log(event)
      }

      const header = (
        <div>
          <i className="pi pi-plus" style={{ fontSize: '6rem' }}></i>
        </div>
      );

      if (currentArtists.length < 5) {
        return (
          <Card className="margin-10 md:w-25rem justify-items-center content-center" header={header}>
            <Dropdown value={null}  onChange={addArtist} options={allArtists} optionLabel="name" placeholder="Select an Artist" filter />
          </Card>
        );
      }
    }
    
  }
  
  export default Comparison