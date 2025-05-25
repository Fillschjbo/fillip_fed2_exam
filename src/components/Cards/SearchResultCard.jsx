import {TbHeart} from "react-icons/tb";

export function SearchResultCard({city, country, name, price, image}) {

    return(
        <div className={"flex gap-[9vw] relative hover:cursor-pointer group h-fit"}>
            <div className={"rounded-[20px] overflow-hidden w-[29vw] h-[74px] md:h-[272px]"}>
                <img src={image} alt="Venue Image" className={"w-[29vw] h-[74px] md:h-[272px] object-cover transition-transform duration-300 group-hover:scale-105"}/>
            </div>
            <div className={"flex flex-col gap-3 md:gap-[24px] w-[50vw] h-full justify-center"}>
                <p className={"text-[8px] font-sans tracking-wide md:text-[16px]"}>{city}, {country}</p>
                <h2 className={"text-[12px] sm:text-[20px] font-bold font-sans tracking-wide md:text-[36px]"}>{name}</h2>
                <p className={"text-[8px] sm:text-[16px] font-semibold font-sans tracking-wide md:text-[26px]"}>{price}kr Per Night</p>
            </div>
                <div>
                    <TbHeart className={"size-4 md:size-8 absolute right-4 top-4"}/>
                </div>
        </div>
    )
}