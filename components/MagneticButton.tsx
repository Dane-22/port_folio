"use client";

import { useRef, useState } from "react";
import gsap from "gsap";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MagneticButton({ children, className = "", onClick }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(buttonRef.current, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!buttonRef.current) return;

    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.3,
      ease: "power2.out",
    });

    setIsHovered(false);
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`
        relative px-8 py-4 rounded-full
        bg-accent text-white font-medium
        transition-all duration-300
        ${isHovered ? "shadow-[0_0_40px_rgba(139,92,246,0.6)]" : "shadow-[0_0_20px_rgba(139,92,246,0.3)]"}
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
      {/* Glow effect */}
      <div
        className={`
          absolute inset-0 rounded-full
          bg-gradient-to-r from-accent to-violet-400
          opacity-0 transition-opacity duration-300
          ${isHovered ? "opacity-100" : ""}
          blur-xl -z-10
        `}
      />
    </button>
  );
}
