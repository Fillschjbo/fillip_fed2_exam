import {useState} from "react";


export function useAuth(){
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const register = async (registerData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("https://v2.api.noroff.dev/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                },
                body: JSON.stringify(registerData),
            });
            if(!response.ok){
                throw new Error(`${response.status}`)
            }
            const result = await response.json();
            setData(result);
            return result;
        }catch(err){
            setError(err);
            throw err;
        }finally {
            setLoading(false)
        }
    }

    const login = async (loginData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("https://v2.api.noroff.dev/auth/login?_holidaze=true", {
                method: "POST",
                headers: {
                    "Content-Type":"application/json",
                },
                body: JSON.stringify(loginData),
            });
            if(!response.ok){
                throw new Error(`${response.status}`)
            }
            const result = await response.json();
            setData(result);

            const user = {
                name: result.data.name,
                avatar: result.data.avatar.url,
            }

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", result.data.accessToken);
            localStorage.setItem("venueManager", result.data.venueManager);

            return result;
        }catch(err){
            setError(err);
            throw err;
        }finally {
            setLoading(false)
        }
    }
    return { register, login, data, loading, error }
}