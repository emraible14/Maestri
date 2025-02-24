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

  return (
    <div>
      <h1>Network View</h1>
      <div style={{height: "800px"}}>
        <ResponsiveNetwork
        width={800}
        height={800}
        data={NetworkData[artistId]}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        linkDistance={e=>e.distance}
        centeringStrength={0.3}
        repulsivity={6}
        nodeSize={n=>n.size}
        activeNodeSize={n=>1.5*n.size}
        nodeColor={e=>e.color}
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
        linkThickness={n=>2+2*n.target.data.height}
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

        />
      </div>
    </div>
  )
}

export default Network