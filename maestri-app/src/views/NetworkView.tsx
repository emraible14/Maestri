import { ResponsiveNetwork } from '@nivo/network'
import NetworkData from '../../../data/network_v2.json'  
import { useState } from "react";
import {animated, to} from "@react-spring/web";
import { DataModel } from '../DataModel';
import { useSearchParams } from 'react-router-dom';

interface NetworkProps {
    model: DataModel
}

function Network(props: NetworkProps) {
    // make sure parent container have a defined height when using
    // responsive component, otherwise height will be 0 and
    // no chart will be rendered.
    // website examples showcase many properties,
    // you'll often use just a few of them.
    const [searchParams, setSearchParams] = useSearchParams();
    const idParam = searchParams.get("id");

    const [artistId, setArtistId] = useState(idParam || "1405");
    const biggest_global_contributor = Object.values(NetworkData).reduce(function(prev, current) {
        return (prev && prev.total_contributions > current.total_contributions) ? prev : current
    })
    const max_contributions = biggest_global_contributor.total_contributions
    const networkData = props.model.getNetworkDataForArtist(artistId);

    const biggest_local_collaborator = networkData["nodes"].reduce((prev, current) => {
        return (prev && prev.num_collaborations > current.num_collaborations) ? prev : current
    })
    const max_local_collaborations = biggest_local_collaborator.num_collaborations;

    return (
        <div style={{height: "400px", width: "400px", scale: "2", marginTop: "200px", marginLeft: "200px"}}>
            <ResponsiveNetwork
                data={networkData}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                linkDistance={l=>(props.model.getEdgeDistance(l.source, l.target, max_local_collaborations))}
                centeringStrength={0.1}
                repulsivity={20}
                nodeSize={n=>props.model.getNodeSize(n, max_contributions)}
                activeNodeSize={n=>1.5*props.model.getNodeSize(n, max_contributions)}
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
                linkThickness={n=>props.model.getEdgeSize(n.target.data, max_local_collaborations)}
                motionConfig="slow"
                onClick={clickedNode}
                nodeComponent={n=>nodeComponent(n, props)}
                nodeTooltip={(node)=>{
                let artist = props.model.getArtist(node.node.data.id)
                let name = node.node.data.id
                if (typeof artist == 'undefined'){
                    // name = "Name not found!"
                }
                else {
                    name = artist.name
                }

                return <div style={{backgroundColor: "#374151", borderRadius: "5px", padding: "5px"}}>{name}</div>
                }}
                distanceMin={20}
            />
        </div>
    )

    function clickedNode(node) {
        // update search params
        const newQueryParameters : URLSearchParams = new URLSearchParams();
        newQueryParameters.set("id", node.id)
        setSearchParams(newQueryParameters);
        setArtistId(node.id)
    }
}


// TODO: this should be moved into it's own component and typed properly
function nodeComponent(nodeIn){
    const  {
        node,
        animated: animatedProps,
        onClick,
        onMouseEnter,
        onMouseMove,
        onMouseLeave,
    } = nodeIn

    const artistImageUrl = "https://images.genius.com/073372f6cd316f7c68b4c4b7d8c610c9.675x675x1.jpg"
    // TODO: Actually use the images when we have the genius ids for the artists
    // if (typeof node.id == 'undefined'){
    //   console.log(node)
    // } else {
    //   artistImageUrl = ArtistImages[node.id]["imageURL"]
    // }

  
    return <>
        <defs>
        <clipPath id={`circle-clip-${node.id}`} clipPathUnits="objectBoundingBox">
            <circle cx="0.5" cy="0.5" r="0.5" />
        </clipPath>
        </defs>

        <animated.g
        transform={to(
            [animatedProps.x, animatedProps.y, animatedProps.scale],
            (x, y, scale) => `translate(${x},${y}) scale(${scale})`
        )}
        >
        <animated.image
            href={artistImageUrl}
            width={animatedProps.size}
            height={animatedProps.size}
            x={to(animatedProps.size, size => -size / 2)}
            y={to(animatedProps.size, size => -size / 2)}
            clipPath={`url(#circle-clip-${node.id})`}
            preserveAspectRatio="xMidYMid slice"
            opacity={animatedProps.opacity}
        />

        <animated.circle
            r={to([animatedProps.size], size => size / 2)}
            strokeWidth={animatedProps.borderWidth}
            stroke={animatedProps.borderColor}
            fill="transparent"
            onClick={onClick ? event => onClick(node, event) : undefined}
            onMouseEnter={onMouseEnter ? event => onMouseEnter(node, event) : undefined}
            onMouseMove={onMouseMove ? event => onMouseMove(node, event) : undefined}
            onMouseLeave={onMouseLeave ? event => onMouseLeave(node, event) : undefined}
            data-testid={`node.${node.id}`}
        />
        </animated.g>
    </>
}


export default Network