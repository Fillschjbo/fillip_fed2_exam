import {useAuth} from "../../hooks/api/useAuth.jsx";
import {useForm} from "react-hook-form";

export function Login() {
    const { login, loading, error } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data) => {
        try {
            await login(data);
            alert("Login successful!");
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error.message}</p>}

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

            <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>
        </form>
    );
}