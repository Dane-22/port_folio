"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MagneticButton } from "./MagneticButton";

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content fade in
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Split heading into words for staggered animation
      if (headingRef.current) {
        const text = headingRef.current.textContent || "";
        headingRef.current.innerHTML = text
          .split(" ")
          .map((word) => `<span class="inline-block overflow-hidden"><span class="inline-block word-reveal">${word}</span></span>`)
          .join(" ");

        gsap.fromTo(
          ".word-reveal",
          { y: 100, opacity: 0, rotateX: -90 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Glow pulse animation
      gsap.to(glowRef.current, {
        scale: 1.2,
        opacity: 0.15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="relative py-32 px-4 md:px-8 lg:px-16 overflow-hidden"
    >
      {/* Animated background glow */}
      <div
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/20 blur-[120px] pointer-events-none"
      />
      
      {/* Secondary glow spots */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-accent/10 blur-[60px] animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-accent/10 blur-[60px] animate-pulse" style={{ animationDelay: "1s" }} />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-accent/40"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 30}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-30px) scale(1.2); opacity: 0.8; }
        }
      `}</style>

      <div ref={contentRef} className="relative z-10 max-w-6xl mx-auto text-center">
        {/* CTA Heading */}
        <div className="mb-4">
          <p className="text-accent text-sm font-medium tracking-wider uppercase mb-4 flex items-center justify-center gap-2">
            <span className="w-8 h-[1px] bg-accent/60" />
            Let&apos;s Connect
            <span className="w-8 h-[1px] bg-accent/60" />
          </p>
        </div>
        
        <h2
          ref={headingRef}
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 max-w-4xl mx-auto perspective-1000"
        >
          Ready to level up?
        </h2>
        
        <p className="text-xl md:text-2xl text-foreground/70 mb-12 max-w-2xl mx-auto leading-relaxed">
          Drop a message — Let&apos;s build something{" "}
          <span className="text-accent font-medium">extraordinary</span> together.
        </p>

        {/* CTA Button with enhanced styling */}
        <div className="relative inline-block group">
          <div className="absolute inset-0 bg-accent/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <MagneticButton className="relative text-lg bg-accent text-white px-10 py-4 rounded-full font-medium shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:shadow-xl transition-all duration-300">
            Get in Touch
          </MagneticButton>
        </div>

        {/* Automation Flex Micro-copy */}
        <p className="mt-16 text-xs text-foreground/40 tracking-wide">
          Built with a custom automated workflow.
        </p>

        {/* Footer bottom */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground/50">
            © 2024 Visual Developer. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {["Twitter", "GitHub", "LinkedIn", "Dribbble"].map((social, i) => (
              <a
                key={social}
                href="#"
                className="relative text-sm text-foreground/50 hover:text-accent transition-all duration-300 group"
              >
                <span className="relative z-10">{social}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
