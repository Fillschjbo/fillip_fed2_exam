import {Link} from "react-router-dom";
import {API_VENUE} from "../../utilities/constants.js";

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
        <div className="w-screen">
            <div className="ml-[7vw] xl:mx-auto xl:max-w-[1300px]">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-sans font-bold tracking-wide mb-4">Find Your New Favorite Place</h2>
                    <div className="flex overflow-x-auto gap-4 pb-4 xl:justify-center">
                        {recommendations.map((recommendation) => (
                            <Link key={recommendation.city} to={`/results?q=${recommendation.city}`}>
                                <div className="min-w-[310px]">
                                    <div className="flex flex-col gap-4 bg-[#F0EEFB] rounded-[20px] pb-10 mb-8">
                                        <img
                                            src={recommendation.img}
                                            alt="city image"
                                            className="w-[310px] h-[265px] rounded-t-[20px] object-cover"
                                        />
                                        <p className="font-sans font-bold ml-2">{recommendation.city}, {recommendation.country}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}