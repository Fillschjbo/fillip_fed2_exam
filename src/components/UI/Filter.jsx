import {useState} from "react";

export function Filter ({onFilterChange}){
    const [guests, setGuests] = useState("");
    const [priceSort, setPriceSort] = useState("");
    const [ratingSort, setRatingSort] = useState("");
    const [amenities, setAmenities] = useState({
        wifi: false,
        parking: false,
        breakfast: false,
        pets: false
    });

    const handleGuestsChange = (e) => {
        const value = e.target.value;
        setGuests(value);
        onFilterChange({guests: value ? parseInt(value) : null, priceSort, ratingSort, amenities})
    }

    const handlePriceSortChange = (e) => {
        const value = e.target.value;
        setPriceSort(value);
        onFilterChange({guests, priceSort: value, ratingSort, amenities})
    };

        const handleRatingSortChange = (e) => {
            const value = e.target.value;
            setRatingSort(value);
            onFilterChange({guests, priceSort, ratingSort: value, amenities});
        };

        const handleAmenityChange = (e) => {
            const {name, checked} = e.target;
            const newAmenities = {...amenities, [name]: checked}
            setAmenities(newAmenities);
            onFilterChange({guests, priceSort, ratingSort, amenities: newAmenities});
        };

        return(
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h2 className="text-lg font-semibold mb-4">Filter Venues</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
                            Number of Guests
                        </label>
                        <select
                            id="guests"
                            value={guests}
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
                            value={priceSort}
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
                            value={ratingSort}
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
                            {["wifi", "parking", "breakfast", "pets"].map((amenity) => (
                                <div key={amenity} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={amenity}
                                        name={amenity}
                                        checked={amenities[amenity]}
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
        )
}