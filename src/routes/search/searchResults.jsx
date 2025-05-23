import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Filter } from "../../components/UI/Filter.jsx";
import { useSearch } from "../../hooks/api/useSearch.jsx";
import { API_VENUE } from "../../utilities/constants.js";
import { useState, useCallback } from "react";

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedVenues.map((venue) => (
                <div
                    key={venue.id}
                    className="border rounded-lg overflow-hidden shadow-md"
                >
                    {venue.media && venue.media.length > 0 && (
                        <img
                            src={venue.media[0].url}
                            alt={venue.media[0].alt || venue.name}
                            className="w-full h-48 object-cover"
                        />
                    )}
                    <div className="p-4">
                        <h2 className="text-xl font-semibold">{venue.name}</h2>
                        <p className="text-gray-600 mt-2">{venue.description}</p>
                        <p className="text-gray-800 font-medium mt-2">Price: ${venue.price}</p>
                        <p className="text-gray-600 mt-1">
                            Location: {venue.location.city}, {venue.location.country}
                        </p>
                        <Link
                            to={`/venue/${venue.id}`}
                            className="mt-4 inline-block bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                            View Details
                        </Link>
                    </div>
                </div>
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

    return (
        <div className="max-w-6xl mx-auto p-4">
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