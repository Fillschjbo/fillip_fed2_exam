import { useState, useMemo, useCallback } from "react";

export function useFilter(initialFilters = {
    guests: '',
    priceSort: '',
    ratingSort: '',
    amenities: {
        wifi: false,
        parking: false,
        breakfast: false,
        pets: false,
    },
}) {
    const [filters, setFilters] = useState(() => initialFilters);

    const computeApiUrl = (baseUrl) => {
        const url = new URL(baseUrl, window.location.origin);

        const existingParams = new URLSearchParams(url.search);

        const newParams = new URLSearchParams();

        newParams.set("limit", "24");
        newParams.set("sort", "created");
        newParams.set("sortOrder", "asc");

        if (filters.priceSort) {
            newParams.set("sort", "price");
            newParams.set("sortOrder", filters.priceSort === "highToLow" ? "desc" : "asc");
        }

        if (filters.ratingSort && !filters.priceSort) {
            newParams.set("sort", "rating");
            newParams.set("sortOrder", filters.ratingSort === "highToLow" ? "desc" : "asc");
        }

        // Merge existing and new parameters
        for (const [key, value] of newParams.entries()) {
            existingParams.set(key, value);
        }

        // Update the URL with the merged query string
        url.search = existingParams.toString();

        return url.toString();
    };

    const getApiUrl = (baseUrl) => useMemo(() => computeApiUrl(baseUrl), [baseUrl, filters.priceSort, filters.ratingSort]);

    const filterVenuesLocally = useCallback((venues) => {
        if (!venues || !Array.isArray(venues)) return [];

        let filteredVenues = [...venues];

        if (filters.guests && filters.guests !== "" && !isNaN(parseInt(filters.guests))) {
            const guestCount = parseInt(filters.guests);
            filteredVenues = filteredVenues.filter((venue) => {
                const maxGuests = venue.maxGuests !== undefined ? parseInt(venue.maxGuests) : 0;
                return !isNaN(maxGuests) && maxGuests >= guestCount;
            });
        }

        const activeAmenities = Object.keys(filters.amenities || {})
            .filter((key) => filters.amenities[key]);

        if (activeAmenities.length > 0) {
            filteredVenues = filteredVenues.filter((venue) => {
                const hasMeta = venue.meta && typeof venue.meta === "object" && venue.meta !== null;
                return hasMeta && activeAmenities.every((amenity) => venue.meta[amenity] === true);
            });
        }

        return filteredVenues;
    }, [filters.guests, filters.amenities]);

    return {filters, setFilters, getApiUrl, filterVenuesLocally};
}