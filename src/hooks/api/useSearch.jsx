import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export function useSearch(apiUrl) {
    const [searchParams] = useSearchParams();
    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            console.log("useSearch.jsx - Fetching URL:", apiUrl);

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`${response.status}`);
                }

                const result = await response.json();
                let venues = result.data || [];

                const areDatesValid =
                    startDate &&
                    endDate &&
                    !isNaN(new Date(startDate).getTime()) &&
                    !isNaN(new Date(endDate).getTime()) &&
                    new Date(endDate) > new Date(startDate);

                if (areDatesValid) {
                    const start = new Date(startDate);
                    const end = new Date(endDate);

                    venues = venues.filter((venue) => {
                        // Check if bookings exist and is an array; if not, assume no bookings
                        if (!Array.isArray(venue.bookings)) {
                            return true; // Venue has no bookings, so it's available
                        }
                        return !venue.bookings.some((booking) => {
                            const bookingStart = new Date(booking.dateFrom);
                            const bookingEnd = new Date(booking.dateTo);
                            return bookingStart <= end && bookingEnd >= start;
                        });
                    });
                }

                setData(venues);
            } catch (err) {
                setError(err.message);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiUrl, startDate, endDate]);

    return { data, loading, error };
}