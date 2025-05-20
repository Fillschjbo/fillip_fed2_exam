import {useParams} from "react-router-dom";
import {useFetch} from "../../hooks/api/useFetch.jsx";
import {API_PROFILE} from "../../utilities/constants.js";

export function Profile() {
    const {name} = useParams();
    const {data: profile, loading, error} = useFetch(`${API_PROFILE}/${name}?_bookings=true&_venues=true`);

    if(loading){
        return(
            <>Loading...</>
        )
    }
    if(error){
        console.log(error)
    }

    if (!profile || profile.length === 0) {
        return <>could not find profile</>;
    }

    return(
        <>
            <h2>{profile.name}</h2>
        </>
    )
}