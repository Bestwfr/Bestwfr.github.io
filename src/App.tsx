import TargetCursor from "./TargetCursor";
import SplitText from "./SplitText.tsx";
import FloatingWorkCards from "./FloatingWorkCards";
import "./App.css";

export default function App() {
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
                    <FloatingWorkCards />
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