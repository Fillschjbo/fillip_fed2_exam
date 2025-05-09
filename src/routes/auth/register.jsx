import { useForm } from "react-hook-form";
import {useAuth} from "../../hooks/api/useAuth.jsx";

export function Register() {
    const { register: authRegister, loading, error } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            bio: "",
            avatar: { url: "", alt: "" },
            banner: { url: "", alt: "" },
            venueManager: false,
        },
    });

    const onSubmit = async (data) => {
        try {

            const payload = {
                name: data.name,
                email: data.email,
                password: data.password,
                ...(data.bio && { bio: data.bio }),
                ...(data.avatar.url && {
                    avatar: {
                        url: data.avatar.url,
                        alt: data.avatar.alt || "Avatar",
                    },
                }),
                ...(data.banner.url && {
                    banner: {
                        url: data.banner.url,
                        alt: data.banner.alt || "Banner",
                    },
                }),
                ...(data.venueManager && { venueManager: data.venueManager }),
            };
            await authRegister(payload);
            alert("Registration successful!");
        } catch (err) {
            console.error("Registration failed:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h2>Register</h2>
            {error && <p style={{ color: "red" }}>{error.message}</p>}

            <div>
                <label>Name:</label>
                <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
            </div>

            <div>
                <label>Email:</label>
                <input
                    type="email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/,
                            message: "Email must be a valid @stud.noroff.no address",
                        },
                    })}
                />
                {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
            </div>

            <div>
                <label>Password:</label>
                <input
                    type="password"
                    {...register("password", {
                        required: "Password is required",
                        minLength: { value: 8, message: "Password must be at least 8 characters" },
                    })}
                />
                {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
            </div>

            <div>
                <label>Bio (optional):</label>
                <textarea {...register("bio")} />
            </div>

            <div>
                <label>Avatar URL (optional):</label>
                <input type="url" {...register("avatar.url")} />
            </div>

            <div>
                <label>Avatar Alt Text (optional):</label>
                <input type="text" {...register("avatar.alt")} />
            </div>

            <div>
                <label>Banner URL (optional):</label>
                <input type="url" {...register("banner.url")} />
            </div>

            <div>
                <label>Banner Alt Text (optional):</label>
                <input type="text" {...register("banner.alt")} />
            </div>

            <div>
                <label>
                    <input type="checkbox" {...register("venueManager")} />
                    Venue Manager
                </label>
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
            </button>
        </form>
    );
}
