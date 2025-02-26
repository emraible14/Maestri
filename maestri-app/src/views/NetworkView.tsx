import { ResponsiveNetwork } from '@nivo/network'
import NetworkData from '../../../data/network.json'  
import { useState } from "react";
import { Card } from 'primereact/card';
import {animated, to} from "@react-spring/web";

function Network() {
  // make sure parent container have a defined height when using
  // responsive component, otherwise height will be 0 and
  // no chart will be rendered.
  // website examples showcase many properties,
  // you'll often use just a few of them.

  const [artistId, setArtistId] = useState("-4676264453581091479");
  const biggest_global_contributor = Object.values(NetworkData).reduce(function(prev, current) {
    return (prev && prev.total_contributions > current.total_contributions) ? prev : current
  })
  const max_contributions = biggest_global_contributor.total_contributions

  const biggest_local_collaborator = NetworkData[artistId]["nodes"].reduce((prev, current) => {
    return (prev && prev.num_collaborations > current.num_collaborations) ? prev : current
  })
  const max_local_collaborations = biggest_local_collaborator.num_collaborations;

  return (
    <div>
      <div style={{height: "800px", scale: "2"}}>
        <ResponsiveNetwork
        data={NetworkData[artistId]}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        linkDistance={l=>(edgeDistance(l, max_local_collaborations))}
        centeringStrength={0.1}
        repulsivity={20}
        nodeSize={n=>nodeSize(n, max_contributions)}
        activeNodeSize={n=>1.5*nodeSize(n, max_contributions)}
        nodeColor={n =>"rgb(97, 205, 187)"}
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
        linkThickness={n=>edgeSize(n.target.data, max_local_collaborations)}
        motionConfig="slow"
        onClick={(node: NetworkComputedNode, event: MouseEvent)=>{
          setArtistId(node.id)
        }}
        nodeComponent={n=>nodeComponent(n)}
        nodeTooltip={(node)=>{
          let name = node.node.data.name
          if (name == ""){
            name = "Name not found!"
          }
          return <Card title={name}>
          </Card>
        }}
        distanceMin={20}

        />
      </div>
    </div>
  )


}

function nodeSize(node, max_contributions){
  // Normalize
  const contributions = NetworkData[node.id].total_contributions;
  const normalized_contributions = (contributions) / max_contributions;
  const max_size = 64;
  const min_size = 12
  return Math.floor(normalized_contributions*(max_size-min_size) + min_size);
}

function edgeSize(node, max_local_collaborations){
    // Normalize
    const collaborations = node.num_collaborations;
    const normalized_collaborations = (collaborations) / max_local_collaborations;
    const max_size = 12;
    const min_size = 2;
    return Math.floor(normalized_collaborations*(max_size-min_size) + min_size);
}

function edgeDistance(edge, max_local_collaborations){
  
  const main_artist_id = edge.source
  const collaborator_artist_id = edge.target
  const nodes: Array<Object> = NetworkData[main_artist_id]["nodes"]

  const collaborations = nodes.find(n=>(n.id == collaborator_artist_id)).num_collaborations

  const normalized_collaborations = 1 - ((collaborations) / max_local_collaborations); // Inverse relationship. More collaborations = closer to each other
  console.log(normalized_collaborations)
  const max_size = 100;
  const min_size = 45;
  return Math.floor(normalized_collaborations*(max_size-min_size) + min_size);
}

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