import {useFetch} from "../../hooks/api/useFetch.jsx";
import {Link, useParams, useNavigate} from "react-router-dom";
import {API_VENUE} from "../../utilities/constants.js";
import {BookingComponent} from "../../components/UI/Booking.jsx";
import {useEffect} from "react";
import {ImageCarousel} from "../../components/UI/ImageCarousel.jsx";
import {LuCircleParking, LuCircleParkingOff, LuWifi, LuWifiOff} from "react-icons/lu";
import {TbBread, TbBreadOff, TbPaw, TbPawOff, TbPencil, TbTrash} from "react-icons/tb";
import {useDelete} from "../../hooks/api/useDelete.jsx";
import {toast} from "react-hot-toast";

export function Venue(){
    const {id} = useParams()
    const navigate = useNavigate();
    const {data: venues, loading, error} = useFetch(`${API_VENUE}/${id}?_bookings=true&_owner=true`, false);
    const { deleteData, data: deleteDataResponse, loading: deleteLoading, error: deleteError } = useDelete();

    // Safe user parsing with fallback
    const getUserFromStorage = () => {
        try {
            const userStr = localStorage.getItem("user");
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error("Error parsing user from localStorage:", error);
            return null;
        }
    };

    const user = getUserFromStorage();

    const handleDeleteVenue = async () => {
        if (!window.confirm(`Are you sure you want to delete "${venues.name}"? This action cannot be undone and will delete all bookings for this venue.`)) {
            return;
        }

        try {
            await deleteData(`${API_VENUE}/${id}`);
            toast.success("Venue deleted successfully");
            navigate("/");
        } catch (err) {
            console.error("Venue delete error:", err);
            toast.error(`Failed to delete venue: ${err.message}`);
        }
    };

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

    const isOwner = user && venues.owner && user.name === venues.owner.name;

    return (
        <div className={"w-[90vw] md:w-[80vw] lg:w-[70vw] justify-between p-5 mx-auto flex md:flex-row flex-col min-h-screen pt-15 md:pt-40 gap-8"}>
            <div className={"md:w-[50%] w-full"}>
                <ImageCarousel
                    media={venues.media}
                />
                {isOwner && (
                    <div className={"w-full flex gap-2 justify-end"}>
                        <Link to={`/venue/edit/${venues.id}`}>
                            <button className={"py-2 px-4 border border-gray-300 rounded-[10px] flex gap-2 items-center hover:cursor-pointer"}>
                                <TbPencil />
                                Edit
                            </button>
                        </Link>

                        <button
                            onClick={handleDeleteVenue}
                            disabled={deleteLoading}
                            className={`py-2 px-4 bg-red-500 text-white rounded-[10px] flex gap-2 items-center ${deleteLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600 cursor-pointer"}`}
                            aria-label={`Delete venue ${venues.name}`}
                        >
                            <TbTrash />
                            {deleteLoading ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                )}
                <p className={"md:flex hidden font sans text-1rem tracking-wide pt-8"}>{venues.description}</p>
            </div>
            <div>
                <h2 className={"font-sans text-[45px] font-bold tracking-wide truncate"}>{venues.name}</h2>
                <p className={"md:hidden font-sans tracking-wide pt-8"}>{venues.description}</p>
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