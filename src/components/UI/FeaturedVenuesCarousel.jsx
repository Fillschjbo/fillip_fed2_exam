import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import {useFetch} from "../../hooks/api/useFetch.jsx";
import {API_PROFILE} from "../../utilities/constants.js";


export function FeaturedVenuesCarousel () {
    const { data, loading, error } = useFetch(`${API_PROFILE}/venuemanagertest?_venues=true`, true);
    const venues = data?.venues || [];

    if (loading) return <div className="text-center text-gray-600">Loading venues...</div>;
    if (error) return <div className="text-center text-red-500">Error loading venues: {error.message}</div>;
    if (venues.length === 0) return <div className="text-center text-gray-600">No venues found.</div>;

    return (
        <div className="max-w-[70vw] mx-auto p-5">
            <h2 className={"text-2xl font-sans font-bold tracking-wide mb-4"}>Featured Venues</h2>
            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={1}
                navigation={{
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                }}
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1440: {slidesPerView: 4},
                }}
                className="py-5"
            >
                {venues.map((venue) => (
                    <SwiperSlide key={venue.id} className="flex justify-center">
                        <div className="bg-[#F0EEFB] rounded-lg shadow-lg overflow-hidden flex flex-col h-[400px] hover:cursor-pointer">
                            <img
                                src={venue.media?.[0]?.url || 'https://via.placeholder.com/300'}
                                alt={venue.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4 flex flex-col flex-1 justify-between">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{venue.name}</h3>
                                <p className="text-gray-600 text-sm mb-2">
                                    {venue.description?.substring(0, 100) || 'No description available'}...
                                </p>
                                <p className="text-gray-500 text-xs">Location: {venue.location?.city || 'Unknown'}</p>
                                <p className="text-gray-500 text-xs">Price: ${venue.price || 'N/A'}</p>
                                <p className="text-gray-500 text-xs">Max Guests: {venue.maxGuests || 'N/A'}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                <div
                    className="swiper-recommendation-prev absolute top-1/2 left-0 -translate-y-1/2 z-10 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 cursor-pointer after:hidden"
                    aria-label="Previous slide"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </div>
                <div
                    className="swiper-recommendation-next absolute top-1/2 right-0 -translate-y-1/2 z-10 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-700 cursor-pointer after:hidden"
                    aria-label="Next slide"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </Swiper>
        </div>
    );
};