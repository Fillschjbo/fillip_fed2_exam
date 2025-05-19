import React, { useState } from "react";
import DatePicker from "react-datepicker";
import {useBook} from "../../hooks/api/useBook.jsx";
import { eachDayOfInterval, parseISO, isSameDay } from "date-fns";

export function BookingComponent({ bookings, venueId }) {
    const { book, loading, error: bookError, data } = useBook();
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [guests, setGuests] = useState(1);
    const [bookedDates, setBookedDates] = useState([]);

    React.useEffect(() => {
        if (bookings) {
            const excludedDates = bookings.flatMap((booking) => {
                const start = parseISO(booking.dateFrom);
                const end = parseISO(booking.dateTo);
                return eachDayOfInterval({ start, end });
            });
            setBookedDates(excludedDates);
        }
    }, [bookings]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!venueId) {
            console.error("No venueId found");
            return;
        }

        await book({
            dateFrom: startDate?.toISOString() || "",
            dateTo: endDate?.toISOString() || "",
            guests,
            venueId,
        });

        if (data) {
            console.log("Booking successful:", data);
        }
    };

    const isDateExcluded = (date) => bookedDates.some((excluded) => isSameDay(date, excluded));

    return (
        <div className="max-w-md mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Book Your Stay</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        minDate={new Date()}
                        excludeDates={bookedDates}
                        className="w-full p-2 border rounded"
                        placeholderText="Select start date"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        minDate={startDate || new Date()}
                        excludeDates={bookedDates}
                        className="w-full p-2 border rounded"
                        placeholderText="Select end date"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Number of Guests</label>
                    <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                        required
                    >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                            <option key={num} value={num}>
                                {num}
                            </option>
                        ))}
                    </select>
                </div>
                <button
                    type="submit"
                    disabled={loading || !startDate || !endDate || isDateExcluded(startDate) || isDateExcluded(endDate)}
                    className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {loading ? "Booking..." : "Book Now"}
                </button>
                {bookError && <p className="text-red-500">{bookError.message}</p>}
                {data && <p className="text-green-500">Booking confirmed! ID: {data.id}</p>}
            </form>
        </div>
    );
}