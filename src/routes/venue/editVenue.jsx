import {useParams} from "react-router-dom";
import {useFetch} from "../../hooks/api/useFetch.jsx";
import {API_VENUE} from "../../utilities/constants.js";
import {useEdit} from "../../hooks/api/useEdit.jsx";
import {useFieldArray, useForm} from "react-hook-form";
import {useEffect} from "react";
import {LiaPlusSolid, LiaTrashAltSolid} from "react-icons/lia";

export function EditVenue() {
    const { id } = useParams();
    const { data: venue, loading:fetchLoading, error: fetchError } = useFetch(`${API_VENUE}/${id}`);
    const { edit, loading: editLoading, error: editError, data: editData } = useEdit();
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        defaultValues: {
            name: "",
            description: "",
            media: [{url: "", alt: ""}],
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
                lat: 0,
                lng: 0,
            },
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "media",
    });

    useEffect(() => {
        if (venue){
            reset({
                name: venue.name || "",
                description: venue.description || "",
                media: venue.media?.length > 0 ? venue.media : [{ url: "", alt: "" }],
                price: venue.price || 0,
                maxGuests: venue.maxGuests || 0,
                rating: venue.rating || 0,
                meta: {
                    wifi: venue.meta?.wifi || false,
                    parking: venue.meta?.parking || false,
                    breakfast: venue.meta?.breakfast || false,
                    pets: venue.meta?.pets || false,
                },
                location: {
                    address: venue.location?.address || "",
                    city: venue.location?.city || "",
                    zip: venue.location?.zip || "",
                    country: venue.location?.country || "",
                    continent: venue.location?.continent || "",
                },
            })
        }
    }, [venue, reset]);

    const onSubmit = async (data) => {
        const filteredData = {
            ...data,
            media: data.media.filter(item => item.url || item.alt),
        }
        await edit(`${API_VENUE}/${id}`, filteredData);
    };

    useEffect(() => {
        if (fetchLoading || fetchError || !venue || !venue.name) {
            document.title = "Holidaze | Loading...";
        } else {
            document.title = `Holidaze | Edit ${venue.name}`;
        }
    }, [fetchLoading, fetchError, venue]);

    if (fetchLoading) return <div>Loading...</div>;
    if (fetchError) return <div>Error loading venue: {fetchError.message}</div>;
    if (!venue) return <div>Venue not found</div>;

    return(
        <div className="max-w-lg mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Edit Venue</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Name *</label>
                    <input
                        {...register("name", { required: "Name is required" })}
                        className="w-full p-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Venue name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description *</label>
                    <textarea
                        {...register("description", { required: "Description is required" })}
                        className="w-full p-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full p-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Image URL"
                            />
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="p-2 bg-red-500 text-white rounded hover:bg-red-600 hover:cursor-pointer"
                            >
                                <LiaTrashAltSolid />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => append({ url: "" })}
                        className="p-2 bg-[#543786] text-white rounded-full hover:bg-[#9D88C1] hover:cursor-pointer"
                    >
                        <LiaPlusSolid />
                    </button>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <input
                        type="number"
                        {...register("price", { valueAsNumber: true, min: 0 })}
                        className="w-full p-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Price"
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">Price must be a non-negative number</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Max Guests</label>
                    <input
                        type="number"
                        {...register("maxGuests", { valueAsNumber: true, min: 0 })}
                        className="w-full p-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Max guests"
                    />
                    {errors.maxGuests && <p className="text-red-500 text-sm mt-1">Max guests must be a non-negative number</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Rating</label>
                    <input
                        type="number"
                        {...register("rating", { valueAsNumber: true, min: 0, max: 5 })}
                        className="w-full p-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full p-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Address"
                        />
                        <input
                            {...register("location.city")}
                            className="w-full p-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="City"
                        />
                        <input
                            {...register("location.zip")}
                            className="w-full p-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Zip Code"
                        />
                        <input
                            {...register("location.country")}
                            className="w-full p-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Country"
                        />
                        <input
                            {...register("location.continent")}
                            className="w-full p-2 border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Continent"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={editLoading}
                    className="bg-[#543786] text-[24px] font-bold tracking-wide text-white py-[24px] rounded-[20px] w-full hover:bg-[#9D88C1] hover:cursor-pointer"
                >
                    {editLoading ? "Saving Changes..." : "Save Changes"}
                </button>

                {editError && <p className="text-red-500">{editError.message}</p>}
                {editData && <p className="text-green-500">Venue updated successfully!</p>}
            </form>
        </div>
    )
}