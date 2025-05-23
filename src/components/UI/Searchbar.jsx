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
        <div className={"relative z-10 w-fit"}>
            <form onSubmit={handleSubmit} className={"flex bg-[#F0EEFB] px-8 py-8 rounded-full border border-gray-400"}>
                <div>
                    <label htmlFor="query"></label>
                    <input type="text" id={query} value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={"Search location"}
                    />
                </div>

                <div>
                    <label htmlFor="startDate"></label>
                    <DatePicker
                        id="startDate"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat={"yyyy-MM-dd"}
                        placeholderText={"Select start date"}
                        autoComplete="off"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="endDate"></label>
                    <DatePicker
                        id="startDate"
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat={"yyyy-MM-dd"}
                        placeholderText={"Select end date"}
                        autoComplete="off"
                        required
                    />
                </div>
                {error && <p className={"text-red-500 text-sm"}>{error}</p>}

                <button type={"submit"} className={"hover:cursor-pointer text-[#543786]"}>Search</button>
            </form>
        </div>
    )
}