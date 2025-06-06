import {Link, useParams} from "react-router-dom";
import { useFetch } from "../../hooks/api/useFetch.jsx";
import { useEdit } from "../../hooks/api/useEdit.jsx";
import { API_PROFILE, API_BOOKINGS } from "../../utilities/constants.js";
import { TbPencil } from "react-icons/tb";
import { SearchResultCard } from "../../components/Cards/SearchResultCard.jsx";
import {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useDelete} from "../../hooks/api/useDelete.jsx";
import {toast} from "react-hot-toast";

export function Profile() {
    const { name } = useParams();
    const { data: profile, loading, error, refetch } = useFetch(`${API_PROFILE}/${name}?_bookings=true&_venues=true`);
    const { edit, loading: editLoading, error: editError, data: editData } = useEdit();
    const [activeView, setActiveView] = useState("bookings");
    const [selectedBooking, setSelectedBooking] = useState(null);
    const { deleteData, data: deleteDataResponse, loading: deleteLoading, error: deleteError } = useDelete();
    const [formData, setFormData] = useState({
        dateFrom: null,
        dateTo: null,
        guests: 1
    });

    const handleEditBooking = (booking) => {
        try {
            if (!booking || !booking.dateFrom || !booking.dateTo) {
                toast.error("Cannot edit booking: Invalid booking data");
                return;
            }

            setSelectedBooking(booking);
            setFormData({
                dateFrom: new Date(booking.dateFrom),
                dateTo: new Date(booking.dateTo),
                guests: booking.guests || 1,
            });
        } catch (err) {
            console.error("Error in handleEditBooking:", err);
            toast.error("Failed to open edit modal: " + err.message);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date, field) => {
        setFormData((prev) => ({ ...prev, [field]: date }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.dateFrom || !formData.dateTo) {
            toast.error("Please select both check-in and check-out dates");
            return;
        }
        if (formData.dateTo <= formData.dateFrom) {
            toast.error("Check-out date must be after check-in date");
            return;
        }
        const payload = {
            dateFrom: formData.dateFrom.toISOString(),
            dateTo: formData.dateTo.toISOString(),
            guests: parseInt(formData.guests, 10),
        };

        try {
            await edit(`${API_BOOKINGS}/${selectedBooking.id}`, payload);
            if (!editError) {
                setSelectedBooking(null);
                if (refetch) {
                    refetch();
                }
            }
        } catch (err) {
            toast.error("Error updating booking:", err);
        }
    };

    const closeModal = () => {
        console.log("Closing modal");
        setSelectedBooking(null);
        setFormData({ dateFrom: null, dateTo: null, guests: 1 });
    };

    useEffect(() => {
        if (loading || error || !profile || !profile.name) {
            document.title = "Holidaze | Loading...";
        } else {
            document.title = `Holidaze | ${profile.name}`;
        }
    }, [loading, error, profile]);

    const handleDeleteBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to delete this booking?")) {
            return;
        }

        try {
            await deleteData(`${API_BOOKINGS}/${bookingId}`);

            closeModal();

            if (refetch) {
                refetch();
            } else {
                window.location.reload();
            }
        } catch (err) {
            console.error("Delete error:", err);
            toast.error(`Failed to delete booking: ${err.message}`);
        }
    };

    if (loading) {
        return <>Loading...</>;
    }

    if (error) {
        console.log(error);
    }

    if (!profile || profile.length === 0) {
        return <>could not find profile</>;
    }

    return (
        <div className={"w-[90vw] md:w-[80vw] lg:w-[70vw] p-5 mx-auto flex flex-col min-h-screen pt-10 gap-8"}>
            <div className={"flex rounded-[20px] border border-gray-300 w-full h-fit p-[43px] items-center gap-6 relative"}>
                <div>
                    <img
                        src={profile.avatar.url}
                        alt="profile avatar"
                        className={"md:size-50 size-15 rounded-full object-cover"}
                    />
                </div>
                <div className={"h-full w-[70%] flex flex-col justify-center gap-6"}>
                    <h2 className={"text-[24px] font-sans font-bold tracking-wide"}>{profile.name}</h2>
                    <p className={"text-[16px] font-sans font-normal tracking-wide"}>{profile.email}</p>
                    {profile.venueManager ? (
                        <p className={"text-[16px] font-sans font-normal tracking-wide"}>Venue Manager</p>
                    ) : (
                        <p className={"text-[16px] font-sans font-normal tracking-wide"}>Not a venue manager. Edit profile to become venue manager.</p>
                    )}
                </div>
                <Link to={`/profile/edit/${name}`}>
                    <button className={"py-2 px-4 border border-gray-300 absolute top-4 right-4 rounded-[10px] flex gap-2 items-center hover:cursor-pointer"}>
                        <TbPencil />
                        Edit
                    </button>
                </Link>
            </div>

            <div className={"w-full flex justify-center pt-20"}>
                <div className={"flex flex-col"}>
                    <div className={"flex justify-between md:px-50 px-20 gap-10"}>
                        <h3
                            className={`font-serif font-bold text-[24px] md:text-[45px] cursor-pointer ${activeView === "bookings" ? "underline" : ""}`}
                            onClick={() => setActiveView("bookings")}
                        >
                            My Bookings
                        </h3>
                        {profile.venueManager && (
                            <h3
                                className={`font-serif font-bold text-[24px] md:text-[45px] cursor-pointer ${activeView === "venues" ? "underline" : ""}`}
                                onClick={() => setActiveView("venues")}
                            >
                                My Venues
                            </h3>
                        )}
                    </div>
                    <div className="w-[90vw] lg:w-[70vw] flex flex-col gap-6 p-10">
                        {activeView === "bookings" ? (
                            profile.bookings && profile.bookings.length > 0 ? (
                                profile.bookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="cursor-pointer"
                                        onClick={() => {
                                            console.log("Booking card clicked:", booking);
                                            handleEditBooking(booking);
                                        }}
                                    >
                                        <SearchResultCard
                                            city={booking.venue?.location?.city || "Unknown City"}
                                            country={booking.venue?.location?.country || "Unknown Country"}
                                            name={booking.venue?.name || "Unknown Venue"}
                                            price={booking.venue?.price || 0}
                                            image={booking.venue?.media?.[0]?.url}
                                            aria-label={`Edit booking for ${booking.venue?.name || "venue"}`}
                                        />
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center">No bookings found</p>
                            )
                        ) : (
                            profile.venues && profile.venues.length > 0 ? (
                                profile.venues.map((venue) => (
                                    <Link to={`/venue/${venue.id}`}  key={venue.id}>
                                        <SearchResultCard
                                            city={venue.location?.city || "Unknown City"}
                                            country={venue.location?.country || "Unknown Country"}
                                            name={venue.name}
                                            price={venue.price}
                                            image={venue.media?.[0]?.url}
                                        />
                                    </Link>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center">No venues found</p>
                            )
                        )}
                    </div>
                </div>
            </div>

            {selectedBooking && (
                <div
                    className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            closeModal();
                        }
                    }}
                >

                    <div className="bg-white p-6 rounded-[20px] w-full max-w-md relative">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
                            aria-label="Close modal"
                        >
                            ✕
                        </button>
                        <h2 className="text-[24px] font-sans font-bold tracking-wide mb-4">Edit Booking</h2>
                        <p className="text-gray-600 mb-4">
                            Venue: {selectedBooking.venue?.name || "Unknown Venue"}
                        </p>

                        <div className="mb-4">
                            <button
                                onClick={() => handleDeleteBooking(selectedBooking.id)}
                                disabled={deleteLoading}
                                className={`bg-red-500 text-white px-4 py-2 rounded-[10px] font-sans text-[16px] w-full hover:cursor-pointer  ${deleteLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"}`}
                                aria-label={`Delete booking for ${selectedBooking.venue?.name || "venue"}`}
                            >
                                {deleteLoading ? "Deleting..." : "Delete Booking"}
                            </button>
                        </div>

                        {editError && (
                            <p className="text-red-500 font-sans text-[16px] mb-4">
                                {editError.message || "Failed to update booking"}
                            </p>
                        )}
                        {editData && (
                            <p className="text-green-500 font-sans text-[16px] mb-4">
                                Booking updated successfully!
                            </p>
                        )}
                        {deleteError && (
                            <p className="text-red-500 font-sans text-[16px] mb-4">{deleteError.message || "Failed to delete booking"}</p>
                        )}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-[16px] font-sans font-medium mb-2">
                                    Check-in Date
                                </label>
                                <DatePicker
                                    selected={formData.dateFrom}
                                    onChange={(date) => handleDateChange(date, 'dateFrom')}
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    minDate={new Date()}
                                    placeholderText="Select check-in date and time"
                                    className="w-full p-2 border border-gray-300 rounded-[10px] font-sans text-[16px]"
                                    wrapperClassName="w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[16px] font-sans font-medium mb-2">
                                    Check-out Date
                                </label>
                                <DatePicker
                                    selected={formData.dateTo}
                                    onChange={(date) => handleDateChange(date, 'dateTo')}
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    minDate={formData.dateFrom || new Date()}
                                    placeholderText="Select check-out date and time"
                                    className="w-full p-2 border border-gray-300 rounded-[10px] font-sans text-[16px]"
                                    wrapperClassName="w-full"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="guests" className="block text-[16px] font-sans font-medium">
                                    Number of Guests
                                </label>
                                <input
                                    type="number"
                                    id="guests"
                                    name="guests"
                                    value={formData.guests}
                                    onChange={handleInputChange}
                                    min="1"
                                    className="w-full p-2 border border-gray-300 rounded-[10px] font-sans text-[16px]"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-300 rounded-[10px] font-sans text-[16px] hover:bg-gray-400 hover:cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editLoading}
                                    className={`px-4 py-2 bg-[#543786] text-white rounded-[10px] font-sans text-[16px] hover:bg-[#9D88C1] hover:cursor-pointer ${editLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {editLoading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}