import {useFetch} from "../../hooks/api/useFetch.jsx";
import {Link, useParams} from "react-router-dom";
import {API_VENUE} from "../../utilities/constants.js";
import {BookingComponent} from "../../components/UI/Booking.jsx";
import {useEffect} from "react";
import {ImageCarousel} from "../../components/UI/ImageCarousel.jsx";
import {LuCircleParking, LuCircleParkingOff, LuWifi, LuWifiOff} from "react-icons/lu";
import {TbBread, TbBreadOff, TbPaw, TbPawOff} from "react-icons/tb";

export function Venue(){
    const {id} = useParams()
    const {data: venues, loading, error} = useFetch(`${API_VENUE}/${id}?_bookings=true`, false);

    useEffect(() => {
        if (loading || error || !venues || !venues.name) {
            document.title = "Holidaze | Loading...";
        } else {
            document.title = `Holidaze | ${venues.name}`;
        }
    }, [loading, error, venues]);

    if (loading) {
        return <>Loading...</>;
    }

    if (error) {
        console.log(error);
        return <>Could not load venue</>;
    }

    if (!venues || !venues.name) {
        return <>Could not find venue</>;
    }

    return (
        <div className={"w-[90vw] md:w-[80vw] lg:w-[70vw] justify-between p-5 mx-auto flex md:flex-row flex-col min-h-screen pt-15 md:pt-40 gap-8"}>
            <div className={"md:w-[50%] w-full"}>
                <ImageCarousel
                    media={venues.media}
                />
                <p className={"md:flex hidden font sans text-[11px] tracking-wide pt-8"}>{venues.description}</p>
            </div>
            <div>
                <h2 className={"font-sans text-[45px] font-bold tracking-wide"}>{venues.name}</h2>
                <p className={"md:hidden font sans text-[px] tracking-wide pt-8"}>{venues.description}</p>
                <p
                    className={"text-1rem font-sans tracking-wide"}
                >{venues.location?.city || "Unknown City" }, {venues.location?.country || "Unknown Country" }</p>

                <ul className={"flex gap-4 pt-6"}>
                    <li>
                        {venues.wifi ? (
                            <LuWifi />
                        ):(
                            <LuWifiOff />
                        )}
                    </li>
                    <li>
                        {venues.parking ? (
                            <LuCircleParking />
                        ):(
                            <LuCircleParkingOff />
                        )}
                    </li>
                    <li>
                        {venues.breakfast ? (
                            <TbBread />
                        ):(
                            <TbBreadOff />
                        )}
                    </li>
                    <li>
                        {venues.pets ?(
                            <TbPaw />
                        ):(
                            <TbPawOff />
                        )}
                    </li>
                </ul>
                <p className={"text-[32px] font-sans font-semibold tracking-wide pt-8"}>{venues.price}NOK</p>

                <BookingComponent bookings={venues.bookings} venueId={id} />

            </div>
        </div>
    );
}