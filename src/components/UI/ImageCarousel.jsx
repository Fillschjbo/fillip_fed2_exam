import {useState} from "react";
import {LiaAngleLeftSolid, LiaAngleRightSolid} from "react-icons/lia";

export function ImageCarousel({media}){
    const [imageIndex ,setImageIndex] = useState(0)

    if (!media || !Array.isArray(media) || media.length === 0) {
        return <p>No images available</p>;
    }

    const handleNext = () => {
        setImageIndex((prevIndex) => (prevIndex + 1) % media.length);
    };

    const handlePrev = () => {
        setImageIndex(
            (prevIndex) => (prevIndex - 1 + media.length) % media.length
        );
    };

    return(
        <div>
            <div className="relative flex flex-col items-center">
                <img
                    key={media[imageIndex].id || imageIndex}
                    src={media[imageIndex].url}
                    alt={media[imageIndex].alt || 'Cabin image'}
                    className="w-full h-[389px] object-cover rounded-[12px]"
                />
                <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:cursor-pointer hover:bg-gray-600"
                >
                    <LiaAngleLeftSolid />
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:cursor-pointer hover:bg-gray-600"
                >
                    <LiaAngleRightSolid />
                </button>

                <div className={'w-full flex gap-[8px] pb-[8px] pt-[8px]'}>
                    {media.map((image, index) => (
                        <button
                            key={image.id || index}
                            onClick={() => setImageIndex(index)}
                            className="focus:outline-none"
                        >
                            <img
                                src={image.url}
                                alt={image.alt || 'Thumbnail'}
                                className={`h-[50px] w-[75px] object-cover rounded-[12px] hover:cursor-pointer ${
                                    index === imageIndex
                                        ? 'scale-105 border-2 border-[##2D4B48]'
                                        : 'border-2 border-transparent'
                                }`}
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}