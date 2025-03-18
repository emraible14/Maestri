import {useEffect, useMemo, useState} from "react";
import { DataModel } from '../DataModel';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import {Artist, NetworkNode, Track} from '../utils/interfaces';
import NetworkChart from '../components/NetworkChart';
import { DataScroller } from 'primereact/datascroller';
import { Panel } from 'primereact/panel';
import { Tooltip } from 'primereact/tooltip';
import { getColorPalette } from '../utils/colorUtilities';
import {contributionLabels} from "../utils/dataUtilities.ts";
import {SelectButton} from "primereact/selectbutton";
import ArtistChip from "../components/ArtistChip.tsx";


function Network(props: { readonly model: DataModel }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const allArtists = props.model.getArtists();
    const [artist, setArtist] = useState(props.model.getArtist(searchParams.get("id") || "1405"));
    const [history, setHistory] = useState<string[]>([]);
    const [contributionsFilter, setContributionsFilter] = useState<string | null>(null);
    const [comparisonPickList, setComparisonPickList] = useState<Array<Artist>>([]);

    const filteredArtistIds = useMemo(() => {
      if (contributionsFilter == null) return null;

      const filteredIds = [artist.artist_id]
      for (const { id: collaboratorId } of props.model.networkData[artist.artist_id]["nodes"]) {
        if (collaboratorId == artist.artist_id) continue

        const collaborator: Artist = props.model.getArtist(collaboratorId)
        const collaborationsIdSet = new Set(props.model.getCollaborations(artist, collaborator))

        if (collaborator.contributions.some((c) => collaborationsIdSet.has(String(c.song_id)) && c.type == contributionsFilter)) {
            filteredIds.push(collaboratorId);
        }
      }

      return filteredIds
    }, [artist, contributionsFilter])

    const collaboratorNodes = useMemo(() => {
      return props.model.networkData[artist.artist_id]["nodes"]
        .filter(n => n.id != artist.artist_id && (filteredArtistIds == null || filteredArtistIds.includes(n.id)))
    }, [artist, filteredArtistIds])

    const filteringOptions = [
      {label: 'All', value: null},
      {label: "Performers", value: "primary"},
      {label: 'Writers', value: 'writer'},
      {label: 'Producers', value: 'producer'}
    ]


    const artistItemTemplate = (node: NetworkNode) => {
        const collaborator = props.model.getArtist(node.id)
        const collaboratorImageLink = collaborator.image_url

        const collaborationsIds = props.model.getCollaborations(artist, collaborator)
        const collaborationsIdSet = new Set(collaborationsIds)
        const collaborations = props.model.getSpecificTracks(collaborationsIds)
        const contributionTypesCounts = Array.from(collaborator.contributions.filter((c) => collaborationsIdSet.has(String(c.song_id))).map((c) => c.type).reduce((acc, e) => (acc.set(e, 1 + (acc.get(e) || 0))), new Map<string, number>).entries())
        const contributionTypesCountsMainArtist = Array.from(artist.contributions.filter((c) => collaborationsIdSet.has(String(c.song_id))).map((c) => c.type).reduce((acc, e) => (acc.set(e, 1 + (acc.get(e) || 0))), new Map<string, number>).entries())


        const header = 
          <div className='flex items-center flex-row' style={{ gap: '1rem' }}>
            <div style={{ height: "4.5rem", width: "4.5rem" }}>
              <img src={collaboratorImageLink} style={{ height: "100%", width: "100%", objectFit: "cover", borderRadius: "5%" }} alt={collaborator.name}></img>
            </div>
            <div className="flex flex-col" style={{ gap: '0.5rem' }}>
               <div className="flex flex-row items-center" style={{gap: '0.5rem'}}>
                <a className="artist-name-link" style={{fontSize: "120%"}} onClick={() => selectArtist(collaborator.artist_id)}>{collaborator.name}</a>
                <Button className="rounded-lg" style={{ width: '2rem', minWidth: '2rem', height: '2rem' }} 
                    onClick={() => addArtistToPickList(collaborator)} outlined icon="pi pi-user-plus" tooltipOptions={{position: "bottom", showOnDisabled: true}} 
                    tooltip={comparisonPickList.length === 5 ? "Cannot pick more than 5 artists for comparison" : "Add To Compare List"} 
                    disabled={comparisonPickList.length === 5 || comparisonPickList.find((a) => a.artist_id === collaborator.artist_id)}/>
                </div>
              <span className='flex flex-row' style={{ gap: "0.375rem", flexWrap: "wrap"}}>
                  {
                    contributionTypesCounts.map(([type, count]: [string, number]) => {
                      return <>
                        {/* @ts-ignore */}
                        <span className={`chip-${type}-${collaborator.artist_id}`} style={{ color: "black", backgroundColor: "#887369", borderRadius: "20px", padding: "0.25rem 0.5rem", fontSize: "70%" }}>{`${contributionLabels[type].acronym}: ${count}`}</span>
                        <Tooltip target={`.chip-${type}-${collaborator.artist_id}`} content={`${collaborator.name} has ${count} ${contributionLabels[type].text} credits on tracks that ${artist.name} also contributed to`} pt={{text: {style: {boxShadow: "none", fontSize: "80%"}}}}/>
                      </>
                    })
                  }
              </span>
              <span className='flex flex-row' style={{ gap: "0.375rem", flexWrap: "wrap"}}>
                  {
                    contributionTypesCountsMainArtist.map(([type, count]: [string, number]) => {
                      return <>
                        {/* @ts-ignore */}
                        <span className={`chip-${type}-${collaborator.artist_id}-main`} style={{ color: "black", backgroundColor: "#C4951B", borderRadius: "20px", padding: "0.25rem 0.5rem", fontSize: "70%" }}>{`${contributionLabels[type].acronym}: ${count}`}</span>
                        <Tooltip target={`.chip-${type}-${collaborator.artist_id}-main`} content={`${artist.name} has ${count} ${contributionLabels[type].text} credits on tracks that ${collaborator.name} also contributed to`} pt={{text: {style: {boxShadow: "none", fontSize: "80%"}}}}/>
                      </>
                    })
                  }
              </span>
            </div>
          </div>


        return (
          <Panel key={artist.artist_id} header={ header } toggleable collapsed={true} pt={{
            title: {
              style: {
                'fontWeight': 'normal'
              },
            },
            header: {
              style: {
                'userSelect': 'none',
                'borderRadius': '0',
                'padding': '1rem'
              },

            },
             content:
               {
                 style: {
                   'userSelect': 'none',
                   'background': "#101827",
                   'gap': '1rem',
                   'overflow-y': 'scroll',
                   'max-height': '30vh',
                   'padding': '2rem 1rem',
                   'display': 'flex',
                   'flex-direction': 'column',
                   'borderRadius': '0',
                 },

             },
          }}>
            {collaborations.map((c) => trackDisplay(c, artist, collaborator))}
          </Panel>
        )
    }

    useEffect(() => {
      setArtist(props.model.getArtist(searchParams.get("id") || "1405"))
    }, [searchParams.get("id")]);

    useEffect(() => {
      setHistory((searchParams.get("history") == "" ? undefined : searchParams.get("history"))?.split(",") || []);
    }, [searchParams.get("history")]);

    useEffect(() => {
        const idsList = (searchParams.get("compare") == "" ? undefined : searchParams.get("compare"))?.split(",") || [];
        setComparisonPickList(idsList.map((id) => props.model.getArtist(id)));
      }, [searchParams.get("compare")]);

    const historyCards = useMemo(() => {
        return [...history, artist.artist_id]
          .map(id  => props.model.getArtist(id))
          .map((artistInfo, idx)=> {
              return <ArtistChip key={artistInfo.artist_id} artist={artistInfo} idx={idx} onClick={backTrackToIdx} onRemove={() => {}} current={idx === history.length}></ArtistChip>
          }).reduce(((previousValue, currentValue) =>  {
              return (
                <>
                    {previousValue}
                    <span className="flex items-center"> <i className="pi pi-arrow-right"></i></span>
                    {currentValue}
                </>
              )
          }));
    }, [history]);

    function setNewArtist(e: DropdownChangeEvent) {
        if (e.value.artist_id == searchParams.get("id")) return;

        setSearchParams(prev => {
            prev.delete("history");
            prev.delete("compare");
            prev.set("id", e.value.artist_id);
            return prev;
        });
    }

    function selectArtist(artistId: string) {
      if (artistId == searchParams.get("id")) return;
      const newHistory = [...history, searchParams.get("id")]
      setSearchParams(prev => {
        if (newHistory.length > 0)
          prev.set("history", [...history, searchParams.get("id")].splice(-5).join(","));
        else prev.delete("history");
        prev.set("id", artistId);
        return prev;
      });
    }

    function addArtistToPickList(art: Artist) {
        if (comparisonPickList.find((a) => a.artist_id === art.artist_id)) return;
        const newList = [...comparisonPickList, art];
        setSearchParams(prev => {
            prev.set("compare", newList.map((a) => a.artist_id).join(","));
            return prev;
        });
    }

    function removeArtistFromPickList(art: Artist) {
        if (!comparisonPickList.find((a) => a.artist_id === art.artist_id)) return;
        const newList = [...comparisonPickList.filter((a) => a.artist_id !== art.artist_id)];
        setSearchParams(prev => {
            if (newList.length > 0) prev.set("compare", newList.map((a) => a.artist_id).join(","));
            else prev.delete("compare");
            return prev;
        });
    }

    function clearPickList() {
        setSearchParams(prev => {
            prev.delete("compare");
            return prev;
        });
    }

    function backTrackToIdx(idx: number) {
        //? selected current artist
        if (idx === history.length) return;
        setSearchParams(prev => {
            if (idx === 0) prev.delete("history");
            else prev.set("history", history.slice(0, idx).join(","));

            prev.set("id", history[idx]);
            return prev;
        });
    }

    function pickList() {
        if (comparisonPickList.length === 0) return null;
        return (<div className="flex flex-row items-center" style={{overflowX: 'scroll', gap: '0.75rem', padding: "0.25rem 0.5rem", borderRadius: '5px', borderLeft: "1px solid #424b57", borderRight: "1px solid #424b57"}}>
                { comparisonPickList.map((a, idx) => {
                    return <ArtistChip artist={a} idx={idx} removable onRemove={removeArtistFromPickList} onClick={() => {}}></ArtistChip>
                }) }
                <span className="flex items-center"> <i className="pi pi-arrow-right"></i></span>
                <div>
                    <Button 
                        outlined className="rounded-lg" icon="pi pi-users"
                        onClick={() => navigate('/comparison?ids=' + comparisonPickList.map((a) => a.artist_id))} 
                        style={{ width: '2rem', minWidth: '2rem', height: '2rem' }}
                        tooltipOptions={{position: "bottom"}} tooltip="Compare Artists"/>
                </div>
                <div>
                    <Button 
                        outlined className="rounded-lg" icon="pi pi-times-circle"
                        onClick={() => clearPickList()} 
                        style={{ width: '2rem', minWidth: '2rem', height: '2rem' }}
                        tooltipOptions={{position: "bottom"}} tooltip="Clear Comparison List"/>
                </div>
            </div>)
    }

    function trackDisplay(track: Track, focusedArtist: Artist, collaborator: Artist) {
        const focusedArtistContributions = focusedArtist.contributions.filter((cont) => cont.song_id.toString() === track.track_id);
        const collaboratorContributions = collaborator.contributions.filter((cont) => cont.song_id.toString() === track.track_id);

        const primaryArtists = track.credits
            .filter(c => c.contribution_type === "primary")
            .map(c => {
                return <a 
                    key={c.artist_id}
                    className="artist-name-link" 
                    onClick={() => selectArtist(c.artist_id)}> {props.model.getArtist(String(c.artist_id)).name}
                </a>
            })
            .reduce((acc, i) => {
                return <>
                    {acc}
                    {" & "}
                    {i}
                </>
            })

        return (
            <div key={track.track_id} className='flex items-center flex-row' style={{ gap: '1rem' }}>
                <div style={{ height: "4.5rem", width: "4.5rem", minWidth: "4.5rem",  }}>
                    <img src={track.image_url} style={{ height: "100%", width: "100%", objectFit: "cover", borderRadius: "5%" }}></img>
                </div>
                <div className="flex flex-col" style={{ gap: '0.25rem' }}>
                    <span style={{ color: getColorPalette().amber, fontWeight: 800 }}>
                        {track.name}
                    </span>
                    <span style={{ fontSize: "80%" }}>{primaryArtists}</span>
                    <span className='flex' style={{ gap: "0.375rem" }}>
                        {collaboratorContributions.map((cont) => {
                            return <>                    
                                {/* @ts-ignore */}
                                <span className={`chip-${cont.type}-${collaborator.artist_id}-${focusedArtist.artist_id}`} style={{ color: "black", backgroundColor: "#887369", borderRadius: "20px", padding: "0.25rem 0.5rem", fontSize: "70%" }}>{contributionLabels[cont.type].acronym}</span>
                                <Tooltip target={`.chip-${cont.type}-${collaborator.artist_id}-${focusedArtist.artist_id}`} content={`${collaborator.name} is a ${contributionLabels[cont.type].text} on this track`} pt={{text: {style: {boxShadow: "none", fontSize: "80%"}}}}/>
                            </>
                        })}
                        {focusedArtistContributions.map((cont) => {
                          return <>
                            {/* @ts-ignore */}
                            <span className={`chip-${cont.type}-${focusedArtist.artist_id}-${collaborator.artist_id}`} style={{ color: "black", backgroundColor: "#C4951B", borderRadius: "20px", padding: "0.25rem 0.5rem", fontSize: "70%" }}>{contributionLabels[cont.type].acronym}</span>
                            <Tooltip target={`.chip-${cont.type}-${focusedArtist.artist_id}-${collaborator.artist_id}`} content={`${focusedArtist.name} is a ${contributionLabels[cont.type].text} on this track`} pt={{text: {style: {boxShadow: "none", fontSize: "80%"}}}}/>
                          </>
                        })}
                    </span>
                </div>
            </div>
        )
    }

    return (
      <div className='grid grid-cols-9'>
        <div className='flex flex-col col-span-6' style={{gap: '1rem', padding: '1rem'}}>
            <div className="flex flex-row" style={{overflowX: 'scroll', gap: '0.75rem', padding: "0.25rem 0.5rem", borderRadius: '5px', borderLeft: "1px solid #424b57", borderRight: "1px solid #424b57"}}>
                { historyCards }
            </div>
            <NetworkChart model={props.model} artist={artist} clickedNode={selectArtist} filteredArtistIds={filteredArtistIds}></NetworkChart>
            { pickList() }
        </div>

        <div className='flex flex-col col-span-3' style={{gap: '1rem',padding: '1rem'}}>
          <Dropdown value={null}  onChange={setNewArtist} options={allArtists.filter((art) => art.artist_id !== artist.artist_id)} optionLabel="name" placeholder="Select an Artist" filter virtualScrollerOptions={{ itemSize: 38 }}/>
          <div className="flex flex-row" style={{gap: '1rem', alignItems: 'center', justifyContent: "space-between"}}>
            <h1 className="flex flex-row" style={{paddingLeft: '0.75rem', gap: '1.5rem', alignItems: 'center'}}>
              <div style={{ height: "5rem", minWidth: "5rem", width: "5rem"}}>
                <img src={artist.image_url} style={{ height: "100%", width: "100%", objectFit: "cover", border: "2px solid rgb(196, 149, 27)", borderRadius: "50%" }}></img>
              </div>
              <div className="flex items-center">
                {artist.name}
                <Tooltip target=".custom-info-icon" />
                <i className="custom-info-icon pi pi-info-circle p-text-secondary p-overlay-badge" style={{ fontSize: '1rem', marginLeft: '5px', color: '#7b889e' }}
                    data-pr-tooltip="Nodes are distanced based how many collaborations they've had with the central artist. Node size is determined by how many total contributions an artist has. Collaborators are also listed below." 
                    data-pr-position="right" data-pr-at="right+5 top+10" data-pr-my="left center-2"></i>
              </div>
            </h1>
            <div className="flex flex-row" style={{gap: '0.5rem'}}>
              <Button className="rounded-lg" style={{ width: '2rem', minWidth: '2rem', height: '2rem' }} onClick={() => navigate('/artist?id=' + artist.artist_id)} outlined icon="pi pi-user" tooltipOptions={{position: "bottom"}} tooltip="View Artist"/>
              <Button className="rounded-lg" style={{ width: '2rem', minWidth: '2rem', height: '2rem' }} 
                onClick={() => addArtistToPickList(artist)} outlined icon="pi pi-user-plus" tooltipOptions={{position: "left", showOnDisabled: true}} 
                tooltip={comparisonPickList.length === 5 ? "Cannot pick more than 5 artists for comparison" : "Add To Compare List"} 
                disabled={comparisonPickList.length === 5 || comparisonPickList.find((a) => a.artist_id === artist.artist_id)}/>
            </div>
          </div>

          <div className="flex flex-row" style={{gap: '1rem', alignItems: 'center', justifyContent: "start"}}>
            <span className="rounded-lg pi pi-filter" style={{ width: '2rem', minWidth: '2rem', height: '2rem', justifyContent: "flex-end", alignItems: "center", display: "flex" }}/>
            <SelectButton value={contributionsFilter} onChange={(e) => setContributionsFilter(e.value)} optionLabel="label" options={filteringOptions} pt={{
              label: {
                style: {
                  fontWeight: "500"
                }
              },
              // @ts-ignore
              button: ({ context }) => ({
                style: {
                  "background": context.selected && "#887369",
                  borderColor: context.selected && "#887369",
                  "padding": "0.5rem 1rem"
                }
              }),
            }}/>
          </div>

          <DataScroller value={collaboratorNodes.sort((a, b) => -(a.num_collaborations - b.num_collaborations))} itemTemplate={artistItemTemplate} rows={5} lazy={true} inline scrollHeight="58vh" pt={{
            content: {
              style: {
                'padding': 0
              }
            }
          }} emptyMessage={() => (<div style={{padding: "1rem", backgroundColor: "#374151"}}>No collaborators found!</div>)}/>
        </div>
      </div>
    );
}


export default Network