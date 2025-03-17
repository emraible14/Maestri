import { Chip } from "primereact/chip";
import { Artist } from "../utils/interfaces";
import { Button } from "primereact/button";


interface CreditChipProps {
    readonly idx: number
    readonly artist: Artist
    readonly removable?: boolean
    readonly onClick: (clickItem: any) => void
    readonly onRemove: (art: Artist) => void
}

function ArtistChip(props: CreditChipProps) {

    const artistImageLink = props.artist.image_url || "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg";

    function removeButton() {
        if (props.removable && props.onRemove) {
            return (
                <Button style={{width: '2rem', height: '2rem', marginRight: '-0.75rem'}} rounded 
                    text icon="pi pi-times-circle" tooltipOptions={{position: "top"}} tooltip="Remove"
                    onClick={() => props.onRemove(props.artist)}/>
            )
        }
        return null;
    }

    const content = (
        <>
            <span data-id={props.idx} style={{cursor: "pointer", display: "flex", alignItems: "center"}} onClick={() => props.onClick(props.idx)}>
                <span style={{height: "2.5rem", width: "2.5rem"}}>
                  <img style={{height: "100%", width: "100%", objectFit: "cover"}} src={artistImageLink}  alt={'Asd'}/>
                </span>
                <span className="whitespace-nowrap font-medium">{props.artist.name}</span>
            { removeButton() }
            </span>
        </>
      );

      const chipStyle = {
          borderRadius: "22px",
          border: props.idx === history.length ? "2px solid rgb(196, 149, 27)" : "2px solid #111827"
      }

      return <Chip style={chipStyle} template={content}/>
}

export default ArtistChip;