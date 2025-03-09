import {InputNode, ResponsiveNetwork } from "@nivo/network"
import NetWorkNodeComponent from "./NetworkNodeComponent";
import { Artist, NetworkNode } from "../utils/interfaces";
import { DataModel } from "../DataModel";
import {getColorPalette} from "../utils/colorUtilities.ts";
import {useEffect, useRef} from "react";

interface NetworkChartProps {
    readonly model: DataModel;
    readonly artist: Artist;
    readonly clickedNode: (artistId: string) => void;
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

    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (scrollRef.current) {
            const { scrollWidth, scrollHeight, clientWidth, clientHeight } = scrollRef.current;
            scrollRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
            scrollRef.current.scrollTop = (scrollHeight - clientHeight) / 2;
        }
    }, [artistNetwork]);


    return (
        <div ref={scrollRef} id={"networkGraph"} style={{height: "768px", width: "100%", overflowX: "scroll", overflowY:"scroll"}}>
            <ResponsiveNetwork
                data={artistNetwork}
                // @ts-expect-error
                height={576}
                width={576}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                linkDistance={l=> getEdgeDistance(l.source, l.target)}
                centeringStrength={0.1}
                repulsivity={20}
                nodeSize={n=> getNodeSize(n, maxContributions)}
                activeNodeSize={40}
                nodeColor={n => n.id == props.artist.artist_id ? getColorPalette().amber : getColorPalette().beaver}
                nodeBorderWidth={1}
                nodeBorderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            0.7
                        ]
                    ]
                }}
                linkThickness={2}
                linkColor={"#374151"}
                motionConfig="slow"
                onClick={n => props.clickedNode(n.id)}
                nodeComponent={n=> NetWorkNodeComponent(n, props.model)}
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
        const min_size = 14
        return Math.floor(normalized_contributions*(max_size-min_size) + min_size);
    }

    function getEdgeDistance(mainAristId: string, collaboratorId: string){
        const nodes: Array<NetworkNode> = props.model.networkData[mainAristId]["nodes"]
      
        const collaborations = nodes.find(n=>(n.id == collaboratorId))?.num_collaborations
        if (!collaborations) return 100;

        const normalized_collaborations = 1 - ((collaborations) / maxLocalCollaborations); // Inverse relationship. More collaborations = closer to each other
        const max_size = 100;
        const min_size = 30;
        return Math.floor(normalized_collaborations*(max_size-min_size) + min_size);
    }
}

export default NetworkChart;