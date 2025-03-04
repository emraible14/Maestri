import { ComputedNode, InputNode, ResponsiveNetwork } from "@nivo/network"
import NetWorkNodeComponent from "./NetworkNodeComponent";
import { Artist, NetworkNode } from "../utils/interfaces";
import { DataModel } from "../DataModel";

interface NetworkChartProps {
    readonly model: DataModel;
    readonly artist: Artist;
    readonly clickedNode: (node: ComputedNode<NetworkNode>) => void;
}

function NetworkChart(props: NetworkChartProps) {
    const artistNetwork = props.model.networkData[props.artist.artist_id];

    const biggestGlobalContributor = Object.values(props.model.networkData).reduce(function(prev, current) {
        return (prev && prev.total_contributions > current.total_contributions) ? prev : current
    })
    const maxContributions = biggestGlobalContributor.total_contributions

    const biggestLocalCollaborator = artistNetwork["nodes"].reduce((prev, current) => {
        return (prev && prev.num_collaborations > current.num_collaborations) ? prev : current
    })
    const maxLocalCollaborations = biggestLocalCollaborator.num_collaborations;

    return (
        <div style={{height: "540px", width: "540px", scale: "2", marginTop: "270px", marginLeft: "270px"}}>
            <ResponsiveNetwork
                data={artistNetwork}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                linkDistance={l=>(getEdgeDistance(l.source, l.target))}
                centeringStrength={0.1}
                repulsivity={20}
                nodeSize={n=>getNodeSize(n, maxContributions)}
                activeNodeSize={n=>1.5*getNodeSize(n, maxContributions)}
                nodeColor={"rgb(97, 205, 187)"}
                nodeBorderWidth={1}
                nodeBorderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            0.8
                        ]
                    ]
                }}
                linkThickness={n=>getEdgeSize(n.target.data)}
                motionConfig="slow"
                onClick={props.clickedNode}
                nodeComponent={n=>NetWorkNodeComponent(n, props.model)}
                    nodeTooltip={(node)=>{
                    const id = node.node.data.id
                    let name = id
                    if (typeof props.artist == 'undefined'){
                        // name = "Name not found!"
                    }
                    else {
                        name = props.model.getArtist(node.node.data.id).name
                    }

                    return <div style={{backgroundColor: "#374151", borderRadius: "5px", padding: "5px"}}>{name}</div>
                }}
                distanceMin={20}
            />
        </div>
    )

    function getNodeSize(node: InputNode, max_contributions: number) {
        // Normalize
        const contributions = props.model.networkData[node.id].total_contributions;
        const normalized_contributions = (contributions) / max_contributions;
        const max_size = 64;
        const min_size = 12
        return Math.floor(normalized_contributions*(max_size-min_size) + min_size);
    }

    function getEdgeSize(node: NetworkNode){
        // Normalize
        const collaborations = node.num_collaborations;
        const normalized_collaborations = (collaborations) / maxLocalCollaborations;
        const max_size = 8;
        const min_size = 1;
        return Math.floor(normalized_collaborations*(max_size-min_size) + min_size);
    }

    function getEdgeDistance(mainAristId: string, collaboratorId: string){
        const nodes: Array<NetworkNode> = props.model.networkData[mainAristId]["nodes"]
      
        const collaborations = nodes.find(n=>(n.id == collaboratorId))?.num_collaborations
        if (collaborations) {
            const normalized_collaborations = 1 - ((collaborations) / maxLocalCollaborations); // Inverse relationship. More collaborations = closer to each other
            const max_size = 100;
            const min_size = 45;
            return Math.floor(normalized_collaborations*(max_size-min_size) + min_size);
        }
        return 100; // return max distance, should never reach here
    }
}

export default NetworkChart;