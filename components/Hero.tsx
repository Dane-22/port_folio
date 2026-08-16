"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

function FloatingBubble({ id, onComplete }: { id: number, onComplete: (id: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const shockwaveRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const [isPopped, setIsPopped] = useState(false);
  const poppedHandled = useRef(false);

  // Lock size so it doesn't change on re-render
  const [size] = useState(() => Math.random() * 60 + 40);

  useEffect(() => {
    if (!containerRef.current || !bubbleRef.current) return;
    
    const startX = Math.random() * 90;
    const duration = Math.random() * 10 + 10;
    const sway = (Math.random() - 0.5) * 200;

    gsap.set(containerRef.current, {
      left: `${startX}%`,
      y: -size - 100,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        if (!poppedHandled.current) onComplete(id);
      }
    });

    tl.to(containerRef.current, {
      y: window.innerHeight + size + 100,
      x: `+=${sway}`,
      duration: duration,
      ease: "none"
    });

    return () => {
      tl.kill();
    };
  }, [id, onComplete, size]);

  const handlePop = () => {
    if (!containerRef.current || !bubbleRef.current || poppedHandled.current) return;
    poppedHandled.current = true;
    
    gsap.killTweensOf(containerRef.current);
    
    gsap.to(bubbleRef.current, {
      scale: 1.5,
      opacity: 0,
      duration: 0.15,
      onComplete: () => {
         setIsPopped(true);
      }
    });
  };

  useEffect(() => {
    if (isPopped && particlesRef.current && shockwaveRef.current) {
       gsap.fromTo(shockwaveRef.current, 
         { scale: 1, opacity: 0.8 },
         { scale: 2.5, opacity: 0, duration: 0.6, ease: "power3.out" }
       );

       const particles = particlesRef.current.children;
       const numParticles = particles.length;
       
       Array.from(particles).forEach((particle, i) => {
         const angle = (Math.PI * 2 / numParticles) * i + (Math.random() * 0.5);
         const distance = size * 0.8 + Math.random() * 20;

         gsap.fromTo(particle, 
           { x: 0, y: 0, opacity: 1 },
           {
             x: Math.cos(angle) * distance,
             y: Math.sin(angle) * distance + 60, // Gravity pull
             opacity: 0,
             duration: 0.6 + Math.random() * 0.2,
             ease: "power4.out",
             onComplete: i === numParticles - 1 ? () => {
                setTimeout(() => onComplete(id), 200); // Small delay before respawn
             } : undefined
           }
         );
       });
    }
  }, [isPopped, size, id, onComplete]);

  return (
    <div ref={containerRef} className="absolute pointer-events-none flex items-center justify-center" style={{ width: size, height: size }}>
      {!isPopped && (
        <div
          ref={bubbleRef}
          onClick={handlePop}
          className="relative rounded-full cursor-pointer pointer-events-auto transition-transform hover:scale-105 w-full h-full"
          style={{
            background: "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.05) 60%, rgba(255, 255, 255, 0) 100%)",
            boxShadow: "inset 0 0 20px rgba(255, 255, 255, 0.3), inset 10px 0 30px rgba(255, 0, 255, 0.2), inset -10px 0 30px rgba(0, 255, 255, 0.2), 0 0 15px rgba(255,255,255,0.1)",
            backdropFilter: "blur(2px)",
            border: "1px solid rgba(255, 255, 255, 0.1)"
          }}
        >
          <div className="absolute top-[15%] left-[20%] w-[30%] h-[30%] rounded-full -rotate-45"
            style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)" }}
          />
        </div>
      )}
      
      {isPopped && (
        <>
          <div 
            ref={shockwaveRef} 
            className="absolute rounded-full border-2 border-cyan-200/50"
            style={{ width: size, height: size }}
          />
          <div ref={particlesRef} className="absolute inset-0">
            {Array.from({ length: 8 }).map((_, i) => {
              const pSize = Math.random() * 6 + 2;
              return (
                <div 
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: pSize,
                    height: pSize,
                    left: size/2 - pSize/2,
                    top: size/2 - pSize/2,
                    background: "radial-gradient(circle at center, rgba(255,255,255,0.8), rgba(255,255,255,0))",
                    boxShadow: "inset 0 0 5px rgba(255,255,255,0.5), 0 0 8px rgba(0,255,255,0.4)"
                  }}
                />
              )
            })}
          </div>
        </>
      )}
    </div>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [bubbles, setBubbles] = useState<number[]>([]);

  useEffect(() => {
    // Initialize 15 bubbles
    setBubbles(Array.from({ length: 15 }, (_, i) => Date.now() + i));
  }, []);

  const handleBubbleRespawn = useCallback((oldId: number) => {
    setBubbles(prev => prev.map(id => id === oldId ? Date.now() + Math.random() : id));
  }, []);

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
      {/* Floating Bubbles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {bubbles.map(id => (
          <FloatingBubble key={id} id={id} onComplete={handleBubbleRespawn} />
        ))}
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
