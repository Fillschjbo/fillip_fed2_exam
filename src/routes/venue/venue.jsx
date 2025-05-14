import {useFetch} from "../../hooks/api/useFetch.jsx";
import {Link, useParams} from "react-router-dom";
import {API_VENUE} from "../../utilities/constants.js";

export function Venue(){
    const {id} = useParams(id)
    const {data: venues, loading, error} = useFetch(`${API_VENUE}/id`);

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
        </>
    );
}