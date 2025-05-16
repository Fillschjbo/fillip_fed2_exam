import {Link} from "react-router-dom";
import {useRef} from "react";
import {LuPanelRightClose} from "react-icons/lu";

export function UserDropdown({isOpen, onClose, name, avatar, userIsLoggedIn}){
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    if (!isOpen) return null;

    return (
        <div className={"fixed top-0 right-0 w-4/5 h-screen bg-[#EBE7FE] z-20 md:absolute md:top-16 md:right-4 md:w-48 md:h-auto md:shadow-lg md:py-2"}
             onClick={(e) => e.stopPropagation()}
        >
            {userIsLoggedIn ? (
                <>
                    <LuPanelRightClose
                    className={"absolute top-10 right-8 size-8 md:hidden"}
                    onClick={onClose}
                    />
                    <h2 className={"text-3xl w-full text-center pt-12 md:hidden"}>Logged in as:</h2>
                    <div className={"flex items-center w-full justify-center gap-4 md:hidden"}>
                        <p className={"font-serif text-[45px] pt-[15px] md:truncate sm:truncate ml-4"}>{name}</p>
                        <img src={avatar} alt="profile image" className={"size-12 rounded-full"}/>
                    </div>
                    <Link
                        to={`/profile/${name || "user"}`}
                        className="block w-full text-center py-4 text-gray-800 hover:bg-[#F0EEFB] md:text-left md:py-2 md:px-4"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                    >
                        Profile
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="block w-full text-center py-4 text-gray-800 hover:bg-[#F0EEFB] md:text-left md:py-2 md:px-4"
                    >
                        Logout
                    </button>
                </>
            ) : (
                <Link
                    to="/login"
                    className="block w-full text-center py-4 text-gray-800 hover:bg-[#F0EEFB] md:text-left md:py-2 md:px-4"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                >
                    Login
                </Link>
            )}
        </div>
    )
}