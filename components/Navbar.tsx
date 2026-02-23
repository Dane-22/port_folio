"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "#hero" },
  { label: "Works", href: "#works" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const leftBorderRef = useRef<HTMLDivElement>(null);
  const rightBorderRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Draw left and right borders from center
      tl.fromTo(
        [leftBorderRef.current, rightBorderRef.current],
        { scaleY: 0, transformOrigin: "center" },
        { scaleY: 1, duration: 0.8, stagger: 0.1 }
      );

      // Stagger menu links upwards
      tl.fromTo(
        linksRef.current.filter(Boolean),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
        "-=0.4"
      );

      // Subtle glow pulse
      gsap.to(glowRef.current, {
        opacity: 0.6,
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-8 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="relative flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-lg shadow-black/20">
        {/* Animated glow background */}
        <div
          ref={glowRef}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 opacity-40 blur-xl pointer-events-none"
        />
        
        {/* Left border gradient */}
        <div
          ref={leftBorderRef}
          className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-accent/40 to-transparent"
        />

        {/* Right border gradient */}
        <div
          ref={rightBorderRef}
          className="absolute right-0 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-accent/40 to-transparent"
        />

        {/* Nav links */}
        {navLinks.map((link, index) => (
          <a
            key={link.label}
            ref={(el) => { linksRef.current[index] = el; }}
            href={link.href}
            onClick={() => handleClick(index)}
            className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full group
              ${activeIndex === index 
                ? "text-white bg-white/10" 
                : "text-foreground/70 hover:text-white hover:bg-white/[0.05]"
              }`}
          >
            <span className="relative z-10">{link.label}</span>
            
            {/* Hover glow effect */}
            <span className={`absolute inset-0 rounded-full bg-accent/20 blur-md transition-opacity duration-300 ${activeIndex === index ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
            
            {/* Active indicator dot */}
            <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent transition-all duration-300 ${activeIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-0 group-hover:opacity-50 group-hover:scale-100"}`} />
          </a>
        ))}
      </div>
    </nav>
  );
}
