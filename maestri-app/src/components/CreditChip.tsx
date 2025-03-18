import { Chip } from "primereact/chip";
import { Artist } from "../utils/interfaces";
import { contributionLabels } from "../utils/dataUtilities";

function CreditChip(props: { readonly label: string, readonly artist: Artist }) {

    if (props.artist.contributions.filter((cont) => { return cont.type == props.label }).length > 0) {
      return <Chip style={{ marginRight: '3px', marginBottom: '3px', fontSize: '0.75rem' }} 
        label={contributionLabels[props.label].acronym}/>;
    }
    return null;
}

export default CreditChip;