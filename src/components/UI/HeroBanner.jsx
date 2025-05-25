import {Searchbar} from "./Searchbar.jsx";
import logo from "/src/assets/logo/holidaze.svg"
import {useEffect, useRef, useState} from "react";

export function HeroBanner() {
    const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
    const currentPosition = useRef({ x: 0, y: 0 });
    const rafId = useRef(null);

    const damping = 0.1;
    const scaleFactor = 1.1;

    useEffect(() => {
        const handleMouseMove = (e) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const moveX = (e.clientX - centerX) / centerX;
            const moveY = (e.clientY - centerY) / centerY;

            const translateX = -moveX * 20;
            const translateY = -moveY * 20;

            setTargetPosition({ x: translateX, y: translateY });
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    useEffect(() => {
        const animate = () => {
            currentPosition.current.x += (targetPosition.x - currentPosition.current.x) * damping;
            currentPosition.current.y += (targetPosition.y - currentPosition.current.y) * damping;

            const img = document.getElementById("hero-image");
            if (img) {
                img.style.transform = `translate(${currentPosition.current.x}px, ${currentPosition.current.y}px) scale(${scaleFactor})`;
            }

            rafId.current = requestAnimationFrame(animate);
        };

        rafId.current = requestAnimationFrame(animate);

        return () => {
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, [targetPosition, scaleFactor]);

    return (
        <div className="h-screen w-screen flex flex-col items-center pt-45 gap-y-20 overflow-hidden bg-transparent">
            <div className="absolute inset-0 overflow-hidden">
                <img
                    id="hero-image"
                    className="absolute top-1/2 left-1/2 w-full h-full object-cover z-0 -translate-x-1/2 -translate-y-1/2"
                    src="/herobanner/hero_image.jpg"
                    alt="herobanner image"
                />
            </div>
            <h1 className="relative z-10 font-serif text-[7vw] tracking-wide text-black">Your vacation starts with</h1>
            <img src={logo} alt="Holidaze logo" className="relative z-10 w-[20vw]" />
            <Searchbar />
        </div>
    );
}