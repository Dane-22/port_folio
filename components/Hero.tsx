"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface SymbolProps {
  size: number;
  label: string;
  className?: string;
  delay?: number;
}

function FloatingSymbol({ size, label, className = "", delay = 0 }: SymbolProps) {
  const symbolRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!symbolRef.current) return;
    const symbol = symbolRef.current;

    // Initial fade in
    gsap.fromTo(symbol, 
      { opacity: 0, scale: 0.8 }, 
      { opacity: 0.6, scale: 1, duration: 1, delay: delay, ease: "power2.out" }
    );

    // Very subtle static breathing (scale only)
    const scaleAnim = gsap.to(symbol, {
      scale: 1.1,
      duration: 3 + (delay || 0) % 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: delay,
    });

    return () => {
      scaleAnim.kill();
    };
  }, [delay]);

  return (
    <div
      ref={symbolRef}
      className={`absolute flex items-center justify-center font-mono font-bold text-accent select-none pointer-events-none ${className}`}
      style={{
        fontSize: size * 0.4,
        opacity: 0.6,
      }}
    >
      {label}
    </div>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  // Text reveal animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Split headline into letters for animation
      if (headlineRef.current) {
        const text = headlineRef.current.textContent || "";
        headlineRef.current.innerHTML = text
          .split("")
          .map((char) =>
            char === " " ? " " : `<span class="inline-block blur-letter">${char}</span>`
          )
          .join("");

        const letters = headlineRef.current.querySelectorAll(".blur-letter");

        tl.fromTo(
          letters,
          {
            opacity: 0,
            y: 50,
            filter: "blur(10px)",
          },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: 0.03,
          }
        );
      }

      // Headline animation only
      tl.fromTo(
        ".hero-caption",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      );

      tl.fromTo(
        ".hero-description",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.3"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4"
    >
      {/* Floating Symbols - spread across the entire section */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top row */}
        <FloatingSymbol size={40} label="Esc" className="top-[15%] left-[15%]" delay={0} />
        <FloatingSymbol size={50} label="{ }" className="top-[10%] left-[40%]" delay={0.5} />
        <FloatingSymbol size={35} label="Ctrl" className="top-[20%] right-[20%]" delay={1} />

        {/* Middle row */}
        <FloatingSymbol size={45} label="< />" className="top-[40%] left-[8%]" delay={1.5} />
        <FloatingSymbol size={30} label="Alt" className="top-[45%] right-[12%]" delay={2} />
        <FloatingSymbol size={40} label="npm" className="top-[35%] left-[60%]" delay={0.8} />

        {/* Bottom row */}
        <FloatingSymbol size={35} label="Del" className="bottom-[25%] left-[25%]" delay={2.5} />
        <FloatingSymbol size={45} label="Tab" className="bottom-[15%] left-[45%]" delay={1.2} />
        <FloatingSymbol size={40} label="//" className="bottom-[20%] right-[15%]" delay={3} />
        <FloatingSymbol size={30} label="Fn" className="bottom-[35%] right-[25%]" delay={1.8} />
        <FloatingSymbol size={35} label="Shift" className="top-[55%] left-[18%]" delay={2.2} />
        <FloatingSymbol size={25} label="cmd" className="bottom-[40%] left-[55%]" delay={0.3} />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        <h2
          ref={headlineRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-4 whitespace-nowrap"
        >
          Hi! I'm Daniel.
        </h2>
        <p className="hero-caption text-xl md:text-2xl text-accent font-medium mb-4">
          Automating the Present, Building the Future
        </p>
        <p className="hero-description text-base md:text-lg text-foreground/60 max-w-2xl mx-auto mb-8 leading-relaxed">
          I specialize in creating seamless digital experiences through innovative automation solutions.
          With expertise spanning frontend development, backend systems, and CRM integration,
          I help businesses streamline their operations and scale their impact.
          Every project is an opportunity to transform ideas into efficient, elegant reality.
        </p>

        {/* View My Work Button */}
        <button
          onClick={() => {
            document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-8 py-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white font-medium hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:scale-105"
        >
          View My Work
        </button>
      </div>

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
