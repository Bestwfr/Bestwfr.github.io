import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import TargetCursor from "./TargetCursor";
import SplitText from "./SplitText.tsx";
import workPreview from "./assets/work-preview.svg";
import "./App.css";

export default function App() {
    const workCardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!workCardRef.current) return;

        const card = workCardRef.current;
        
        // Get safe boundaries (avoid header, footer, and screen edges)
        const getSafeBounds = () => {
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

        // Floating animation with boundary constraints
        const animateFloat = () => {
            const bounds = getSafeBounds();
            
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
                onComplete: animateFloat
            });
        };

        // Start animation after a brief delay
        gsap.delayedCall(1, animateFloat);

        // Handle window resize to update boundaries
        const handleResize = () => {
            const bounds = getSafeBounds();
            const currentX = gsap.getProperty(card, "x") as number;
            const currentY = gsap.getProperty(card, "y") as number;
            
            // Clamp current position to new bounds
            const clampedX = Math.min(Math.max(currentX, bounds.minX), bounds.maxX);
            const clampedY = Math.min(Math.max(currentY, bounds.minY), bounds.maxY);
            
            if (currentX !== clampedX || currentY !== clampedY) {
                gsap.to(card, { x: clampedX, y: clampedY, duration: 0.5 });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            gsap.killTweensOf(card);
        };
    }, []);

    return (
        <>
            <TargetCursor />
            <div className="site-root">
                <header className="site-header">
                    <SplitText
                        text="yo! i'm Best"
                        className="site-title"
                        delay={100}
                        duration={0.6}
                        ease="power3.out"
                        splitType="chars"
                        from={{ opacity: 0, y: 40 }}
                        to={{ opacity: 1, y: 0 }}
                        threshold={0.1}
                        textAlign="center"
                    />
                    <div className="site-desc">
                        Game Developer, Programmer, Graphic Designer
                    </div>
                </header>
                <section className="intro" aria-labelledby="intro-heading">
                    <h2 id="intro-heading" className="intro-heading">สวัสดีครับ — ยินดีต้อนรับ</h2>
                    <p className="intro-text">
                        ขณะนี้เว็บไซต์อยู่ระหว่างจัดเตรียมผลงาน โปรดกลับมาใหม่เร็ว ๆ นี้
                    </p>
                </section>
                <main className="site-main">
                    <div ref={workCardRef} className="work-card cursor-target">
                        <img src={workPreview} alt="Work Preview" className="work-preview-img" />
                        <h3>Project:</h3>
                        <p>กำลังเตรียมผลงาน... (Hover over this card)</p>
                    </div>
                </main>
                <footer className="site-footer">
                    <div className="footer-inner">
                        <div className="icon-row">
                            <a className="icon-circle cursor-target" href="https://www.instagram.com/best_wfr/" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a className="icon-circle cursor-target" href="https://github.com/Bestwfr" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-github"></i>
                            </a>
                            <a className="icon-circle cursor-target" href="https://best-w.itch.io/" target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-itch-io"></i>
                            </a>
                        </div>
                        <div className="footer-copy">© 2025 Bestwfr</div>
                    </div>
                </footer>
            </div>
        </>
    );
}