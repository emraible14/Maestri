import { Button } from "primereact/button";
import { Artist } from "../utils/interfaces";
import { Card } from "primereact/card";
import CreditChip from "./CreditChip";
import { useNavigate } from "react-router-dom";
import { getColorPalette, nivoDarkColorPalette } from "../utils/colorUtilities";

interface SingleAristProps {
    artist: Artist,
    index?: number,
    removable?: boolean,
    comparable?: boolean,
    networkable?: boolean,
    detailable?: boolean,
    removeArtist?: () => void;
}

function SingleArtistCard(props: SingleAristProps) {
    const navigate = useNavigate();

    const borderColor = props.index ? Object.keys(nivoDarkColorPalette)[props.index] : getColorPalette().amber

    const artistImageLink = props.artist.image_url || "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg";
    const header = (
        <div className="rounded-s header-image" style={{ border: "7px solid " +  borderColor}}>
        <img src={artistImageLink} alt={"image of " + props.artist.name} ></img>
        </div>
    );

    const buttons = [];
    if (props.detailable) {
        buttons.push(
            <Button style={{ marginRight: '10px' }} onClick={() => navigate('/artist?id=' + props.artist.artist_id)} icon="pi pi-user" outlined tooltip="View Artist"/>
        )
    }
    if (props.comparable) {
        buttons.push(
            <Button style={{ marginRight: '10px' }} onClick={() => navigate('/comparison?ids=' + props.artist.artist_id)} icon="pi pi-users" outlined aria-label="Cancel" tooltip="Compare Artists"/>
        )
    }
    if (props.networkable) {
        buttons.push(
            <Button style={{ marginRight: '10px' }} onClick={() => navigate('/network?id=' + props.artist.artist_id)} icon="pi pi-arrow-right-arrow-left" outlined aria-label="Cancel" tooltip="Explore Connections"/>
        )
    }
    if (props.removable) {
        buttons.push(
            <Button style={{ marginRight: '10px' }} onClick={props.removeArtist} icon="pi pi-times" outlined severity="danger" aria-label="Cancel" 
                tooltip="Remove Artist"/>
        )
    }

    return (
        <Card key={props.artist.artist_id} title={props.artist.name} header={header} className="margin-10">
            <div className="flex">
                { buttons }
            </div>
            <br></br>
            <div className="flex-wrap">
                <CreditChip label="primary" artist={props.artist}></CreditChip>
                <CreditChip label="feature" artist={props.artist}></CreditChip>
                <CreditChip label="writer" artist={props.artist}></CreditChip>
                <CreditChip label="producer" artist={props.artist}></CreditChip>
            </div>
        </Card>
    )
}

export default SingleArtistCard;