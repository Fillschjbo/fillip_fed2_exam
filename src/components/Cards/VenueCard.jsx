import {LuCircleParking, LuCircleParkingOff, LuWifi, LuWifiOff} from "react-icons/lu";
import {TbBread, TbBreadOff, TbPaw, TbPawOff} from "react-icons/tb";

export function VenueCard ({title, image, rating, city, country, wifi, parking, breakfast, pets, price}){
    return(
        <div className={"overflow-clip relative flex flex-col gap-3 hover:cursor-pointer group"}>
            <div className={"w-full h-[216px] rounded-[20px] overflow-hidden"}>
                <img src={image || "https://bokstartfredrikstad.no/wp-content/themes/vio/assets/images/no-image/No-Image-Found-400x264.png"} alt="venue image"
                     className={"min-w-full min-h-[216px] object-cover transition-transform duration-300 group-hover:scale-105"}
                />
            </div>
            <p className={"absolute right-3 top-3 bg-[#EBE7FE] px-5 py-1 rounded-lg font-sans"}>{rating}</p>
            <p className={"text-xs truncate"}>{city}, {country}</p>
            <h2 className={"font-sans font-bold text-lg truncate"}>{title}</h2>
            <div>
                <ul className={"flex gap-3"}>
                    <li>
                        {wifi ? (
                            <LuWifi />
                        ):(
                            <LuWifiOff />
                        )}
                    </li>
                    <li>
                        {parking ? (
                            <LuCircleParking />
                        ):(
                            <LuCircleParkingOff />
                        )}
                    </li>
                    <li>
                        {breakfast ? (
                            <TbBread />
                        ):(
                            <TbBreadOff />
                        )}
                    </li>
                    <li>
                        {pets ?(
                            <TbPaw />
                        ):(
                            <TbPawOff />
                        )}
                    </li>
                </ul>
            </div>
            <p className={"font-semibold text-sans"}>{price} NOK Per Night</p>
        </div>
    )
}