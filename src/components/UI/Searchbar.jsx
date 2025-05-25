import {useState} from "react";
import {useNavigate} from "react-router-dom";
import DatePicker from "react-datepicker";

export function Searchbar(){
    const [query, setQuery] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!startDate || !endDate){
            setError("Please select a start date and end date.")
        }

        if (endDate <= startDate) {
            setError("End date must be after start date")
        }

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        const startDateStr = formatDate(startDate)
        const endDateStr = formatDate(endDate)

        navigate(`/results?q=${encodeURIComponent(query)}&start=${startDateStr || ""}&end=${endDateStr || ""}`);
    }

    return(
        <div className={"relative z-10 w-full max-w-4xl mx-auto px-4"}>
            <form onSubmit={handleSubmit} className={"flex flex-col md:flex-row bg-[#F0EEFB] p-4 md:px-8 md:py-6 rounded-2xl md:rounded-full border border-gray-400 w-full gap-4 md:gap-2 items-stretch md:items-center"}>

                <div className={"flex-1 min-w-0"}>
                    <label htmlFor="query" className={"sr-only"}>Search location</label>
                    <input
                        type="text"
                        id="query"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={"Search location"}
                        className={"w-full px-3 py-2 bg-transparent border-0 outline-none placeholder-gray-500 text-sm md:text-base"}
                    />
                </div>

                <div className={"hidden md:block w-px h-6 bg-gray-300"}></div>

                <div className={"flex-1 min-w-0"}>
                    <label htmlFor="startDate" className={"sr-only"}>Start date</label>
                    <DatePicker
                        id="startDate"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat={"yyyy-MM-dd"}
                        placeholderText={"Check-in"}
                        autoComplete="off"
                        required
                        className={"w-full px-3 py-2 bg-transparent border-0 outline-none placeholder-gray-500 text-sm md:text-base"}
                        wrapperClassName={"w-full"}
                    />
                </div>

                <div className={"hidden md:block w-px h-6 bg-gray-300"}></div>

                <div className={"flex-1 min-w-0"}>
                    <label htmlFor="endDate" className={"sr-only"}>End date</label>
                    <DatePicker
                        id="endDate"
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat={"yyyy-MM-dd"}
                        placeholderText={"Check-out"}
                        autoComplete="off"
                        required
                        className={"w-full px-3 py-2 bg-transparent border-0 outline-none placeholder-gray-500 text-sm md:text-base"}
                        wrapperClassName={"w-full"}
                    />
                </div>

                <div className={"flex-shrink-0"}>
                    <button
                        type={"submit"}
                        className={"w-full md:w-auto bg-[#543786] hover:bg-[#9D88C1] text-white px-6 py-3 md:px-8 md:py-2 rounded-full transition-colors duration-200 font-medium text-sm md:text-base hover:cursor-pointer"}
                    >
                        Search
                    </button>
                </div>

                {error && (
                    <div className={"w-full md:absolute md:top-full md:left-0 md:mt-2"}>
                        <p className={"text-red-500 text-sm bg-white px-4 py-2 rounded-lg border border-red-200"}>
                            {error}
                        </p>
                    </div>
                )}
            </form>
        </div>
    )
}