import { ComputedNode } from '@nivo/network'
import { useState } from "react";
import { DataModel } from '../DataModel';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { NetworkNode } from '../utils/interfaces';
import NetworkChart from '../components/NetworkChart';

function Network(props: { readonly model: DataModel }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const idParam = searchParams.get("id");

    const [artist, setArtist] = useState(idParam ? props.model.getArtist(idParam) : props.model.getArtist("1405"));
    const allArtists = props.model.getArtists();

    return (
        <div className='flex'>
            <div>
                <br/>
                <Dropdown value={null}  onChange={setNewArtist} options={allArtists.filter((art) => art.artist_id !== artist.artist_id)} optionLabel="name" placeholder="Select an Artist" filter virtualScrollerOptions={{ itemSize: 38 }}/>
                <h1>{artist.name}</h1>
                <Button onClick={() => navigate('/comparison?ids=' + artist.artist_id)} label={"Compare artists"} icon="pi pi-user" rounded outlined/>
                <Button onClick={() => navigate('/artist?id=' + artist.artist_id)} label={"View"} icon="pi pi-star" rounded outlined/>
                <br/>
                <br/>
                <div className='width-100'>*Node size is determined by overall number of credits</div>
                <br/>
                <br/>
                <div className='width-100'>*Distance from center node and edge thickness are determined by contributions to {artist.name}</div>
            </div>
            <NetworkChart model={props.model} artist={artist} clickedNode={clickedNode}></NetworkChart>
        </div>
    );

    function setNewArtist(e: DropdownChangeEvent) {
        // update search params
        const newQueryParameters : URLSearchParams = new URLSearchParams();
        newQueryParameters.set("id",  e.value.artist_id)
        setSearchParams(newQueryParameters);
        setArtist(props.model.getArtist(e.value.artist_id))
    }

    function clickedNode(node: ComputedNode<NetworkNode>) {
        // update search params
        const newQueryParameters : URLSearchParams = new URLSearchParams();
        newQueryParameters.set("id", node.id)
        setSearchParams(newQueryParameters);
        setArtist(props.model.getArtist(node.id))
    }
}


export default Network