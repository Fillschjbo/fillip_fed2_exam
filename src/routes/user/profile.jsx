import {useParams} from "react-router-dom";
import {useFetch} from "../../hooks/api/useFetch.jsx";
import {API_PROFILE} from "../../utilities/constants.js";
import {TbPencil} from "react-icons/tb";
import {SearchResultCard} from "../../components/Cards/SearchResultCard.jsx";
import {useState} from "react";

export function Profile() {
    const {name} = useParams();
    const {data: profile, loading, error} = useFetch(`${API_PROFILE}/${name}?_bookings=true&_venues=true`);
    const [activeView, setActiveView] = useState("bookings");

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
        <div className={"w-[90vw] md:w-[80vw] lg:w-[70vw] p-5 mx-auto flex flex-col min-h-screen pt-10 gap-8"}>
            <div className={"flex rounded-[20px] border border-gray-300 w-full h-fit p-[43px] items-center gap-6 relative"}>
                <div>
                    <img src={profile.avatar.url} alt="profile avatar"
                        className={"md:size-50 size-15 rounded-full"}
                    />
                </div>
                <div className={"h-full w-[70%] flex flex-col justify-center gap-6"}>
                    <h2 className={"text-[24px] font-sans font-bold tracking-wide"}>{profile.name}</h2>
                    <p className={"text-[16px] font-sans font-normal tracking-wide"}>{profile.email}</p>
                    {profile.venueManager ? (
                        <p className={"text-[16px] font-sans font-normal tracking-wide"}>Venue Manager</p>
                    ):(
                        <p className={"text-[16px] font-sans font-normal tracking-wide"}>Not a venue manager. Edit profile to become venue manager.</p>
                    )}
                </div>
                <button className={"py-2 px-4 border border-gray-300 absolute top-4 right-4 rounded-[10px] flex gap-2 items-center"}>
                    <TbPencil />
                    Edit
                </button>
            </div>

            <div className={"w-full flex justify-center pt-20"}>
                <div className={"flex flex-col"}>
                    <div className={"flex justify-between md:px-50 px-20 gap-10"}>

                        <h3
                            className={`font-serif font-bold text-[45px] cursor-pointer ${activeView === "bookings" ? "underline" : ""}`}
                            onClick={() => setActiveView("bookings")}
                        >
                            My Bookings
                        </h3>
                        {profile.venueManager && (
                            <h3
                                className={`font-serif font-bold text-[45px] cursor-pointer ${activeView === "venues" ? "underline" : ""}`}
                                onClick={() => setActiveView("venues")}
                            >
                                My Venues
                            </h3>
                        )}

                    </div>
                    <div className="w-[90vw] lg:w-[70vw] flex flex-col gap-6 p-10">
                        {activeView === "bookings" ? (
                            profile.bookings.map((booking) => (
                                <SearchResultCard
                                    key={booking.id}
                                    city={booking.venue?.location?.city || "Unknown City"}
                                    country={booking.venue?.location?.country || "Unknown Country"}
                                    name={booking.venue?.name || "Unknown Venue"}
                                    price={booking.venue?.price || 0}
                                    image={booking.venue?.media?.[0]?.url}
                                />
                                 ))
                                ) : (
                                    profile.venues.map((venue) => (
                                    <SearchResultCard
                                    key={venue.id}
                                    city={venue.location?.city || "Unknown City"}
                                    country={venue.location?.country || "Unknown Country"}
                                    name={venue.name}
                                    price={venue.price}
                                    image={venue.media?.[0]?.url}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}