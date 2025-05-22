import {Link} from "react-router-dom";
import { Navigation } from 'swiper/modules';
import {Swiper, SwiperSlide} from "swiper/react";
import 'swiper/css';
import 'swiper/css/navigation';

export function RecommendationCard() {
    const recommendations = [
        {
            city: "Barcelona",
            country:"Spain",
            img: "https://cdn.sanity.io/images/9buzw47c/solfaktor-prod/c9703b8c66e7eb611746c1ffed5a5905002133dd-4500x3000.jpg?h=1200"
        },
        {
            city: "New York",
            country:"USA",
            img: "https://i.natgeofe.com/k/5b396b5e-59e7-43a6-9448-708125549aa1/new-york-statue-of-liberty.jpg"
        },
        {
            city: "Stockholm",
            country:"Sweden",
            img: "https://cms.finnair.com/resource/blob/815134/0809e2efc6f6ab20ce034ca45935ebdc/stockholm-main-data.jpg"
        },
        {
            city: "Budapest",
            country:"Hungary",
            img: "https://reisebloggen.allertravel.no/wp-content/uploads/2022/01/budapest-parlament.jpg"
        },
    ]

    return(
        <div className="max-w-[70vw] mx-auto p-5 relative">
            <h2 className="text-2xl font-sans font-bold tracking-wide mb-4">Find Your New Favorite Place</h2>
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
                    1440: { slidesPerView: 4 },
                }}
                className="py-5"
                onSwiper={() => console.log('RecommendationCard Swiper initialized')}
            >
                {recommendations.map((recommendation) => (
                    <SwiperSlide key={recommendation.city} className="flex justify-center">
                        <Link to={`/results?q=${recommendation.city}`}>
                            <div className="bg-[#F0EEFB] rounded-[20px] overflow-hidden flex flex-col h-[300px] hover:cursor-pointer">
                                <img
                                    src={recommendation.img}
                                    alt={`${recommendation.city} image`}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4 flex flex-col flex-1 justify-between">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        {recommendation.city}, {recommendation.country}
                                    </h3>
                                </div>
                            </div>
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
}