import {useFetch} from "../../hooks/api/useFetch.jsx";
import {Link, useParams} from "react-router-dom";
import {API_VENUE} from "../../utilities/constants.js";
import {BookingComponent} from "../../components/UI/Booking.jsx";

export function Venue(){
    const {id} = useParams()
    const {data: venues, loading, error} = useFetch(`${API_VENUE}/${id}?_bookings=true`);

    if(loading){
        return(
            <>Loading...</>
        )
    }
    if(error){
        console.log(error)
    }

    if (!venues || venues.length === 0) {
        return <>could not find venue</>;
    }

    return (
        <>
            <img src={venues.media[0].url} alt=""/>
            <h2>{venues.name}</h2>
            <BookingComponent bookings={venues.bookings} venueId={id} />
        </>
    );
}