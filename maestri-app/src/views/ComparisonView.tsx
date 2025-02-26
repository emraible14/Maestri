import { useEffect, useState } from "react";
import { Artist } from "../utils/interfaces";
import RadarChart from "../components/RadarChart";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import BarChart from "../components/BarChart";
import { getBarKeysFromType } from "../utils/dataUtilities";
import { DataModel } from "../DataModel";
import { nivoDarkColorPalette } from "../utils/colorUtilities";

interface ComparisonProps {
  readonly model: DataModel;
  readonly artists?: Array<Artist>;
}

function Comparison(props: ComparisonProps) {

    const [currentArtists, setCurrentArtists] = useState(props.artists || []);


    if (currentArtists.length === 0) {
      const defaultIds = [-4043408050707122655, 3838202909945381961, 8568695472008302015, -4863524118309718222,  -753560469549657056];
      const defaultArtists = props.model.getSpecificArtists(defaultIds);
      console.log(defaultArtists);
      setCurrentArtists(defaultArtists);
    }

    const radarPoints = [
      "avg. team size",
      "# weeks on chart",
      "# top 10 tracks",
      'avg. samples/interpolations used',
      "# charting tracks",
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
    const barType = "# weeks on charts"
    const barKeys = getBarKeysFromType(barType)
    const darkColors = Object.keys(nivoDarkColorPalette);

    const barData: Array<{[key: string]: string | number}> = [];
    currentArtists.forEach((artist, i1) => {
      const result: {[key: string]: string | number} = {};
      result[barIndexKey] = artist.name;
      const artistColor = darkColors[i1];
      barKeys.forEach((key, i2) => {
        result[key] = Math.floor(Math.random() * (Math.floor(20) - Math.ceil(1) + 1) + Math.ceil(1)); // random value
        result[key+"Color"] = nivoDarkColorPalette[artistColor][i2];
      });
      barData.push(result);
    });

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

    function singleArtist(artist: Artist, index: number) {
      function removeArtist() {
        setCurrentArtists(currentArtists.filter((art) => art.artist_id !== artist.artist_id))
      }

      const artistImageLink = artist.image_link || "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg";
      const header = (
        <div className="rounded-s header-image" style={{ border: "7px solid " +  darkColors[index]}}>
          <img src={artistImageLink} alt={"image of " + artist.name} ></img>
        </div>
      );
      const footer = (
        <div>
            <Button onClick={removeArtist} label={"Remove Arist"} icon="pi pi-times" rounded outlined severity="danger" aria-label="Cancel" disabled={currentArtists.length === 1}/>
        </div>
      );

      return (
        <Card key={artist.artist_id} title={artist.name} header={header} footer={footer} className="margin-10">
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
          <Card className="margin-10 justify-items-center content-center" header={header}>
            <Dropdown value={null}  onChange={addArtist} options={props.model.getArtists()} optionLabel="name" placeholder="Select an Artist" filter/>
          </Card>
        );
      }
    }
    
  }
  
  export default Comparison