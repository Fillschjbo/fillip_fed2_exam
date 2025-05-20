import {usePost} from "../../hooks/api/usePost.jsx";
import {useFieldArray, useForm} from "react-hook-form";
import {API_VENUE} from "../../utilities/constants.js";

export function CreateVenue() {
    const {post, loading, error: postError, data} = usePost();
    const {register, handleSubmit, control, formState:{errors}} = useForm({
        defaultValues: {
            name: "",
            description: "",
            media: [{ url: "", alt: "" }],
            price: 0,
            maxGuests: 0,
            rating: 0,
            meta: {
                wifi: false,
                parking: false,
                breakfast: false,
                pets: false,
            },
            location: {
                address: "",
                city: "",
                zip: "",
                country: "",
                continent: "",
            },
        },
    });

    const {fields, append, remove} = useFieldArray({
        control,
        name: "media",
    })

    const onSubmit = async (data) => {
        await post(`${API_VENUE}`, data)
    }

    return(
        <div className="max-w-lg mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Create a New Venue</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Name *</label>
                    <input
                        {...register("name", { required: "Name is required" })}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Venue name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description *</label>
                    <textarea
                        {...register("description", { required: "Description is required" })}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Venue description"
                        rows="4"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Media</label>
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex space-x-2 mb-2">
                            <input
                                {...register(`media.${index}.url`)}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Image URL"
                            />
                            <input
                                {...register(`media.${index}.alt`)}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Alt text"
                            />
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => append({ url: "", alt: "" })}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Add Media
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <input
                        type="number"
                        {...register("price", { valueAsNumber: true, min: 0 })}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Price"
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">Price must be a non-negative number</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Max Guests</label>
                    <input
                        type="number"
                        {...register("maxGuests", { valueAsNumber: true, min: 0 })}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Max guests"
                    />
                    {errors.maxGuests && <p className="text-red-500 text-sm mt-1">Max guests must be a non-negative number</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Rating</label>
                    <input
                        type="number"
                        {...register("rating", { valueAsNumber: true, min: 0, max: 5 })}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Rating (0-5)"
                    />
                    {errors.rating && <p className="text-red-500 text-sm mt-1">Rating must be between 0 and 5</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Amenities</label>
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input type="checkbox" {...register("meta.wifi")} className="mr-2" />
                            WiFi
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" {...register("meta.parking")} className="mr-2" />
                            Parking
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" {...register("meta.breakfast")} className="mr-2" />
                            Breakfast
                        </label>
                        <label className="flex items-center">
                            <input type="checkbox" {...register("meta.pets")} className="mr-2" />
                            Pets Allowed
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <div className="space-y-2">
                        <input
                            {...register("location.address")}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Address"
                        />
                        <input
                            {...register("location.city")}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="City"
                        />
                        <input
                            {...register("location.zip")}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Zip Code"
                        />
                        <input
                            {...register("location.country")}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Country"
                        />
                        <input
                            {...register("location.continent")}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Continent"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {loading ? "Creating..." : "Create Venue"}
                </button>

                {postError && <p className="text-red-500">{postError.message}</p>}
                {data && <p className="text-green-500">Venue created successfully!</p>}
            </form>
        </div>
    )
}