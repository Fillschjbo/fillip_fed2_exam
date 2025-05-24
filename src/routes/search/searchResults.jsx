import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Filter } from "../../components/UI/Filter.jsx";
import { useSearch } from "../../hooks/api/useSearch.jsx";
import { API_VENUE } from "../../utilities/constants.js";
import {useState, useCallback, useEffect} from "react";
import {SearchResultCard} from "../../components/Cards/SearchResultCard.jsx";

function VenueList({ apiUrl, localFilterFunction }) {
    const { data: venues, loading, error } = useSearch(apiUrl);

    const displayedVenues = localFilterFunction ? localFilterFunction(venues) : (venues || []);

    if (loading) {
        return <div className="text-center p-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">Error: {error}</div>;
    }

    if (displayedVenues.length === 0) {
        return (
            <div className="text-center p-4">
                No venues found matching your criteria.
            </div>
        );
    }

    return (
        <div className="w-[90vw] lg:w-[70vw] p-5 mx-auto flex flex-col gap-[20px]">
            {displayedVenues.map((venue) => (
                <Link to={`/venue/${venue.id}`} key={venue.id}>
                    <SearchResultCard
                        city={venue.location?.city || "Unknown City"}
                        country={venue.location?.country || "Unknown Country"}
                        name={venue.name}
                        price={venue.price}
                        image={venue.media?.[0]?.url}
                    />
                </Link>

            ))}
        </div>
    );
}

export function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const baseUrl = query
        ? `${API_VENUE}/search?q=${encodeURIComponent(query)}&_bookings=true`
        : `${API_VENUE}`;
    const [apiUrl, setApiUrl] = useState(`${baseUrl}?limit=24&sort=created&sortOrder=asc`);
    const [localFilterFunction, setLocalFilterFunction] = useState(null);

    const handleUrlChange = useCallback((newUrl) => {
        setApiUrl(newUrl);
    }, []);

    const handleFiltersChange = useCallback((filters, filterFunction) => {
        setLocalFilterFunction(() => filterFunction);
    }, []);

    useEffect(() => {
        document.title = `Search Results for: ${query}`;
    }, [query]);

    return (
        <div className="max-w-6xl mx-auto p-4">
            <title>Search Results for: {query}</title>
            <h1 className="text-2xl font-bold mb-4">Search Results</h1>
            <Filter
                baseUrl={baseUrl}
                onUrlChange={handleUrlChange}
                onFiltersChange={handleFiltersChange}
            />
            <VenueList apiUrl={apiUrl} localFilterFunction={localFilterFunction} />
            <Link to="/" className="mt-6 inline-block text-blue-500 hover:underline">
                Back to Search
            </Link>
        </div>
    );
}