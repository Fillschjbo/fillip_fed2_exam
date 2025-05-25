export function Footer() {
    return(
        <footer className="mt-[4rem] bg-[#543786] p-[4rem] flex justify-between">
            <ul className=" flex flex-col text-[#FDFDFD] font-primary text-[1rem] gap-[1rem]">
                <li>Contact Us</li>
                <li>About Us</li>
                <li>&#169; Fillip Schjølberg Husebø 2025</li>
            </ul>
            <ul className=" flex flex-col text-[#FDFDFD] font-primary text-[1rem] gap-[1rem]">
                <li>Legal Policies</li>
                <li>Terms of Service</li>
                <li>Pricacy Policy</li>
            </ul>
            <ul className=" flex flex-col text-[#FDFDFD] font-primary text-[1rem] gap-[1rem]">
                <li>Follow us on:</li>
                <li>Instagram</li>
                <li>Facebook</li>
            </ul>
        </footer>
    )
}