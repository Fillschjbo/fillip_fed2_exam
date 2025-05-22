import {useFetch} from "../../hooks/api/useFetch.jsx";
import {API_VENUE} from "../../utilities/constants.js";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper/modules";
import React from "react";
import {VenueCard} from "../Cards/VenueCard.jsx";
import {Link} from "react-router-dom";

export function NewestVenues () {
    const { data, loading, error } = useFetch(`${API_VENUE}?limit=4&sort=created&sortBy=ASC`, true);
    const venues = data|| [];

    if (loading) return <div className="text-center text-gray-600">Loading venues...</div>;
    if (error) return <div className="text-center text-red-500">Error loading venues: {error.message}</div>;
    if (venues.length === 0) return <div className="text-center text-gray-600">No venues found.</div>;

    return (
        <div className="max-w-[70vw] mx-auto p-5">
            <h2 className={"text-2xl font-sans font-bold tracking-wide mb-4"}>Newest Venues</h2>
            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={1}
                navigation={{
                    nextEl: '.swiper-recommendation-next',
                    prevEl: '.swiper-recommendation-prev',
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
                        <Link to={`/venue/${venue.id}`} key={venue.id}>
                            <VenueCard
                                title={venue.name}
                                image={venue.media[0]?.url}
                                city={venue.location?.city || "Unknown City"}
                                country={venue.location?.country || "Unknown Country"}
                                price={venue.price || 0}
                                wifi={venue.meta?.wifi || false}
                                parking={venue.meta?.parking || false}
                                breakfast={venue.meta?.breakfast || false}
                                pets={venue.meta?.pets || false}
                                rating={venue.rating || 0}
                            />
                            </Link>
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