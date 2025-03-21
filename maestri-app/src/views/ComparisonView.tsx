import { useEffect, useState } from "react";
import { Artist } from "../utils/interfaces";
import { Card } from "primereact/card";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import BarChart from "../components/BarChart";
import { DataModel } from "../DataModel";
import { useSearchParams } from "react-router-dom";
import { getBarKeyLabelsFromType } from "../utils/dataUtilities";
import ParallelCoordinatesChart from "../components/ParalellCoordinatesChart";
import ChordChart from "../components/ChordChart";
import { SelectButton } from "primereact/selectbutton";
import SingleArtistCard from "../components/SingleArtistCard";
import { Tooltip } from "primereact/tooltip";

function Comparison(props: { readonly model: DataModel }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentArtists, setCurrentArtists] = useState<Array<Artist>>([]);
    const options = ['Overview', 'Detailed View']
    const [detailedBreakdown, setdetailedBreakdown] = useState('Overview');

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
            <div className="grid grid-cols-7 justify-around" style={{overflow: 'scroll', maxHeight: '45vh'}}>
                { currentArtists.map(singleArtist) }
                { addArtistCard() }
                <div key={'comparison-chart'} className="col-span-2">
                    <h2 style={{marginLeft: '10px'}}>Collaborations
                        <Tooltip target=".custom-info-icon" />
                        <i className="custom-info-icon pi pi-info-circle p-text-secondary p-overlay-badge" style={{ fontSize: '1rem', marginLeft: '5px', color: '#7b889e' }}
                            data-pr-tooltip="Collaborations between selected artists are shown below. Arc size is based on total contributions while ribbons between artists show number of collaborations." 
                            data-pr-position="right" data-pr-at="right+5 top" data-pr-my="left center-2"></i>
                    </h2>
                    <ChordChart artists={currentArtists} model={props.model}></ChordChart>
                </div>
            </div>
            <br></br>
            <SelectButton style={{marginLeft: '10px'}} invalid value={detailedBreakdown} onChange={(e) => setdetailedBreakdown(e.value)} options={options} />
            { dataDisplay() }
        </>
    );

    function dataDisplay() {
        if (detailedBreakdown === 'Detailed View') {
            return(
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
            )
        } else {
            return (
                <div>
                    <ParallelCoordinatesChart artists={currentArtists} model={props.model}></ParallelCoordinatesChart>
                </div>
            )
        }
    }

    function singleArtist(artist: Artist, index: number) {
        function removeArtist() {
            let newArtistIds = searchParams.get("ids")?.split(',') || [];
            // filter out artist
            newArtistIds = newArtistIds.filter((art) => art !== artist.artist_id);

            // update search params
            const newQueryParameters : URLSearchParams = new URLSearchParams();
            newQueryParameters.set("ids",  newArtistIds?.join(","))
            setSearchParams(newQueryParameters);

            // update current artists list
            setCurrentArtists(props.model.getSpecificArtists(newArtistIds));
        }

        return (
            <SingleArtistCard key={artist.artist_id} artist={artist} index={index} removeArtist={removeArtist}
                removable detailable networkable></SingleArtistCard>
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
            const numCards = 5 - currentArtists.length;
            const currentArtistIds = currentArtists.map((art) => { return art.artist_id})
            const availableArtists = props.model.getArtists().filter((art) => !currentArtistIds.includes(art.artist_id) )

            const cards = []
            for (let i = 0; i < numCards; i++) {
                cards.push(
                    <Card key={'add-card' + i} className="margin-10 justify-items-center content-center" header={header}>
                        <Dropdown value={null} onChange={addArtist} options={availableArtists} optionLabel="name" placeholder="Select Artist" filter virtualScrollerOptions={{ itemSize: 38 }}/>
                    </Card>
                );
            }

            return cards;
        }
    }
}
  
export default Comparison