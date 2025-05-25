import { useState } from "react";
import { API_KEY } from "../../utilities/constants.js";

export function useDelete() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteData = async (url) => {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    "X-Noroff-API-Key": API_KEY,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.errors?.[0]?.message || `Failed to delete resource: ${response.status}`);
            }

            setData({ status: response.status, success: true });
        } catch (err) {
            setError(err);
            console.error("Delete error:", err);
        } finally {
            setLoading(false);
        }
    };

    return { deleteData, data, loading, error };
}