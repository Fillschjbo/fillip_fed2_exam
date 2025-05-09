import { useEffect, useState } from "react";

export function useFetch(url) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`${response.status}`)
                }
                const result = await response.json();
                setData(result.data)
            }catch (err){
                setError(err)
            }finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [url]);

    return {data, loading, error}
}