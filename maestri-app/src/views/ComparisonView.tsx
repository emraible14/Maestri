import { useEffect, useState } from "react";
import { Artist } from "../utils/interfaces";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import BarChart from "../components/BarChart";
import { DataModel } from "../DataModel";
import { nivoDarkColorPalette } from "../utils/colorUtilities";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getBarKeyLabelsFromType } from "../utils/dataUtilities";
import ParallelCoordinatesChart from "../components/ParalellCoordinatesChart";
import CreditChip from "../components/CreditChip";
import ChordChart from "../components/ChordChart";

interface ComparisonProps {
    readonly model: DataModel;
}

function Comparison(props: ComparisonProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentArtists, setCurrentArtists] = useState<Array<Artist>>([]);
    // const [barType, setBarType] = useState("# charting tracks");
    const navigate = useNavigate();

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
            <div className="grid grid-cols-7 justify-around">
                { currentArtists.map(singleArtist) }
                { addArtistCard() }
                <div className="col-span-2">
                    <ChordChart artists={currentArtists}></ChordChart>
                </div>
            </div>
            <div>
                <ParallelCoordinatesChart artists={currentArtists} model={props.model}></ParallelCoordinatesChart>
            </div>
            <div className="flex justify-around">
                <BarChart data={props.model.getBarData(currentArtists, "artist", "# charting tracks")} 
                    keys={getBarKeyLabelsFromType("# charting tracks")} indexKey={"artist"} type={"# charting tracks"}></BarChart>
                <BarChart data={props.model.getBarData(currentArtists, "artist", "avg. team size")} 
                    keys={getBarKeyLabelsFromType("avg. team size")} indexKey={"artist"} type={"avg. team size"}></BarChart>
                <BarChart data={props.model.getBarData(currentArtists, "artist", "total samples/interpolations used")} 
                    keys={getBarKeyLabelsFromType("total samples/interpolations used")} indexKey={"artist"} type={"total samples/interpolations used"}></BarChart>
                <BarChart data={props.model.getBarData(currentArtists, "artist", "#1 tracks")} 
                    keys={getBarKeyLabelsFromType("#1 tracks")} indexKey={"artist"} type={"#1 tracks"}></BarChart>
            </div>
            {/* <div className="flex justify-around">
                <RadarChart data={props.model.getRadarData(currentArtists, "attribute")} 
                    keys={currentArtists.map((artist) => { return artist.name })} indexKey={"attribute"}
                    handleAttributeClick={updateBarType}></RadarChart>
                <BarChart data={props.model.getBarData(currentArtists, "artist", barType)} 
                    keys={getBarKeyLabelsFromType(barType)} indexKey={"artist"} type={barType}></BarChart>
            </div> */}
        </>
    );

    // function updateBarType(type: string) {
    //     setBarType(type);
    // }

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
            <div className="flex">
                    <Button style={{ marginRight: '10px' }} onClick={() => navigate('/artist?id=' + artist.artist_id)} icon="pi pi-user" outlined tooltip="View Artist"/>
                    <Button style={{ marginRight: '10px' }} onClick={() => navigate('/network?id=' + artist.artist_id)} icon="pi pi-arrow-right-arrow-left" outlined aria-label="Cancel" tooltip="Explore Connections"/>
                    <Button style={{ marginRight: '10px' }} onClick={removeArtist} icon="pi pi-times" outlined severity="danger" aria-label="Cancel" 
                        disabled={currentArtists.length === 1} tooltip="Remove Artist"/>
            </div>
        );

        

        return (
            <Card key={artist.artist_id} title={artist.name} header={header} footer={footer} className="margin-10">
                <div style={{height: '100px'}} className="flex-wrap">
                    <CreditChip label="primary" artist={artist}></CreditChip>
                    <CreditChip label="feature" artist={artist}></CreditChip>
                    <CreditChip label="writer" artist={artist}></CreditChip>
                    <CreditChip label="producer" artist={artist}></CreditChip>
                </div>
            </Card>
        )
    }

    function addArtistCard() {
        function addArtist(event: DropdownChangeEvent) {
            const newArtistIds = searchParams.get("ids")?.split(',') || [];
            // add new artist
            newArtistIds.push(event.target?.value?.artist_id.toString());

            // update search params
            const newQueryParameters : URLSearchParams = new URLSearchParams();
            newQueryParameters.set("ids",  newArtistIds?.join(","))
            setSearchParams(newQueryParameters);

            // update current artists list
            setCurrentArtists(props.model.getSpecificArtists(newArtistIds));
        }

        const header = (
            <div>
            <i className="pi pi-plus" style={{ fontSize: '6rem' }}></i>
            </div>
        );

        if (currentArtists.length < 5) {
            const currentArtistIds = currentArtists.map((art) => { return art.artist_id})
            const availableArtists = props.model.getArtists().filter((art) => !currentArtistIds.includes(art.artist_id) )

            return (
            <Card className="margin-10 justify-items-center content-center" header={header}>
                <Dropdown value={null}  onChange={addArtist} options={availableArtists} optionLabel="name" placeholder="Select an Artist" filter virtualScrollerOptions={{ itemSize: 38 }}/>
            </Card>
            );
        }
    }
}
  
export default Comparison