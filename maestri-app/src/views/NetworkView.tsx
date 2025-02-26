import { Button } from "primereact/button";
import { ResponsiveNetwork } from '@nivo/network'
import NetworkData from '../../../data/network.json'  
import { useState } from "react";
import { Card } from 'primereact/card';

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

const biggest_local_collaborator = NetworkData[artistId]["nodes"].reduce(function(prev, current) {
  return (prev && prev.num_collaborations > current.num_collaborations) ? prev : current
})
const max_local_collaborations = biggest_local_collaborator.num_collaborations;


  return (
    <div>
      <h1>Network View</h1>
      <div style={{height: "800px"}}>
        <ResponsiveNetwork
        width={1200}
        height={800}
        data={NetworkData[artistId]}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        linkDistance={l=>(edgeDistance(l, max_local_collaborations))}
        centeringStrength={0.1}
        repulsivity={20}
        nodeSize={n=>nodeSize(n, max_contributions)}
        activeNodeSize={n=>1.5*nodeSize(n, max_contributions)}
        nodeColor={n=>"rgb(97, 205, 187)"}
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
        linkBlendMode="multiply"
        motionConfig="wobbly"
        onClick={(node: NetworkComputedNode, event: MouseEvent)=>{
          setArtistId(node.id)
        }}
        nodeTooltip={(node)=>{
          let name = node.node.data.name
          if (name == ""){
            name = "Name not found!"
          }
          return <Card title={name}>
          </Card>
        }}
        distanceMin={5}

        />
      </div>
    </div>
  )


}

function nodeSize(node, max_contributions){
  // Normalize
  var contributions = NetworkData[node.id].total_contributions;
  var normalized_contributions = (contributions) / max_contributions;
  const max_size = 64;
  const min_size = 12
  return Math.floor(normalized_contributions*(max_size-min_size) + min_size);
}

function edgeSize(node, max_local_collaborations){
    // Normalize
    var collaborations = node.num_collaborations;
    var normalized_collaborations = (collaborations) / max_local_collaborations;
    const max_size = 12;
    const min_size = 2;
    return Math.floor(normalized_collaborations*(max_size-min_size) + min_size);
}

export default Network