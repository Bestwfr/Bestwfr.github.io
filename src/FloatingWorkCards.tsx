import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import workPreview from "./assets/work-preview.svg";

interface WorkCard {
    id: number;
    title: string;
    description: string;
}

const workCards: WorkCard[] = [
    { id: 1, title: "Project 1:", description: "กำลังเตรียมผลงาน... (Hover over this card)" },
    { id: 2, title: "Project 2:", description: "Coming soon..." },
    { id: 3, title: "Project 3:", description: "Work in progress..." }
];

export default function FloatingWorkCards() {
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const cards = cardsRef.current.filter(card => card !== null);
        if (cards.length === 0) return;

        // Get safe boundaries (avoid header, footer, and screen edges)
        const getSafeBounds = (card: HTMLDivElement) => {
            const header = document.querySelector('.site-header');
            const footer = document.querySelector('.site-footer');
            const intro = document.querySelector('.intro');
            
            const headerRect = header?.getBoundingClientRect();
            const footerRect = footer?.getBoundingClientRect();
            const introRect = intro?.getBoundingClientRect();
            
            const margin = 60; // pixels from edges
            const headerBottom = headerRect ? headerRect.bottom + 20 : 240;
            const introBottom = introRect ? introRect.bottom + 30 : 400;
            const footerTop = footerRect ? footerRect.top : window.innerHeight;
            
            // Use intro bottom if it's lower than header
            const topBoundary = Math.max(headerBottom, introBottom);
            const bottomBoundary = footerTop - 120; // 120px clearance from footer
            
            return {
                minX: margin,
                maxX: window.innerWidth - card.offsetWidth - margin,
                minY: topBoundary,
                maxY: bottomBoundary - card.offsetHeight
            };
        };

        // Floating animation with boundary constraints for a single card
        const animateFloat = (card: HTMLDivElement) => {
            const bounds = getSafeBounds(card);
            
            // Ensure bounds are valid
            if (bounds.maxX < bounds.minX || bounds.maxY < bounds.minY) {
                // If window is too small, position card in center
                gsap.to(card, {
                    x: window.innerWidth / 2 - card.offsetWidth / 2,
                    y: window.innerHeight / 2 - card.offsetHeight / 2,
                    duration: 1
                });
                return;
            }
            
            const randomX = gsap.utils.random(bounds.minX, bounds.maxX);
            const randomY = gsap.utils.random(bounds.minY, bounds.maxY);
            const duration = gsap.utils.random(4, 7);
            
            gsap.to(card, {
                x: randomX,
                y: randomY,
                duration: duration,
                ease: "sine.inOut",
                onComplete: () => animateFloat(card)
            });
        };

        // Start animation for each card with a staggered delay
        cards.forEach((card, index) => {
            gsap.delayedCall(1 + index * 0.5, () => animateFloat(card));
        });

        // Handle window resize to update boundaries
        const handleResize = () => {
            cards.forEach(card => {
                const bounds = getSafeBounds(card);
                const currentX = gsap.getProperty(card, "x") as number;
                const currentY = gsap.getProperty(card, "y") as number;
                
                // Clamp current position to new bounds
                const clampedX = Math.min(Math.max(currentX, bounds.minX), bounds.maxX);
                const clampedY = Math.min(Math.max(currentY, bounds.minY), bounds.maxY);
                
                if (currentX !== clampedX || currentY !== clampedY) {
                    gsap.to(card, { x: clampedX, y: clampedY, duration: 0.5 });
                }
            });
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            cards.forEach(card => gsap.killTweensOf(card));
        };
    }, []);

    return (
        <>
            {workCards.map((work, index) => (
                <div 
                    key={work.id}
                    ref={el => { cardsRef.current[index] = el; }}
                    className="work-card cursor-target"
                >
                    <img src={workPreview} alt="Work Preview" className="work-preview-img" />
                    <h3>{work.title}</h3>
                    <p>{work.description}</p>
                </div>
            ))}
        </>
    );
}
