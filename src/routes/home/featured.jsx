import {useFetch} from "../../hooks/api/useFetch.jsx";
import {VenueCard} from "../../components/Cards/VenueCard.jsx";
import {Link} from "react-router-dom";
import {API_VENUE} from "../../utilities/constants.js";
import {Searchbar} from "../../components/UI/Searchbar.jsx";
import {HeroBanner} from "../../components/UI/HeroBanner.jsx";


export function Featured(){
    const {data: venues, loading, error} = useFetch(`${API_VENUE}?sort=created&sortBy=ASC`, false);

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
        <div className={"flex flex-col items-center w-screen bg-[#F5F5F7]"}>
            <title>Holidaze | Featured</title>
            <HeroBanner />
            <div className={"flex flex-wrap gap-x-3 gap-y-5 w-screen justify-center"}>
                {venues.map((venue) => (
                    <Link to={`/venue/${venue.id}`} key={venue.id}>
                        <VenueCard
                            title={venue.name}
                            image={venue.media[0]?.url}
                            city={venue.location?.city || "Unknown City"}
                            country={venue.location?.country || "Unknown Country"}
                            price={venue.price || 0}
                            wifi={venue.meta?.wifi || false}
                            parking={venue.meta?.parking || false}
                            breakfast={venue.meta?.breakfast || false}
                            pets={venue.meta?.pets || false}
                            rating={venue.rating || 0}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}