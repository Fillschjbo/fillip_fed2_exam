import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {API_VENUE} from "../../utilities/constants.js";

export function useSearch() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const startDate = searchParams.get("start");
    const endDate = searchParams.get("end");

    const [data, setData] = useState(null);
    const [loading ,setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            const fetchUrl = query ? `${API_VENUE}/search?q=${encodeURIComponent(query)}&_bookings=true` : `${API_VENUE}`;

            try {
                const response = await fetch(fetchUrl);
                if (!response.ok) {
                    throw new Error(`${response.status}`);
                }

                const result = await response.json();
                let venues = result.data || [];

                const areDatesValid =
                    startDate && endDate &&
                    !isNaN(new Date(startDate).getTime()) &&
                    !isNaN(new Date(endDate).getTime()) &&
                    new Date(endDate) > new Date(startDate);

                if (areDatesValid){
                    const start = new Date(startDate);
                    const end = new Date(endDate);

                    venues = venues.filter((venue) => {
                        return !venue.bookings.some((booking) => {
                            const bookingStart = new Date(booking.dateFrom);
                            const bookingEnd = new Date(booking.dateTo);
                            return bookingStart <= end && bookingEnd >= start;
                        })
                    })
                }

                setData(venues);
            }catch (err){
                setError(err.message);
                setData(null);
            }finally {
                setLoading(false)
            }
        }
        fetchData();
    }, [query, startDate, endDate]);

    return {data, loading, error}
}