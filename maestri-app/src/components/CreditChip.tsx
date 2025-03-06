import { Chip } from "primereact/chip";
import { Artist } from "../utils/interfaces";

function CreditChip(props: { readonly label: string, readonly artist: Artist }) {
    if (props.artist.contributions.filter((cont) => { return cont.type == props.label }).length > 0) {
      return <Chip style={{ marginRight: '3px', marginBottom: '3px' }} label={props.label} />;
    }
    return null;
}

export default CreditChip;