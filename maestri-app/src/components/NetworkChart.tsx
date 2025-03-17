import { InputNode, NodeTooltipProps, ResponsiveNetwork } from "@nivo/network"
import { ResponsivePie } from '@nivo/pie'
import NetWorkNodeComponent from "./NetworkNodeComponent";
import {Artist, NetworkNode} from "../utils/interfaces";
import { DataModel } from "../DataModel";
import { getColorPalette, nivoDarkColorPalette } from "../utils/colorUtilities.ts";
import { useEffect, useMemo, useRef } from "react";
import { Card } from "primereact/card";

interface NetworkChartProps {
    readonly model: DataModel;
    readonly artist: Artist;
    readonly clickedNode: (artistId: string) => void;
    readonly filteredArtistIds: string[] | null;
}

function NetworkChart(props: NetworkChartProps) {
    const scrollRef = useRef<HTMLDivElement | null>(null);

    const artistNetwork = useMemo(() => {
        const fullNetwork = props.model.networkData[props.artist.artist_id];
        return {
            total_contributions: fullNetwork.total_contributions,
            nodes: fullNetwork.nodes.filter((n) => props.filteredArtistIds === null || props.filteredArtistIds.includes(n.id)),
            links: fullNetwork.links.filter((l) => props.filteredArtistIds === null || props.filteredArtistIds.includes(l.source) && props.filteredArtistIds.includes(l.target))
        }
    }, [props.artist, props.filteredArtistIds]);

    const maxLocalCollaborations = useMemo(() => {
        return artistNetwork.nodes
          .reduce((prev, current) =>
            (prev && prev.num_collaborations > current.num_collaborations) ? prev : current)
          .num_collaborations;
    }, [artistNetwork]);


    useEffect(() => {
        if (scrollRef.current) {
            const { scrollWidth, scrollHeight, clientWidth, clientHeight } = scrollRef.current;
            scrollRef.current.scrollLeft = (scrollWidth - clientWidth) / 2;
            scrollRef.current.scrollTop = (scrollHeight - clientHeight) / 2;
        }
    }, [artistNetwork]);

    const artistNodeTooltip = (node: NodeTooltipProps<NetworkNode>) => {
        const artist = props.model.getArtist(node.node.data.id)
        // @ts-ignore
        const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
            let total = 0

            // @ts-ignore
            dataWithArc.forEach(datum => {
                total += datum.value
            })

            return (
                <text
                    x={centerX}
                    y={centerY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill='white'
                    style={{
                        fontSize: '24px',
                    }}
                >
                    {total}
                </text>
            )
        }


        const contributionTypesCounts = artist.contributions.reduce((acc, e) => (acc.set(e.type, 1 + (acc.get(e.type) || 0))), new Map<string, number>)

        var data = [
            {
                "id": "PD",
                "label": "producer",
                "value": (contributionTypesCounts.get("producer") || 0),
                "color": nivoDarkColorPalette["#1b9e77"][0]
            },
            {
                "id": "PR",
                "label": "primary",
                "value": (contributionTypesCounts.get("primary") || 0),
                "color": nivoDarkColorPalette["#d95f02"][0]
            },
            {
                "id": "FT",
                "label": "feature",
                "value": (contributionTypesCounts.get("feature") || 0),
                "color": nivoDarkColorPalette["#7570b3"][0]
            },
            {
                "id": "WR",
                "label": "writer",
                "value": (contributionTypesCounts.get("writer") || 0),
                "color": nivoDarkColorPalette["#e7298a"][0]
            },
        ].filter((d) => d["value"] > 0)

        // @ts-ignore
        const PieChart = ({ data /* see data tab */ }) => (
            <ResponsivePie
                data={data}
                margin={{ top: 10, right: 35, bottom: 10, left: 35 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            0.2
                        ]
                    ]
                }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="white"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLinkLabelsDiagonalLength={5}
                arcLinkLabelsStraightLength={5}
                arcLabelsTextColor={'white'}
                layers={['arcs', 'arcLabels', 'arcLinkLabels', 'legends', CenteredMetric]}
                colors={{
                    datum: 'data.color'
                }}
            />
        )

        return (
            <Card style={{
                'borderRadius': "0%",
            }}>
                <div className='flex flex-row' style={{ gap: '1rem' }}>
                    <div className="flex flex-col" style={{ gap: '0.3rem' }}>
                        <div style={{ height: "9rem", width: "9rem" }}>
                            <img src={artist.image_url} style={{ height: "100%", width: "100%", objectFit: "cover", borderRadius: "5%" }} alt={artist.name}></img>
                        </div>
                        {<><a style={{ fontSize: "80%" }}>PD - producer credit</a>
                            <a style={{ fontSize: "80%" }}>PR - primary artist</a>
                            <a style={{ fontSize: "80%" }}>FT - featured artist</a>
                            <a style={{ fontSize: "80%" }}>WR - writer credit</a>
                        </>}
                    </div>
                    <div className="flex flex-col" style={{ gap: '0.0rem', flexWrap: "wrap" }}>
                        <a className="artist-name-link" style={{ fontSize: "120%" }}>{artist.name}</a>

                        <a className="text-wrap" style={{ fontSize: "90%" }}> has {artist.contributions.length} credits across all tracks</a>
                        <div style={{ height: "20vh", width: "20vh" }}>{PieChart({ data: data })}
                        </div>

                    </div>
                </div>
            </Card>
        )
    }



    return (
        <div ref={scrollRef} id={"networkGraph"} style={{height: "72vh", width: "100%", overflowX: "scroll", overflowY:"scroll"}}>
            <ResponsiveNetwork
                data={artistNetwork}
                // @ts-expect-error
                height={576}
                width={576}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                linkDistance={l=> getEdgeDistance(l.source, l.target)}
                centeringStrength={0.1}
                repulsivity={20}
                nodeSize={n=> getNodeSize(n, props.model.maxGlobalContributions)}
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
                nodeComponent={n => NetWorkNodeComponent(n, props.model)}
                nodeTooltip={artistNodeTooltip}
                distanceMin={20}
            />
        </div>
    )

    function getNodeSize(node: InputNode, max_contributions: number) {
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