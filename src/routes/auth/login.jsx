import {useAuth} from "../../hooks/api/useAuth.jsx";
import {useForm} from "react-hook-form";
import logo from "../../assets/logo/holidaze.svg";
import {Link} from "react-router-dom";
import {toast} from "react-hot-toast";

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
            toast.success("Login successful!");
            window.location.href = "/"
        } catch (err) {
            toast.error("Login failed:", err);
        }
    };

    return (
        <div className={"flex h-screen"}>
            <title>Holidaze | Login</title>
            <div className={"hidden md:flex flex-col justify-between h-full py-[10vh] px-[5%] w-[40%] bg-[#EBE7FE] absolute top-0"}>
                <img src={logo} alt="logo" className={"size-50"}/>
                <h2 className={"text-[24px] font-sans font-bold tracking-wide w-[321px]"}>Start your vacation with Holidaze</h2>
            </div>

            <div className={"w-screen md:w-[30%] mx-auto  p-5 md:p-0 flex-col flex md:absolute md:right-[10vw] h-full items-center justify-center"}>
                <form onSubmit={handleSubmit(onSubmit)} className={"flex flex-col w-full justify-center gap-10"}>

                    <h2 className={"w-[90vw] md:w-[25vw] flex justify-center font-sans tracking-wide font-bold text-[24px]"}>Login</h2>
                    {error && <p style={{ color: "red" }}>{error.message}</p>}

                    <div>
                        <input
                            type="email"
                            placeholder={"Email"}
                            className={"border-gray-300 border rounded-[20px] h-[67px] pl-2 w-[90vw] md:w-[25vw]"}
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
                        <input
                            type="password"
                            placeholder={"Password"}
                            className={"border-gray-300 border rounded-[20px] h-[67px] pl-2 w-[90vw] md:w-[25vw]"}
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 8, message: "Password must be at least 8 characters" },
                            })}
                        />
                        {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
                    </div>

                    <button type="submit" disabled={loading}
                            className={"bg-[#543786] text-[24px] font-bold tracking-wide text-white py-[24px] rounded-[20px] w-[90vw] md:w-[25vw] hover:cursor-pointer"}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    <p className={"text-[#75738D] text-[16px] font-sans"}>Don´t have an account? <Link to={`/register`} className={"text-[#543786] text-[16px] font-sans underline"}>Register here</Link> </p>
                </form>
            </div>
        </div>
    );

}