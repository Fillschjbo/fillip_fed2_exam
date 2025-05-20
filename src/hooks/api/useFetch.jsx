import { useEffect, useState } from "react";
import {API_KEY} from "../../utilities/constants.js";

export function useFetch(url, requiresAuth = true) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null)

            try {
                const token = localStorage.getItem("token");
                const headers = {
                    "Content-Type": "application/json",
                };

                if (requiresAuth) {
                    if (!token) {
                        throw new Error("Authentication token is missing. Please log in.");
                    }
                    headers["Authorization"] = `Bearer ${token}`;
                    headers["X-Noroff-API-Key"] = API_KEY;
                }

                const response = await fetch(url, {
                    method: "GET",
                    headers,
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    const errorMessage = errorData.errors?.[0]?.message || `Request failed: ${response.status} ${response.statusText}`;
                    throw new Error(errorMessage);
                }

                const result = await response.json();
                setData(result.data);
            }catch (err){
                setError(err)
            }finally {
                setLoading(false)
            }
        }
        if (url) {
            fetchData();
        }
    }, [url, requiresAuth]);

    return {data, loading, error}
}