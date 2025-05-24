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
        <div className="max-w-md mx-auto pt-12">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className={"flex w-full gap-4"}>
                    <div>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            minDate={new Date()}
                            excludeDates={bookedDates}
                            className="w-full p-2 border border-[#D0D0D0] bg-[#F7F7F7] h-[55px] rounded-[10px]"
                            placeholderText="Select start date"
                            required
                        />
                    </div>
                    <div>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            minDate={startDate || new Date()}
                            excludeDates={bookedDates}
                            className="w-full p-2 border border-[#D0D0D0] bg-[#F7F7F7] h-[55px] rounded-[10px]"
                            placeholderText="Select end date"
                            required
                        />
                    </div>
                </div>

                <div>
                    <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full p-2 border border-[#D0D0D0] bg-[#F7F7F7] h-[55px] rounded-[10px]"
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
                    className="w-full py-2 bg-[#543786] text-white hover:bg-[#9D88C1] h-[55px] hover:cursor-pointer rounded-[20px] disabled:bg-[#DDD6E8] disabled:text-black disabled:cursor-not-allowed"
                >
                    {loading ? "Booking..." : "Book Now"}
                </button>
                {bookError && <p className="text-red-500">{bookError.message}</p>}
                {data && <p className="text-green-500">Booking confirmed! ID: {data.id}</p>}
            </form>
        </div>
    );
}