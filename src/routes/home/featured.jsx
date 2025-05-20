import {useFetch} from "../../hooks/api/useFetch.jsx";
import {VenueCard} from "../../components/Cards/VenueCard.jsx";
import {Link} from "react-router-dom";
import {API_VENUE} from "../../utilities/constants.js";
import {Searchbar} from "../../components/UI/Searchbar.jsx";


export function Featured(){
    const {data: venues, loading, error} = useFetch(API_VENUE, false);

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
            <Searchbar />
            {venues.map((venue) => (
                <Link to={'/venue/' + venue.id} key={venue.id}>
                    <VenueCard
                        title={venue.name}
                        // image={venue.media[0].url}
                        city={venue.city}
                        country={venue.country}
                        price={venue.price}
                        wifi={venue.meta.wifi}
                        parking={venue.meta.parking}
                        breakfast={venue.meta.breakfast}
                        pets={venue.meta.pets}
                        rating={venue.rating}
                    />
                </Link>

            ))}
        </>
    );
}