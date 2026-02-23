"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface BubbleProps {
  size: number;
  className?: string;
  delay?: number;
  duration?: number;
}

function FloatingBubble({ size, className = "", delay = 0, duration = 8 }: BubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [isPopped, setIsPopped] = useState(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!bubbleRef.current || isPopped) return;

    const bubble = bubbleRef.current;
    const startY = -100 - Math.random() * 200;
    const endY = window.innerHeight + 100;
    const driftX = (Math.random() - 0.5) * 100;

    // Set initial position
    gsap.set(bubble, { y: startY, x: 0, opacity: 0, scale: 1 });

    // Falling animation with fade in/out
    const tl = gsap.timeline({ repeat: -1, delay: delay });
    timelineRef.current = tl;
    
    tl.to(bubble, {
      opacity: 1,
      duration: 0.5,
    }).to(bubble, {
      y: endY,
      x: driftX,
      duration: duration,
      ease: "none",
    }).to(bubble, {
      opacity: 0,
      duration: 0.3,
    }).set(bubble, { y: startY, x: 0 });

    // Subtle wobble animation during fall
    gsap.to(bubble, {
      x: "+=15",
      duration: 1.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: delay,
    });

    return () => {
      tl.kill();
    };
  }, [delay, duration, isPopped]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!bubbleRef.current || isPopped) return;

    setIsPopped(true);
    
    // Kill the falling animation
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const bubble = bubbleRef.current;

    // Create pop animation timeline
    const popTl = gsap.timeline({
      onComplete: () => {
        gsap.set(bubble, { display: "none" });
      }
    });

    // Pop out effect - scale up dramatically with burst
    popTl
      .to(bubble, {
        scale: 2.5,
        opacity: 0.8,
        y: "-=50",
        duration: 0.15,
        ease: "power4.out",
      })
      .to(bubble, {
        scale: 3,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
      });

    // Create particle burst effect
    const rect = bubble.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 8; i++) {
      const particle = document.createElement("div");
      particle.className = "absolute rounded-full pointer-events-none";
      particle.style.cssText = `
        width: ${size * 0.15}px;
        height: ${size * 0.15}px;
        background: radial-gradient(circle, rgba(139, 92, 246, 0.8), rgba(139, 92, 246, 0));
        left: ${centerX}px;
        top: ${centerY}px;
        position: fixed;
        z-index: 100;
      `;
      document.body.appendChild(particle);

      const angle = (i / 8) * Math.PI * 2;
      const distance = size * 1.5;

      gsap.to(particle, {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        opacity: 0,
        scale: 0,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => particle.remove(),
      });
    }
  };

  if (isPopped) return null;

  return (
    <div
      ref={bubbleRef}
      onClick={handleClick}
      className={`absolute rounded-full cursor-pointer hover:scale-110 transition-transform ${className}`}
      style={{
        width: size,
        height: size,
        background: 'radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.5), rgba(139, 92, 246, 0.2) 50%, rgba(139, 92, 246, 0.05))',
        boxShadow: `
          inset -5px -5px 15px rgba(0,0,0,0.3),
          inset 5px 5px 15px rgba(255,255,255,0.15),
          0 0 ${size * 0.6}px rgba(139, 92, 246, 0.4),
          0 0 ${size * 1.2}px rgba(139, 92, 246, 0.2)
        `,
        backdropFilter: 'blur(2px)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
      }}
    >
      {/* Bubble highlight */}
      <div 
        className="absolute rounded-full"
        style={{
          width: size * 0.25,
          height: size * 0.2,
          top: size * 0.15,
          left: size * 0.2,
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.5) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}

function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mousePosition;
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const keycapsContainerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Mouse parallax effect for keycaps
  useEffect(() => {
    if (!keycapsContainerRef.current) return;

    const keycaps = keycapsContainerRef.current.querySelectorAll(".keycap-parallax");
    keycaps.forEach((keycap, index) => {
      const depth = (index + 1) * 0.5;
      gsap.to(keycap, {
        x: -mousePosition.x * 30 * depth,
        y: -mousePosition.y * 20 * depth,
        duration: 0.5,
        ease: "power2.out",
      });
    });
  }, [mousePosition]);

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
      {/* Floating Bubbles - centered around content */}
      <div ref={keycapsContainerRef} className="absolute inset-0 pointer-events-none">
        {/* Top row bubbles */}
        <div className="keycap-parallax">
          <FloatingBubble size={60} className="top-[10%] left-[15%]" delay={0} duration={10} />
        </div>
        <div className="keycap-parallax">
          <FloatingBubble size={80} className="top-[8%] left-[35%]" delay={0.5} duration={12} />
        </div>
        <div className="keycap-parallax">
          <FloatingBubble size={50} className="top-[12%] right-[20%]" delay={1} duration={9} />
        </div>
        
        {/* Middle row bubbles - around headline */}
        <div className="keycap-parallax">
          <FloatingBubble size={70} className="top-[30%] left-[8%]" delay={1.5} duration={11} />
        </div>
        <div className="keycap-parallax">
          <FloatingBubble size={45} className="top-[35%] right-[10%]" delay={2} duration={8} />
        </div>
        <div className="keycap-parallax">
          <FloatingBubble size={65} className="top-[25%] left-[50%]" delay={0.8} duration={13} />
        </div>
        
        {/* Bottom row bubbles */}
        <div className="keycap-parallax">
          <FloatingBubble size={55} className="bottom-[20%] left-[20%]" delay={2.5} duration={10} />
        </div>
        <div className="keycap-parallax">
          <FloatingBubble size={75} className="bottom-[15%] left-[40%]" delay={1.2} duration={11} />
        </div>
        <div className="keycap-parallax">
          <FloatingBubble size={60} className="bottom-[18%] right-[15%]" delay={3} duration={9} />
        </div>
        <div className="keycap-parallax">
          <FloatingBubble size={40} className="bottom-[30%] right-[25%]" delay={1.8} duration={8} />
        </div>
        <div className="keycap-parallax">
          <FloatingBubble size={50} className="top-[45%] left-[15%]" delay={2.2} duration={12} />
        </div>
        <div className="keycap-parallax">
          <FloatingBubble size={35} className="bottom-[35%] left-[55%]" delay={0.3} duration={7} />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        <h2
          ref={headlineRef}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-4 whitespace-nowrap"
        >
          Hi, I am Daniel
        </h2>
        <p className="hero-caption text-xl md:text-2xl text-accent font-medium mb-4">
          Automating the present, Building the future
        </p>
        <p className="hero-description text-base md:text-lg text-foreground/60 max-w-2xl mx-auto mb-8 leading-relaxed">
          I specialize in creating seamless digital experiences through innovative automation solutions. 
          With expertise spanning frontend development, backend systems, and CRM integration, 
          I help businesses streamline their operations and scale their impact. 
          Every project is an opportunity to transform ideas into efficient, elegant reality.
        </p>

        {/* Contact Me Button */}
        <button
          onClick={() => setIsContactModalOpen(true)}
          className="px-8 py-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white font-medium hover:bg-white/10 hover:border-white/40 transition-all duration-300 hover:scale-105"
        >
          Contact Me
        </button>
      </div>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setIsContactModalOpen(false)}
        >
          <div
            className="relative p-8 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md max-w-md mx-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-xl font-semibold mb-2 text-white">Get In Touch</h3>
            <p className="text-white/60 mb-6">Feel free to reach out to me</p>

            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-white font-medium">danrillera.va@gmail.com</span>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText('danrillera.va@gmail.com');
              }}
              className="mt-4 text-sm text-accent hover:text-white transition-colors"
            >
              Click to copy email
            </button>
          </div>
        </div>
      )}

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
