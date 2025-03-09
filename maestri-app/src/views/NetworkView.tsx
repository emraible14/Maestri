import {useEffect, useMemo, useState} from "react";
import { DataModel } from '../DataModel';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Artist, NetworkNode, Track } from '../utils/interfaces';
import NetworkChart from '../components/NetworkChart';
import { DataScroller } from 'primereact/datascroller';
import { Panel } from 'primereact/panel';
import { Chip } from 'primereact/chip';
import { Tooltip } from 'primereact/tooltip';
import { getColorPalette } from '../utils/colorUtilities';
import {contributionLabels} from "../utils/dataUtilities.ts";



function Network(props: { readonly model: DataModel }) {
    console.log("rendering Network")
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const allArtists = props.model.getArtists();
    const [artist, setArtist] = useState(props.model.getArtist(searchParams.get("id") || "1405"));
    const [history, setHistory] = useState<string[]>([]);

    const collaborators = props.model.networkData[artist.artist_id]["nodes"].filter((n) => n.id != artist.artist_id).sort((a, b) => -(a.num_collaborations - b.num_collaborations))

    const artistItemTemplate = (node: NetworkNode) => {
        const collaborator = props.model.getArtist(node.id)
        const collaboratorImageLink = collaborator.image_url

        const collaborationsIds = props.model.getCollaborations(artist, collaborator)
        const collaborationsIdSet = new Set(collaborationsIds)
        const collaborations = props.model.getSpecificTracks(collaborationsIds)
        const contributionTypesCounts = Array.from(collaborator.contributions.filter((c) => collaborationsIdSet.has(String(c.song_id))).map((c) => c.type).reduce((acc, e) => (acc.set(e, 1 + (acc.get(e) || 0))), new Map<string, number>).entries())
        const contributionTypesCountsMainArtist = Array.from(artist.contributions.filter((c) => collaborationsIdSet.has(String(c.song_id))).map((c) => c.type).reduce((acc, e) => (acc.set(e, 1 + (acc.get(e) || 0))), new Map<string, number>).entries())


        const header = <>
          <div className='flex items-center flex-row' style={{ gap: '1rem' }}>
            <div style={{ height: "4.5rem", width: "4.5rem" }}>
              <img src={collaboratorImageLink} style={{ height: "100%", width: "100%", objectFit: "cover", borderRadius: "5%" }} alt={collaborator.name}></img>
            </div>
            <div className="flex flex-col" style={{ gap: '0.5rem' }}>
              <a className="artist-name-link" style={{fontSize: "120%"}} onClick={() => selectArtist(collaborator.artist_id)}>{collaborator.name}</a>
              <span className='flex flex-row' style={{ gap: "0.375rem", flexWrap: "wrap"}}>
                  {
                    contributionTypesCounts.map(([type, count]: [string, number]) => {
                      return <>
                        {/* @ts-ignore */}
                        <span className={`chip-${type}-${collaborator.artist_id}`} style={{ color: "black", backgroundColor: "#887369", borderRadius: "20px", padding: "0.25rem 0.5rem", fontSize: "70%" }}>{`${contributionLabels[type]}: ${count}`}</span>
                        <Tooltip target={`.chip-${type}-${collaborator.artist_id}`} content={`${collaborator.name} has ${count} ${type} credits on tracks that ${artist.name} also contributed to`} pt={{text: {style: {boxShadow: "none", fontSize: "80%"}}}}/>
                      </>
                    })
                  }
              </span>
              <span className='flex flex-row' style={{ gap: "0.375rem", flexWrap: "wrap"}}>
                  {
                    contributionTypesCountsMainArtist.map(([type, count]: [string, number]) => {
                      return <>
                        {/* @ts-ignore */}
                        <span className={`chip-${type}-${collaborator.artist_id}-main`} style={{ color: "black", backgroundColor: "#C4951B", borderRadius: "20px", padding: "0.25rem 0.5rem", fontSize: "70%" }}>{`${contributionLabels[type]}: ${count}`}</span>
                        <Tooltip target={`.chip-${type}-${collaborator.artist_id}-main`} content={`${artist.name} has ${count} ${type} credits on tracks that ${collaborator.name} also contributed to`} pt={{text: {style: {boxShadow: "none", fontSize: "80%"}}}}/>
                      </>
                    })
                  }
              </span>

            </div>

          </div>
        </>

        return (
          <Panel header={ header } toggleable collapsed={true} pt={{
            title: {
              style: {
                'font-weight': 'normal'
              },
            },
            header: {
              style: {
                'user-select': 'none',
                'border-radius': '0',
                'padding': '1rem'
              },

            },
             content:
               {
                 style: {
                   'user-select': 'none',
                   'background': "#101827",
                   'gap': '1rem',
                   'overflow-y': 'scroll',
                   'max-height': '30vh',
                   'padding': '2rem 1rem',
                   'display': 'flex',
                   'flex-direction': 'column',
                   'border-radius': '0',
                 },

             },
          }}>
            {collaborations.map((c) => trackDisplay(c, artist, collaborator))}
          </Panel>
        )
    }

    useEffect(() => {
      // console.log("ID", searchParams.get("id"))
      setArtist(props.model.getArtist(searchParams.get("id") || "1405"))
    }, [searchParams.get("id")]);

    useEffect(() => {
      // console.log("history", searchParams.get("history"))
      setHistory((searchParams.get("history") == "" ? undefined : searchParams.get("history"))?.split(",") || []);
    }, [searchParams.get("history")]);

    const historyCards = useMemo(() => {
        console.log("Cards", history, artist.artist_id)
        return [...history, artist.artist_id]
          .map(id  => props.model.getArtist(id))
          .map((artistInfo, idx)=> {
              const artistImageLink = artistInfo.image_url || "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg";

              // const style = {
              //     width: "1.65rem",
              //     maxWidth: '1.65rem',
              //     minWidth: '1.65rem',
              //     height: '1rem',
              //     marginRight: '0rem',
              //     marginLeft: '0.75rem'
              // }

              const content = (
                <>
                    <span data-id={idx} style={{cursor: "pointer", display: "flex", alignItems: "center"}} onClick={(e    ) => backTrackToIdx(Number(e.currentTarget.dataset.id))}>
                        <span style={{height: "2.5rem", width: "2.5rem"}}>
                          <img style={{height: "100%", width: "100%", objectFit: "cover"}} src={artistImageLink}  alt={'Asd'}/>
                        </span>
                        <span className="whitespace-nowrap font-medium">{artistInfo.name}</span>
                    </span>
                    {/*<Button className="rounded-lg" style={style} onClick={() => navigate('/artist?id=' + artistInfo.artist_id)} outlined icon="pi pi-user" tooltipOptions={{position: "bottom"}} tooltip="View Artist"/>*/}
                </>
              );

              const chipStyle = {
                  borderRadius: "22px",
                  border: idx === history.length ? "2px solid rgb(196, 149, 27)" : "2px solid #111827"
              }

              return <Chip style={chipStyle} template={content} />
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

    function trackDisplay(track: Track, focusedArtist: Artist, collaborator: Artist) {
        const focusedArtistContributions = focusedArtist.contributions.filter((cont) => cont.song_id.toString() === track.track_id);
        const collaboratorContributions = collaborator.contributions.filter((cont) => cont.song_id.toString() === track.track_id);

        const primaryArtists = track.credits
            .filter(c => c.contribution_type === "primary")
            .map(c => {
                return <>
                    <a className="artist-name-link" onClick={() => selectArtist(c.artist_id)}> {props.model.getArtist(String(c.artist_id)).name}</a>
                </>
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
                    <span style={{ color: getColorPalette().amber, fontWeight: 800 }}>{track.name}</span>
                    <span style={{ fontSize: "80%" }}>{primaryArtists}</span>
                    <span className='flex' style={{ gap: "0.375rem" }}>
                        {collaboratorContributions.map((cont) => {
                            return <>                    
                                {/* @ts-ignore */}
                                <span className={`chip-${cont.type}-${collaborator.artist_id}-${focusedArtist.artist_id}`} style={{ color: "black", backgroundColor: "#887369", borderRadius: "20px", padding: "0.25rem 0.5rem", fontSize: "70%" }}>{contributionLabels[cont.type]}</span>
                                <Tooltip target={`.chip-${cont.type}-${collaborator.artist_id}-${focusedArtist.artist_id}`} content={`${collaborator.name} is a ${cont.type} on this track`} pt={{text: {style: {boxShadow: "none", fontSize: "80%"}}}}/>
                            </>
                        })}
                        {focusedArtistContributions.map((cont) => {
                          return <>
                            {/* @ts-ignore */}
                            <span className={`chip-${cont.type}-${focusedArtist.artist_id}-${collaborator.artist_id}`} style={{ color: "black", backgroundColor: "#C4951B", borderRadius: "20px", padding: "0.25rem 0.5rem", fontSize: "70%" }}>{contributionLabels[cont.type]}</span>
                            <Tooltip target={`.chip-${cont.type}-${focusedArtist.artist_id}-${collaborator.artist_id}`} content={`${focusedArtist.name} is a ${cont.type} on this track`} pt={{text: {style: {boxShadow: "none", fontSize: "80%"}}}}/>
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
          <br/>
          <div className="flex flex-row" style={{overflowX: 'scroll', gap: '0.75rem', padding: "0.25rem 0.5rem", borderRadius: '5px', borderLeft: "1px solid #424b57", borderRight: "1px solid #424b57"}}>
            { historyCards }
          </div>
          <NetworkChart model={props.model} artist={artist} clickedNode={selectArtist}></NetworkChart>
        </div>

        <div className='flex flex-col col-span-3' style={{gap: '1rem',padding: '1rem'}}>
          <br/>
          <Dropdown value={null}  onChange={setNewArtist} options={allArtists.filter((art) => art.artist_id !== artist.artist_id)} optionLabel="name" placeholder="Select an Artist" filter virtualScrollerOptions={{ itemSize: 38 }}/>
          <div className="flex flex-row" style={{gap: '1rem', alignItems: 'center', justifyContent: "space-between"}}>
            <h1 className="flex flex-row" style={{paddingLeft: '0.75rem', gap: '1.5rem', alignItems: 'center'}}>
              <div style={{ height: "5rem", minWidth: "5rem", width: "5rem"}}>
                <img src={artist.image_url} style={{ height: "100%", width: "100%", objectFit: "cover", border: "2px solid rgb(196, 149, 27)", borderRadius: "50%" }}></img>
              </div>
              <div>{artist.name}</div>
            </h1>
            <div className="flex flex-row" style={{gap: '0.5rem'}}>
              <Button className="rounded-lg" style={{ width: '2rem', minWidth: '2rem', height: '2rem' }} onClick={() => navigate('/artist?id=' + artist.artist_id)} outlined icon="pi pi-user" tooltipOptions={{position: "bottom"}} tooltip="View Artist"/>
              <Button className="rounded-lg" style={{ width: '2rem', minWidth: '2rem', height: '2rem' }} onClick={() => navigate('/comparison?ids=' + artist.artist_id)} outlined icon="pi pi-users" tooltipOptions={{position: "bottom"}} tooltip="Compare Artists"/>
            </div>
          </div>
          <DataScroller value={collaborators} itemTemplate={artistItemTemplate} rows={5} lazy={true} inline scrollHeight="667px" pt={{
            content: {
              style: {
                'padding': 0
              }
            }
          }}/>
        </div>
      </div>
    );
}


export default Network