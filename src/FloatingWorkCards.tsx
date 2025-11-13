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

        // Get safe boundaries for floating animation (middle area of screen)
        const getSafeBounds = (card: HTMLDivElement) => {
            const margin = 80; // pixels from edges
            const centerAreaHeight = window.innerHeight * 0.5; // Use middle 50% of screen height
            const centerAreaWidth = window.innerWidth * 0.6; // Use middle 60% of screen width
            
            const topBoundary = (window.innerHeight - centerAreaHeight) / 2;
            const bottomBoundary = topBoundary + centerAreaHeight;
            const leftBoundary = (window.innerWidth - centerAreaWidth) / 2;
            const rightBoundary = leftBoundary + centerAreaWidth;
            
            return {
                minX: Math.max(leftBoundary, margin),
                maxX: Math.min(rightBoundary, window.innerWidth - margin) - card.offsetWidth,
                minY: Math.max(topBoundary, margin),
                maxY: Math.min(bottomBoundary, window.innerHeight - margin) - card.offsetHeight
            };
        };

        // Initialize cards in the middle area
        cards.forEach((card, index) => {
            const bounds = getSafeBounds(card);
            const centerX = (bounds.minX + bounds.maxX) / 2;
            const centerY = (bounds.minY + bounds.maxY) / 2;
            
            // Offset slightly for each card so they don't overlap initially
            const offsetX = (index - 1) * 50; // Spread cards horizontally
            const offsetY = (index - 1) * 30; // Spread cards vertically
            
            gsap.set(card, {
                x: centerX + offsetX,
                y: centerY + offsetY,
                opacity: 0
            });
            
            // Fade in the card
            gsap.to(card, {
                opacity: 1,
                duration: 0.8,
                delay: index * 0.2
            });
        });

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
            const duration = gsap.utils.random(5, 8);
            
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
            gsap.delayedCall(1.5 + index * 0.3, () => animateFloat(card));
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
