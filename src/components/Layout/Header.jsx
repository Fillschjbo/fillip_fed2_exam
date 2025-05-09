import holidaze from "../../assets/logo/holidaze.svg"

export function Header() {
    return(
        <div className={"w-screen h-[80px] flex justify-end items center pr-[8vw] z-10"}>
            <div className={"w-[55vw] flex justify-between items-center"}>
                <div className={"flex h-full font-serif text-[45px] gap-[64px] items-center"}>
                    <a href="/" className={"pt-[15px]"}>Featured</a>
                    <a href="/"><img src={holidaze} alt="holidaze logo" className={"h-[56px] w-[157px]"}/></a>
                    <a href="/venues" className={"pt-[15px]"}>Venues</a>
                </div>
                <div className={"flex items-center"}>
                    <a href="/login" className={"font-serif text-[45px] pt-[15px]"}>Login</a>
                </div>
            </div>
        </div>
    )
}