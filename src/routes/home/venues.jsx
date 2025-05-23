import React, { useState, useCallback } from 'react';
import { VenueCard } from '../../components/Cards/VenueCard.jsx';
import { Link } from 'react-router-dom';
import { useFetch } from '../../hooks/api/useFetch.jsx';
import { API_VENUE } from '../../utilities/constants.js';
import { Searchbar } from '../../components/UI/Searchbar.jsx';
import { Filter } from '../../components/UI/Filter.jsx';

function VenueList({ apiUrl, localFilterFunction }) {
    const { data, loading, error } = useFetch(apiUrl, false);
    const venues = data || [];

    const filteredVenues = localFilterFunction ? localFilterFunction(venues) : venues;

    if (loading) return <div className="text-center text-gray-600">Loading venues...</div>;
    if (error) return <div className="text-center text-red-500">Error loading venues: {error.message}</div>;
    if (filteredVenues.length === 0) return <div className="text-center text-gray-600">No venues found matching your criteria.</div>;

    return (
        <div className="flex flex-wrap lg:justify-between justify-center gap-4">
            <title>Holidaze || Venues</title>
            {filteredVenues.map((venue) => (
                <div key={venue.id} className="w-[310px]">
                    <Link to={`/venue/${venue.id}`}>
                        <VenueCard
                            title={venue.name}
                            image={venue.media?.[0]?.url}
                            city={venue.location?.city || 'Unknown City'}
                            country={venue.location?.country || 'Unknown Country'}
                            price={venue.price || 0}
                            wifi={venue.meta?.wifi || false}
                            parking={venue.meta?.parking || false}
                            breakfast={venue.meta?.breakfast || false}
                            pets={venue.meta?.pets || false}
                            rating={venue.rating || 0}
                        />
                    </Link>
                </div>
            ))}
        </div>
    );
}

export function Venues() {
    const baseUrl = `${API_VENUE}`;
    const [apiUrl, setApiUrl] = useState(`${baseUrl}?limit=24&sort=created&sortOrder=asc`);
    const [localFilterFunction, setLocalFilterFunction] = useState(null);

    const handleUrlChange = useCallback((newUrl) => {
        setApiUrl(newUrl);
    }, []);

    const handleFiltersChange = useCallback((filters, filterFunction) => {
        setLocalFilterFunction(() => filterFunction);
    }, []);

    return (
        <div className="w-[70vw] mx-auto p-5 flex flex-col gap-10 justify-center">
            <div className="w-full flex justify-center">
                <Searchbar />
            </div>
            <Filter
                baseUrl={baseUrl}
                onUrlChange={handleUrlChange}
                onFiltersChange={handleFiltersChange}
            />
            <VenueList apiUrl={apiUrl} localFilterFunction={localFilterFunction} />
        </div>
    );
}
