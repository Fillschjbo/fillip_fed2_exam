import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetch } from "../../hooks/api/useFetch.jsx";
import { useEdit } from "../../hooks/api/useEdit.jsx";
import { API_PROFILE } from "../../utilities/constants.js";
import { TbCamera, TbArrowLeft } from "react-icons/tb";
import {toast} from "react-hot-toast";

export function EditProfile() {
    const { name } = useParams();
    const navigate = useNavigate();
    const { data: profile, loading: profileLoading, error: profileError } = useFetch(`${API_PROFILE}/${name}`);
    const { edit, loading: editLoading, error: editError, data: editData } = useEdit();

    const [formData, setFormData] = useState({
        bio: "",
        avatar: {
            url: "",
            alt: ""
        },
        banner: {
            url: "",
            alt: ""
        },
        venueManager: false
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                bio: profile.bio || "",
                avatar: {
                    url: profile.avatar?.url || "",
                    alt: profile.avatar?.alt || ""
                },
                venueManager: profile.venueManager || false
            });
        }
    }, [profile]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.avatar.url && !isValidUrl(formData.avatar.url)) {
            toast.error("Please enter a valid avatar URL");
            return;
        }

        const payload = {};

        if (formData.bio.trim()) {
            payload.bio = formData.bio.trim();
        }

        if (formData.avatar.url.trim()) {
            payload.avatar = {
                url: formData.avatar.url.trim(),
                alt: formData.avatar.alt.trim() || "User avatar"
            };
        }

        if (formData.banner.url.trim()) {
            payload.banner = {
                url: formData.banner.url.trim(),
                alt: formData.banner.alt.trim() || "User banner"
            };
        }

        payload.venueManager = formData.venueManager;

        let existingUser = JSON.parse(localStorage.getItem("user")) || {};

        const updatedUser = {
            ...existingUser,
            name: name,
            avatar: formData.avatar.url.trim() || existingUser.avatar,
        };

        const updatedVenueManager = formData.venueManager;

        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("venueManager", updatedVenueManager)

        await edit(`${API_PROFILE}/${name}`, payload);
    };

    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    useEffect(() => {
        if (editData) {
            toast.success("Profile updated successfully!");
            navigate(`/profile/${name}`);
        }
    }, [editData, navigate, name]);

    if (profileLoading) {
        return (
            <div className="w-[90vw] md:w-[80vw] lg:w-[70vw] p-5 mx-auto flex justify-center items-center min-h-screen">
                <div className="text-xl">Loading profile...</div>
            </div>
        );
    }

    if (profileError) {
        return (
            <div className="w-[90vw] md:w-[80vw] lg:w-[70vw] p-5 mx-auto flex justify-center items-center min-h-screen">
                <div className="text-xl text-red-500">Error loading profile: {profileError.message}</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="w-[90vw] md:w-[80vw] lg:w-[70vw] p-5 mx-auto flex justify-center items-center min-h-screen">
                <div className="text-xl">Profile not found</div>
            </div>
        );
    }

    return (
        <div className="w-[90vw] md:w-[80vw] lg:w-[70vw] p-5 mx-auto flex flex-col min-h-screen pt-10 gap-8">

            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate(`/profile/${name}`)}
                    className="p-2 rounded-[10px] border border-gray-300 hover:bg-gray-50 flex items-center gap-2 hover: cursor-pointer"
                >
                    <TbArrowLeft size={20} />
                    Back to Profile
                </button>
                <h1 className="text-[32px] font-serif font-bold">Edit Profile</h1>
            </div>

            <div className="flex rounded-[20px] border border-gray-300 w-full h-fit p-[43px] items-center gap-6 relative bg-gray-50">
                <div>
                    <img
                        src={formData.avatar.url || profile.avatar?.url || "https://via.placeholder.com/150?text=Avatar"}
                        alt="profile avatar"
                        className="md:size-50 size-15 rounded-full object-cover"
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/150?text=Avatar";
                        }}
                    />
                </div>
                <div className="h-full w-[70%] flex flex-col justify-center gap-2">
                    <h2 className="text-[24px] font-sans font-bold tracking-wide">{profile.name}</h2>
                    <p className="text-[16px] font-sans font-normal tracking-wide text-gray-600">{profile.email}</p>
                    <p className="text-[16px] font-sans font-normal tracking-wide">
                        {formData.venueManager ? "Venue Manager" : "Regular User"}
                    </p>
                    {formData.bio && (
                        <p className="text-[14px] font-sans font-normal tracking-wide text-gray-700 mt-2">
                            {formData.bio}
                        </p>
                    )}
                </div>
                <div className="absolute top-4 right-4 text-gray-400">
                    <TbCamera size={24} />
                </div>
            </div>

            <div className="bg-white rounded-[20px] border border-gray-300 p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    <div>
                        <label htmlFor="bio" className="block text-[16px] font-sans font-medium mb-2">
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            placeholder="Tell us about yourself..."
                            rows="4"
                            className="w-full p-3 border border-gray-300 rounded-[10px] font-sans text-[16px] resize-vertical"
                        />
                    </div>

                    <div>
                        <label htmlFor="avatar.url" className="block text-[16px] font-sans font-medium mb-2">
                            Avatar Image URL
                        </label>
                        <input
                            type="url"
                            id="avatar.url"
                            name="avatar.url"
                            value={formData.avatar.url}
                            onChange={handleInputChange}
                            placeholder="https://example.com/your-avatar.jpg"
                            className="w-full p-3 border border-gray-300 rounded-[10px] font-sans text-[16px]"
                        />
                        <input
                            type="text"
                            id="avatar.alt"
                            name="avatar.alt"
                            value={formData.avatar.alt}
                            onChange={handleInputChange}
                            placeholder="Alt text for avatar image"
                            className="w-full p-3 border border-gray-300 rounded-[10px] font-sans text-[16px] mt-2"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="venueManager"
                            name="venueManager"
                            checked={formData.venueManager}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 hover:cursor-pointer"
                        />
                        <label htmlFor="venueManager" className="text-[16px] font-sans font-medium">
                            Register as Venue Manager
                        </label>
                    </div>
                    <p className="text-[14px] text-gray-600 -mt-4 ml-8">
                        Venue managers can create and manage venue listings
                    </p>

                    {editError && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-[10px]">
                            <p className="text-red-600 font-sans text-[16px]">
                                {editError.message || "Failed to update profile"}
                            </p>
                        </div>
                    )}

                    {editData && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-[10px]">
                            <p className="text-green-600 font-sans text-[16px]">
                                Profile updated successfully!
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate(`/profile/${name}`)}
                            className="px-6 py-3 bg-gray-300 rounded-[10px] font-sans text-[16px] hover:bg-gray-400 hover:cursor-pointer transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={editLoading}
                            className={`px-6 py-3 bg-[#543786] text-white rounded-[10px] font-sans text-[16px] hover:bg-[#9D88C1] hover:cursor-pointer transition-colors ${
                                editLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {editLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}