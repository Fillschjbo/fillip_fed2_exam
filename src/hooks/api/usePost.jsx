import {useState} from "react";
import {API_KEY} from "../../utilities/constants.js";

export function usePost () {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const post = async (url, payload) => {
        if (!url || typeof url !== "string") {
            setError(new Error("URL must be a non-empty string."));
            return;
        }
        if (!payload || typeof payload !== "object") {
            setError(new Error("Payload must be a non-empty object."));
            return;
        }

        setLoading(true);
        setError(null);
        setData(null);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                    "X-Noroff-API-Key": API_KEY,
                },
                body: JSON.stringify(payload),
            });

            if(!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.errors?.[0]?.message || `failed to post: ${response.status} ${response.statusText}`;
                throw new Error(errorMessage)
            }

            const result = await response.json();
            setData(result);
        }catch (err) {
            setError(err);
        }finally {
            setLoading(false)
        }
    };
    return { post, loading, error, data }
}