import { useState } from "react";
import { Artist } from "../utils/interfaces";
import RadarChart from "../components/RadarChart";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import BarChart from "../components/BarChart";

interface ComparisonProps {
   readonly artists?: Array<Artist>;
}

function Comparison(props: ComparisonProps) {

    const [artists, setArtists] = useState(props.artists || []);
    const artistsSearch = ['Eminem', 'Taylor Swift', 'Kendrick Lamar', 'SZA', 'Beyonce']

    if (artists.length === 0) {
      setArtists([
        {
          id: 1,
          name: "Eminem",
          image: "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg",
          "top chart": 1,
          "avg. team size": 3,
          "# weeks on chart": 5,
          "# top 5 tracks": 4,
          "# credits": 6,
        },
        {
          id: 2,
          name: "Taylor Swift",
          image: "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg",
          "top chart": 1,
          "avg. team size": 2,
          "# weeks on chart": 10,
          "# top 5 tracks": 10,
          "# credits": 20,
        },
        {
          id: 3,
          name: "Kendrick Lamar",
          image: "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg",
          "top chart": 3,
          "avg. team size": 6,
          "# weeks on chart": 7,
          "# top 5 tracks": 6,
          "# credits": 13,
        },
        {
          id: 4,
          name: "SZA",
          image: "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg",
          "top chart": 1,
          "avg. team size": 3,
          "# weeks on chart": 17,
          "# top 5 tracks": 2,
          "# credits": 9,
        },
        {
          id: 5,
          name: "Beyonce",
          image: "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg",
          "top chart": 1,
          "avg. team size": 7,
          "# weeks on chart": 9,
          "# top 5 tracks": 10,
          "# credits": 24,
        },
      ]);
    }

    const barData = [
      {
        "country": "AD",
        "hot dog": 20,
        "hot dogColor": "hsl(340, 70%, 50%)",
        "burger": 196,
        "burgerColor": "hsl(82, 70%, 50%)",
        "sandwich": 176,
        "sandwichColor": "hsl(311, 70%, 50%)",
        "kebab": 196,
        "kebabColor": "hsl(277, 70%, 50%)",
        "fries": 116,
        "friesColor": "hsl(49, 70%, 50%)",
        "donut": 85,
        "donutColor": "hsl(313, 70%, 50%)"
      },
      {
        "country": "AE",
        "hot dog": 26,
        "hot dogColor": "hsl(134, 70%, 50%)",
        "burger": 40,
        "burgerColor": "hsl(239, 70%, 50%)",
        "sandwich": 135,
        "sandwichColor": "hsl(260, 70%, 50%)",
        "kebab": 183,
        "kebabColor": "hsl(1, 70%, 50%)",
        "fries": 41,
        "friesColor": "hsl(159, 70%, 50%)",
        "donut": 74,
        "donutColor": "hsl(122, 70%, 50%)"
      },
      {
        "country": "AF",
        "hot dog": 191,
        "hot dogColor": "hsl(59, 70%, 50%)",
        "burger": 111,
        "burgerColor": "hsl(279, 70%, 50%)",
        "sandwich": 88,
        "sandwichColor": "hsl(294, 70%, 50%)",
        "kebab": 149,
        "kebabColor": "hsl(16, 70%, 50%)",
        "fries": 54,
        "friesColor": "hsl(40, 70%, 50%)",
        "donut": 91,
        "donutColor": "hsl(185, 70%, 50%)"
      },
      {
        "country": "AG",
        "hot dog": 131,
        "hot dogColor": "hsl(156, 70%, 50%)",
        "burger": 33,
        "burgerColor": "hsl(180, 70%, 50%)",
        "sandwich": 29,
        "sandwichColor": "hsl(288, 70%, 50%)",
        "kebab": 170,
        "kebabColor": "hsl(341, 70%, 50%)",
        "fries": 37,
        "friesColor": "hsl(255, 70%, 50%)",
        "donut": 6,
        "donutColor": "hsl(97, 70%, 50%)"
      },
      {
        "country": "AI",
        "hot dog": 5,
        "hot dogColor": "hsl(316, 70%, 50%)",
        "burger": 180,
        "burgerColor": "hsl(38, 70%, 50%)",
        "sandwich": 114,
        "sandwichColor": "hsl(78, 70%, 50%)",
        "kebab": 10,
        "kebabColor": "hsl(119, 70%, 50%)",
        "fries": 29,
        "friesColor": "hsl(181, 70%, 50%)",
        "donut": 72,
        "donutColor": "hsl(69, 70%, 50%)"
      },
      {
        "country": "AL",
        "hot dog": 166,
        "hot dogColor": "hsl(306, 70%, 50%)",
        "burger": 91,
        "burgerColor": "hsl(47, 70%, 50%)",
        "sandwich": 124,
        "sandwichColor": "hsl(65, 70%, 50%)",
        "kebab": 115,
        "kebabColor": "hsl(349, 70%, 50%)",
        "fries": 166,
        "friesColor": "hsl(244, 70%, 50%)",
        "donut": 12,
        "donutColor": "hsl(69, 70%, 50%)"
      },
      {
        "country": "AM",
        "hot dog": 186,
        "hot dogColor": "hsl(167, 70%, 50%)",
        "burger": 2,
        "burgerColor": "hsl(238, 70%, 50%)",
        "sandwich": 124,
        "sandwichColor": "hsl(265, 70%, 50%)",
        "kebab": 90,
        "kebabColor": "hsl(63, 70%, 50%)",
        "fries": 21,
        "friesColor": "hsl(324, 70%, 50%)",
        "donut": 78,
        "donutColor": "hsl(127, 70%, 50%)"
      }
    ];

    const chartPoints = ["top chart",
          "avg. team size",
          "# weeks on chart",
          "# top 5 tracks",
          "# credits"]
    const chartData: Array<{[key: string]: string | number}> = [];
    chartPoints.forEach((point) => {
      const result: {[key: string]: string | number} = {};
      result["taste"] = point;
      artists.forEach((artist) => {
        result[artist.name] = artist[point];
      });
      chartData.push(result)
    })
    const chartKeys = artists.map((artist) => { return artist.name });

    return (
      <>
        <div className="grid grid-cols-5 justify-around">
          { artists.map(singleArtist) }
          { addArtistCard() }
        </div>
        <div className="flex justify-around">
          <RadarChart data={chartData} keys={chartKeys}></RadarChart>
          <BarChart data={barData}></BarChart>
        </div>
      </>
    );

    function singleArtist(artist: Artist) {
      function removeArtist() {
        setArtists(artists.filter((art) => art.id !== artist.id))
      }

      const header = (
        <div className="rounded-s header-image">
          <img src={artist.image} alt={"image of " + artist.name}></img>
        </div>
      );
      const footer = (
        <div>
            <Button onClick={removeArtist} label={"Remove Arist"} icon="pi pi-times" rounded outlined severity="danger" aria-label="Cancel" disabled={artists.length === 1}/>
        </div>
      );

      return (
        <Card key={artist.id} title={artist.name} className="margin-10 md:w-25rem" header={header} footer={footer}>
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

      if (artists.length < 5) {
        return (
          <Card className="margin-10 md:w-25rem justify-items-center content-center" header={header}>
            <Dropdown value={null}  onChange={addArtist} options={artistsSearch} optionLabel="name" placeholder="Select an Artist" filter />
          </Card>
        );
      }
    }
    
  }
  
  export default Comparison