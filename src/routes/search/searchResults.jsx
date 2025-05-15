import { useSearch } from "../../hooks/api/useSearch.jsx";
import { Link } from "react-router-dom";
import {Filter} from "../../components/UI/Filter.jsx";
import {useState} from "react";

export function SearchResults() {
    const { data: venues, loading, error } = useSearch();
    const [filters ,setFilters] = useState({
        guests: null,
        priceSort: "",
        ratingSort: "",
        amenities: {wifi:false, parking:false, breakfast:false, pets:false}
    });

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    let filteredVenues = venues ? [...venues] : [];

    if (filters.guests){
        filteredVenues = filteredVenues.filter(
            (venue) => venue.maxGuests >= filters.guests
        )
    }

    const activeAmenities = Object.keys(filters.amenities).filter(
        (key) => filters.amenities[key]
    );
    if (activeAmenities.length > 0) {
        filteredVenues = filteredVenues.filter((venue) =>
            activeAmenities.every((amenity) => venue.meta[amenity])
        );
    }

    if (filters.priceSort) {
        filteredVenues.sort((a, b) =>
            filters.priceSort === "highToLow"
                ? b.price - a.price
                : a.price - b.price
        );
    }

    if (filters.ratingSort) {
        filteredVenues.sort((a, b) =>
            filters.ratingSort === "highToLow"
                ? b.rating - a.rating
                : a.rating - b.rating
        );
    }

    if (loading) {
        return <div className="text-center p-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">Error: {error}</div>;
    }

    if (!venues || venues.length === 0) {
        return (
            <div className="text-center p-4">
                No venues found matching your criteria.
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Search Results</h1>
            <Filter onFilterChange={handleFilterChange} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVenues.map((venue) => (
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
            <Link to="/" className="mt-6 inline-block text-blue-500 hover:underline">
                Back to Search
            </Link>
        </div>
    );
}