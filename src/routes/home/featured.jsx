import {useFetch} from "../../hooks/api/useFetch.jsx";

export function Featured(){
    const {data: venues, loading, error} = useFetch("https://v2.api.noroff.dev/holidaze/venues");

    if(loading){
        return(
            <>Loading...</>
        )
    }
    if(error){
        console.log(error)
    }

    if (!venues || venues.length === 0) {
        return <>No venues available.</>;
    }

    return (
        <>
            {venues.map((venue) => (
                <h1 key={venue.id}>{venue.name}</h1>
            ))}
        </>
    );
}