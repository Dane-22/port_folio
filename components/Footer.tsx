"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MagneticButton } from "./MagneticButton";

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="relative py-32 px-4 md:px-8 lg:px-16 border-t border-white/10"
    >
      <div ref={contentRef} className="max-w-6xl mx-auto text-center">
        {/* CTA Heading */}
        <p className="text-accent text-sm font-medium tracking-wider uppercase mb-4">
          Let&apos;s Connect
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-3xl mx-auto">
          Ready to level up?
        </h2>
        <p className="text-xl md:text-2xl text-foreground/70 mb-10 max-w-2xl mx-auto">
          Drop a message — Let&apos;s build something extraordinary together.
        </p>

        {/* CTA Button */}
        <MagneticButton className="text-lg">
          Get in Touch
        </MagneticButton>

        {/* Automation Flex Micro-copy */}
        <p className="mt-12 text-xs text-foreground/40 tracking-wide">
          Built with a custom automated workflow.
        </p>

        {/* Footer bottom */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground/50">
            © 2024 Visual Developer. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-foreground/50 hover:text-accent transition-colors duration-300"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-sm text-foreground/50 hover:text-accent transition-colors duration-300"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-sm text-foreground/50 hover:text-accent transition-colors duration-300"
            >
              LinkedIn
            </a>
            <a
              href="#"
              className="text-sm text-foreground/50 hover:text-accent transition-colors duration-300"
            >
              Dribbble
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
