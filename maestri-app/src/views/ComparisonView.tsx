import { useEffect, useRef, useState } from "react";
import { Artist } from "../utils/interfaces";
import RadarChart from "../components/RadarChart";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import BarChart from "../components/BarChart";
import { getBarKeysFromType } from "../utils/dataUtilities";
import { DataModel } from "../DataModel";
import { nivoDarkColorPalette } from "../utils/colorUtilities";
import { useSearchParams } from "react-router-dom";

interface ComparisonProps {
    readonly model: DataModel;
}

function Comparison(props: ComparisonProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentArtists, setCurrentArtists] = useState<Array<Artist>>([]);

    useEffect(() => {
        // get artists on mount
        const artistIds = searchParams.get("ids")?.split(',');
        if (artistIds) {
            const defaultArtists = props.model.getSpecificArtists(artistIds);
            setCurrentArtists(defaultArtists);
        }
    }, []);

    return (
        <>
            <div className="grid grid-cols-5 justify-around">
                { currentArtists.map(singleArtist) }
                { addArtistCard() }
            </div>
            <div className="flex justify-around">
                <RadarChart data={props.model.getRadarData(currentArtists, "attribute")} 
                    keys={currentArtists.map((artist) => { return artist.name })} indexKey={"attribute"}></RadarChart>
                <BarChart data={props.model.getBarData(currentArtists, "artist", getBarKeysFromType("# weeks on charts"))} 
                    keys={getBarKeysFromType("# weeks on charts")} indexKey={"artist"} type={"# weeks on charts"}></BarChart>
            </div>
        </>
    );

    function singleArtist(artist: Artist, index: number) {
        function removeArtist() {
            // update search params
            const newArtistIds = searchParams.get("ids")?.split(',').filter((art) => art !== artist.artist_id);
            if (newArtistIds) {
                const newQueryParameters : URLSearchParams = new URLSearchParams();
                newQueryParameters.set("ids",  newArtistIds?.join(","))
                setSearchParams(newQueryParameters);
                // update current artists list
                setCurrentArtists(currentArtists.filter((art) => art.artist_id !== artist.artist_id))
            }
        }

        const artistImageLink = artist.image_url || "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg";
        const header = (
            <div className="rounded-s header-image" style={{ border: "7px solid " +  Object.keys(nivoDarkColorPalette)[index]}}>
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
            const newArtistIds = searchParams.get("ids")?.split(',') || [];
            // add new artist
            newArtistIds.push(event.target?.value?.artist_id.toString());

            // update search params
            const newQueryParameters : URLSearchParams = new URLSearchParams();
            newQueryParameters.set("ids",  newArtistIds?.join(","))
            setSearchParams(newQueryParameters);

            // update current artists list
            setCurrentArtists(props.model.getSpecificArtists(newArtistIds))
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