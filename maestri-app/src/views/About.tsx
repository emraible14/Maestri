import {getColorPalette} from "../utils/colorUtilities.ts";

function About() {//
  const team = [
    {
      firstName: "Meya",
      lastName: "Vikner",
      imageUrl: "/pics/crop-meya.jpg",
      linkedin: "https://www.linkedin.com/in/meya-wikner/",
      email: "meya@kth.se",
      role: "Frontend, Deployment"

    },
    {
      firstName: "Ludwig",
      lastName: "Estling",
      imageUrl: "/pics/ludwig.png",
      linkedin: "https://www.linkedin.com/in/ludwig-estling/",
      email: "lestling@kth.se",
      role: "Frontend, User Testing"

    },
    {
      firstName: "Isak",
      lastName: "Larsson",
      imageUrl: "/pics/crop-isak.jpg",
      linkedin: "https://www.linkedin.com/in/isak-larsson-a3867817a/",
      email: "isaklar@kth.se",
      role: "Frontend, Data Handling"
    },
    {
      firstName: "Emma",
      lastName: "Raible",
      imageUrl: "/pics/crop-emma.jpg",
      linkedin: "https://www.linkedin.com/in/emma-raible-640416198/",
      email: "raible@kth.se",
      role: "Frontend, User Testing"
    },
    {
      firstName: "A. Daniel",
      lastName: "Balanica",
      imageUrl: "/pics/crop-daniel.jpg",
      linkedin: "https://www.linkedin.com/in/andreidanielbalanica/",
      email: "balanica@kth.se",
      role: "Frontend, Data Handling"
    },
  ]

  function getPersonCard(person: any) {
    return (
      <div style={{display: "flex", gap: "1rem", flexDirection:"row", alignItems: "start", border: "1px solid rgb(66, 75, 87)", padding: "1rem", borderRadius: "0.75rem", width: "18rem"}}>
        <div style={{ height: "6rem", minWidth: "6rem", width: "6rem"}}>
          <img src={person.imageUrl} style={{ height: "100%", width: "100%", objectFit: "cover", borderRadius: "1%" }}></img>
        </div>
        <div style={{display: "flex", flexDirection:"column", alignItems: "start", justifyContent:"center", fontSize: "1rem", height: "100%", gap: "0.5rem"}}>
          <div>{person.firstName}</div>
          <div style={{fontWeight: "700"}}>{person.lastName}</div>
          <div style={{display: "flex", gap: "0.75rem", flexDirection:"row"}}>
            <i className="pi pi-linkedin" style={{ fontSize: '1.5rem', color: getColorPalette().amber, cursor: "pointer"}} onClick={() => window.location.href = person.linkedin}></i>
            <i className="pi pi-envelope" style={{ fontSize: '1.5rem', color: getColorPalette().amber, cursor: "pointer"}} onClick={() => window.location.href = `mailto:${person.email}`}></i>
          </div>
          <div style={{fontSize: 12}}>{person.role}</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col" style={{padding: "1rem", gap: "1.25rem"}}>
        <div>
          <p>
            This project allows users to uncover the hidden influencers in music by visually exploring data from top-charting songs. 
            On the network page, users can trace connections and discover relationships between artists. On the comparison page, they can compare 
            artists directly to analyze differences in their music production. Lastly, on the artist page users can explore an individual 
            artist's impact on global charts and track the rise and fall of their top songs over time. For a full walkthrough of 
            how to navigate the site, check out the video tutorial linked below. All work was done for the KTH 
            course <a href="https://www.kth.se/student/kurser/kurs/DH2321?l=en">DH2321 Information Visualization</a> as part of the MSc in 
            Computer Science.
          </p>
          <p>Insert walkthrough video here</p>
        </div>
        <div>
          <h1>The Data</h1>
          <p>
            Our dataset combines information 
            from <a href="https://charts.spotify.com/home">Spotify Charts</a> and <a href="https://docs.genius.com/">Genius.com</a>. 
            We collected the top 200 charting tracks each week from 2023 to 2024, 
            covering global charts and country-level data for 30 countries across Europe and North America. Using the Genius search API, 
            we mapped these tracks to Genius metadata, retrieving artist and track details, images, song credits, and 
            sample/interpolation data. From this, we derived metrics such as total credits, average team size, and the number of 
            samples/interpolations used. Data processing was conducted
            in <a href="https://www.python.org/">Python</a> using <a href="https://pandas.pydata.org/docs/index.html">Pandas</a>, 
            with most computations performed in advance to optimize performance—particularly for the network graph. The final 
            processed data is stored as static JSON files, 
            available in our <a href="https://github.com/emraible14/Maestri">GitHub repository</a>.
            </p>
        </div>
        <div style={{display: "flex", gap: "2rem", width: "max-content", flexDirection:"column"}}>
          <h1 style={{marginBottom: "0rem"}}>The Team</h1>
          <div style={{display: "flex", gap: "1rem", flexDirection:"row"}}>
            {team.slice(0, 3).map(getPersonCard)}
          </div>
          <div style={{display: "flex", gap: "1rem", flexDirection:"row", justifyContent: "center", width: "100%"}}>
            {team.slice(3, 5).map(getPersonCard)}
          </div>
        </div>
        <div>
          <h1>References</h1>
          <p>Data was pulled from <a href="https://charts.spotify.com/home">Spotify Charts</a> and <a href="https://docs.genius.com/">Genius.com</a>. 
            All artist and track images were available in the Genius data. Home icon gif was borrowed 
            from <a href="https://routenote.com/blog/spotify-partner-with-genius-lyrics/">this blog</a>. 
            We used <a href="https://nivo.rocks/">Nivo</a> and <a href="https://primereact.org/">PrimeReact</a> component libraries, with all icons 
            coming from PrimeReact.
          </p>
          <p> 
            Data processing was done using <a href="https://www.python.org/">Python</a> and <a href="https://pandas.pydata.org/docs/index.html">Pandas</a>.
            Application was developed 
            using <a href="https://18.react.dev/">React v18</a> with <a href="https://www.typescriptlang.org/">Typescript</a> and <a href="https://vite.dev/">Vite</a>, and 
            deployed using <a href="https://pages.github.com/">Github Pages</a>. 
              </p>
        </div>
      </div>
    </div>
  )
}

export default About