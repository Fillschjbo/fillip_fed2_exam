import holidaze from "../../assets/logo/holidaze.svg"
import {useEffect, useState} from "react";
import {UserDropdown} from "../UI/UserDropdown.jsx";
import { LuMenu } from "react-icons/lu";

export function Header() {
    const userIsLoggedIn = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const openDropdown = (e) => {
        e.stopPropagation();
        setIsDropdownOpen(true);
    };

    useEffect(() => {
        const handleGlobalClick = () => {
            if (isDropdownOpen) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener("click", handleGlobalClick);
        }

        return () => {
            document.removeEventListener("click", handleGlobalClick);
        };
    }, [isDropdownOpen]);

    return(
        <div className={"w-screen h-[80px] flex items-center px-[8vw] z-30 sticky top-0"}>
            <div className={"w-full flex justify-between items-center"}>
                <div></div>
                <div className={"flex h-full font-serif md:text-[45px] text-3xl gap-[64px] items-center pl-[10vw]"}>
                    <a href="/" className={"pt-[15px]"}>Featured</a>
                    <a href="/" ><img src={holidaze} alt="holidaze logo" className={"h-[56px] min-w-[100px] max-w-[200px] w-[10vw]"}/></a>
                    <a href="/venues" className={"pt-[15px]"}>Venues</a>
                </div>

                {/* Desktop */}
                <div className="items-center md:flex hidden relative">
                    {userIsLoggedIn ? (
                        <div className="flex items-center gap-8" onClick={openDropdown}>
                            <p className="font-serif text-[45px] pt-[15px] md:truncate sm:truncate ml-4">
                                {user.name || "User"}
                            </p>
                            <img
                                src={user.avatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                                alt={`${user.name || "User"}'s profile image`}
                                className="size-12 rounded-full object-cover"
                            />
                        </div>
                    ) : (
                        <a href="/login" className="font-serif text-[40px] pt-[15px]">Login</a>
                    )}
                </div>

                {/* Mobile */}
                <div className="ml-10 md:hidden">
                    <LuMenu className="flex items-center h-full pt-[15px] size-10" onClick={openDropdown} />
                </div>

                <UserDropdown
                    isOpen={isDropdownOpen}
                    onClose={() => setIsDropdownOpen(false)}
                    name={user.name}
                    avatar={user.avatar || "https://via.placeholder.com/48"}
                    userIsLoggedIn={userIsLoggedIn}
                />
            </div>
        </div>
    )
}