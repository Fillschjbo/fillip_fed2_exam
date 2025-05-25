import { useForm } from "react-hook-form";
import {useAuth} from "../../hooks/api/useAuth.jsx";
import logo from "/src/assets/logo/holidaze.svg"
import {Link} from "react-router-dom";
import {toast} from "react-hot-toast";

export function Register() {
    const { register: authRegister, loading, error } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            bio: "",
            avatar: { url: "", alt: "" },
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
                        alt: "Profile avatar",
                    },
                }),
                ...(data.venueManager && { venueManager: data.venueManager }),
            };
            await authRegister(payload);
            window.location.href = "/login"
            toast.success("Registration successful!");
        } catch (err) {
            toast.error("Registration failed:", err);
        }
    };

    return (
        <div className={"flex h-screen"}>
            <title>Holidaze | Register</title>
            <div className={"hidden md:flex flex-col justify-between h-full py-[10vh] px-[5%] w-[40%] bg-[#EBE7FE] absolute top-0"}>
                <img src={logo} alt="logo" className={"size-50"}/>
                <h2 className={"text-[24px] font-sans font-bold tracking-wide w-[321px]"}>Start your vacation with Holidaze</h2>
            </div>

            <div className={"w-screen md:w-[30%] mx-auto  p-5 md:p-0 flex-col flex md:absolute md:right-[10vw] h-full items-center justify-center"}>
                <form onSubmit={handleSubmit(onSubmit)} className={"flex flex-col w-full justify-center gap-10"}>

                    <h2 className={"w-[90vw] md:w-[25vw] flex justify-center font-sans tracking-wide font-bold text-[24px]"}>Register</h2>
                    {error && <p style={{ color: "red" }}>{error.message}</p>}

                    <div>
                        <input
                            type="text"
                            {...register("name", { required: "Name is required" })}
                            placeholder={"Username"}
                            className={"border-gray-300 border rounded-[20px] h-[67px] pl-2 w-[90vw] md:w-[25vw]"}
                        />
                        {errors.name && <p>{errors.name.message}</p>}
                    </div>

                    <div>
                        <input
                            type="email"
                            placeholder={"Email"}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/,
                                    message: "Email must be a valid @stud.noroff.no address",
                                },
                            })}
                            className={"border-gray-300 border rounded-[20px] h-[67px] pl-2 w-[90vw] md:w-[25vw]"}
                        />
                        {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
                    </div>

                    <div>
                        <textarea placeholder={"Bio"} {...register("bio")}
                                  className={"border-gray-300 border rounded-[20px] h-[67px] pl-2 w-[90vw] md:w-[25vw] pt-5"}
                        />
                    </div>

                    <div>
                        <input type="url" placeholder={"Avatar URL"} {...register("avatar.url")}
                               className={"border-gray-300 border rounded-[20px] h-[67px] pl-2 w-[90vw] md:w-[25vw]"}
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder={"Password"}
                            {...register("password", {
                                required: "Password is required",
                                minLength: { value: 8, message: "Password must be at least 8 characters" },
                            })}
                            className={"border-gray-300 border rounded-[20px] h-[67px] pl-2 w-[90vw] md:w-[25vw]"}
                        />
                        {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
                    </div>

                    <div>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                {...register("venueManager")}
                                className="sr-only peer"
                            />
                            <div className="w-5 h-5 border-2 border-[#B7ADF8] bg-[#DDD9FC] rounded flex items-center justify-center mr-2 peer-checked:bg-purple-600 peer-checked:border-purple-600">
                                <svg className="w-3 h-3 text-white hidden peer-checked:block" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            Venue Manager
                        </label>
                    </div>


                    <button type="submit" disabled={loading}
                        className={"bg-[#543786] text-[24px] font-bold tracking-wide text-white py-[24px] rounded-[20px] w-[90vw] md:w-[25vw] hover:cursor-pointer"}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>

                    <p className={"text-[#75738D] text-[16px] font-sans"}>Already have an account? <Link to={`/login`} className={"text-[#543786] text-[16px] font-sans underline"}>Login here</Link> </p>
                </form>
            </div>
        </div>
    );
}
