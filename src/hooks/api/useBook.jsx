import {useState} from "react";
import { API_BOOKINGS, API_KEY} from "../../utilities/constants.js";

export function useBook(){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const book = async({dateFrom, dateTo, guests, venueId}) => {
        if (!dateFrom || !dateTo || guests === undefined || !venueId){
            setError(new Error("please fill out all fields"));
            return
        }

        if (typeof dateFrom !== "string" || typeof dateTo !== "string") {
            setError(new Error("dateFrom and dateTo must be strings in ISO format"));
            return;
        }

        if (typeof guests !== "number" || guests < 1){
            setError(new Error("Number of guests must be 1 or more"));
            return;
        }

        if (typeof venueId !== "string"){
            setError(new Error("venueID must be a string"));
            return;
        }

        setLoading(true);
        setError(null);
        setData(null);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BOOKINGS}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                    "X-Noroff-API-Key": API_KEY,
                },
                body: JSON.stringify({
                    dateFrom,
                    dateTo,
                    guests,
                    venueId
                })
            })
            if (!response.ok){
                const errorData = await response.json();
                const errorMessage = errorData.errors?.[0]?.message || `Failed to book: ${response.status} ${response.statusText}`;
                throw new Error(errorMessage);
            }

            const result = await response.json();
            setData(result);
        }catch (err){
            setError(err);
        }finally {
            setLoading(false);
        }
    };

    return {book, loading, error, data}
}