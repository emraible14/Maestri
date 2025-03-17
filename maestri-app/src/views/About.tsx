import {Button} from "primereact/button";
import {getColorPalette} from "../utils/colorUtilities.ts";

function About() {//
  const team = [
    {
      firstName: "Meya",
      lastName: "Vikner",
      imageUrl: "/pics/daniel.jpg",
      linkedin: "https://www.google.it",
      email: "balanica@kth.se"
    },
    {
      firstName: "Ludwig",
      lastName: "Estling",
      imageUrl: "/pics/daniel.jpg",
      linkedin: "https://www.google.it",
      email: "balanica@kth.se"
    },
    {
      firstName: "Isak",
      lastName: "Larsson",
      imageUrl: "/pics/daniel.jpg",
      linkedin: "https://www.google.it",
      email: "balanica@kth.se"
    },
    {
      firstName: "Emma",
      lastName: "Raible",
      imageUrl: "/pics/daniel.jpg",
      linkedin: "https://www.google.it",
      email: "balanica@kth.se"
    },
    {
      firstName: "A. Daniel",
      lastName: "Balanica",
      imageUrl: "/pics/daniel.jpg",
      linkedin: "https://www.linkedin.com/in/andreidanielbalanica/",
      email: "balanica@kth.se"
    },
  ]

  function getPersonCard(person) {
    return (
      <div style={{display: "flex", gap: "1rem", flexDirection:"row", alignItems: "start", border: "1px solid rgb(66, 75, 87)", padding: "1rem", borderRadius: "0.75rem", width: "15rem"}}>
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
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col" style={{padding: "1rem", gap: "1.25rem"}}>
        <div>
          <h1>The Maestri Project</h1>
          <p>This project bla bla bla </p>
          <p>Insert walkthrough video here</p>
        </div>
        <div>
          <h1>The Data</h1>
          <p>Spotify Charts + Genius APIs + dataset files in github repo bla bla</p>
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
          <p>Your one-stop shop for comparing artists, here you'll find who's contributing to who.</p>
        </div>
      </div>
    </div>
  )
}

export default About