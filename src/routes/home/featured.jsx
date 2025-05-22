import {HeroBanner} from "../../components/UI/HeroBanner.jsx";
import {RecommendationCard} from "../../components/Cards/RecomendationCard.jsx";
import {FeaturedVenuesCarousel} from "../../components/UI/FeaturedVenuesCarousel.jsx";
import {NewestVenues} from "../../components/UI/NewestVenues.jsx";


export function Featured(){
    return (
        <div className={"flex flex-col items-center w-screen bg-[#F5F5F7]"}>
            <title>Holidaze | Featured</title>
            <HeroBanner />
            <RecommendationCard />
            <FeaturedVenuesCarousel />
            <NewestVenues />
        </div>
    );
}