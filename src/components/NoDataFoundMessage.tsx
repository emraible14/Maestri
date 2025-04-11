function NoDataFoundMessage(props: { message: string }) {
    return (
      <div className="flex flex-col" style={{ position: "absolute", width: "100%", height: "100%", backgroundColor: "rgba(17,24,39,0.7)", zIndex: 100, alignItems: "center", justifyContent: "center", gap: "0.25rem"}} >
        <div style={{ fontWeight: "bold", fontSize: "175%" }}>No Data</div>
        <div style={{ fontSize: "80%"}}>{ props.message }</div>
      </div>
    )
}

export default NoDataFoundMessage;