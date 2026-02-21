"use client";

import { useEffect, useRef } from "react";
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
    }, navRef);

    return () => ctx.revert();
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-8 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="relative flex items-center gap-8 px-8 py-4">
        {/* Left border gradient */}
        <div
          ref={leftBorderRef}
          className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"
        />

        {/* Right border gradient */}
        <div
          ref={rightBorderRef}
          className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"
        />

        {/* Nav links */}
        {navLinks.map((link, index) => (
          <a
            key={link.label}
            ref={(el) => { linksRef.current[index] = el; }}
            href={link.href}
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors duration-300 relative group"
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
          </a>
        ))}
      </div>
    </nav>
  );
}
