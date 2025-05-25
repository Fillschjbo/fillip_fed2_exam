import { useEffect, useRef } from 'react';
import { useFilter } from '../../hooks/api/useFilter.jsx';

export function Filter({ baseUrl, onUrlChange, onFiltersChange }) {
    const { filters, setFilters, getApiUrl, filterVenuesLocally } = useFilter();
    const apiUrl = getApiUrl(baseUrl);
    const prevApiUrlRef = useRef(apiUrl);
    const prevFiltersRef = useRef(filters);

    useEffect(() => {
        if (prevApiUrlRef.current !== apiUrl) {
            onUrlChange(apiUrl);
            prevApiUrlRef.current = apiUrl;
        }
    }, [apiUrl, onUrlChange]);

    useEffect(() => {
        const filtersChanged = JSON.stringify(prevFiltersRef.current) !== JSON.stringify(filters);
        if (onFiltersChange && filtersChanged) {
            onFiltersChange(filters, filterVenuesLocally);
            prevFiltersRef.current = filters;
        }
    }, [filters, onFiltersChange, filterVenuesLocally]);

    const handleGuestsChange = (e) => {
        const value = e.target.value;
        setFilters((prev) => ({ ...prev, guests: value }));
    };

    const handlePriceSortChange = (e) => {
        const value = e.target.value;
        setFilters((prev) => ({ ...prev, priceSort: value }));
    };

    const handleRatingSortChange = (e) => {
        const value = e.target.value;
        setFilters((prev) => ({ ...prev, ratingSort: value }));
    };

    const handleAmenityChange = (e) => {
        const { name, checked } = e.target;
        setFilters((prev) => ({
            ...prev,
            amenities: { ...prev.amenities, [name]: checked },
        }));
    };

    return (
        <div className="bg-white p-6 shadow-md mb-6 rounded-[20px]">
            <h2 className="text-lg font-semibold mb-4">Filter Venues</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
                        Number of Guests
                    </label>
                    <select
                        id="guests"
                        value={filters.guests || ''}
                        onChange={handleGuestsChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Any</option>
                        {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="priceSort" className="block text-sm font-medium text-gray-700">
                        Price
                    </label>
                    <select
                        id="priceSort"
                        value={filters.priceSort}
                        onChange={handlePriceSortChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Default</option>
                        <option value="highToLow">High to Low</option>
                        <option value="lowToHigh">Low to High</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="ratingSort" className="block text-sm font-medium text-gray-700">
                        Rating
                    </label>
                    <select
                        id="ratingSort"
                        value={filters.ratingSort}
                        onChange={handleRatingSortChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Default</option>
                        <option value="highToLow">High to Low</option>
                        <option value="lowToHigh">Low to High</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Amenities</label>
                    <div className="mt-2 space-y-2">
                        {['wifi', 'parking', 'breakfast', 'pets'].map((amenity) => (
                            <div key={amenity} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={amenity}
                                    name={amenity}
                                    checked={filters.amenities[amenity]}
                                    onChange={handleAmenityChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                                <label htmlFor={amenity} className="ml-2 text-sm text-gray-600 capitalize">
                                    {amenity}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}