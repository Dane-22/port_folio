"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  image: string;
  description: string;
  link: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "JAJR",
    category: "Web Development",
    year: "2024",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop",
    description: "Attendance Web-Based Monitoring System for JaJr Construction",
    link: "https://jajr.xandree.com/",
  },
  {
    id: 2,
    title: "AFB Mangaan",
    category: "Dashboard UI",
    year: "2024",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop",
    description: "Interactive dashboard with modern data visualization for AFB Mangaan Church",
    link: "http://72.62.254.60:8083/",
  },
  {
    id: 3,
    title: "Helixia",
    category: "Web Application",
    year: "2024",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop",
    description: "Helixia is a Website for Virtual Assistant aspirant",
    link: "https://helixia-rouge.vercel.app/",
  },
  {
    id: 4,
    title: "Wedding RSVP System",
    category: "Web Application",
    year: "2024",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop",
    description: "A web-based RSVP system that uses Google Sheets as a database.",
    link: "https://rsvp-indol.vercel.app/",
  },
  // {
  //   id: 5,
  //   title: "Anniversary Gift",
  //   category: "Web Development",
  //   year: "2024",
  //   image: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&h=600&fit=crop",
  //   description: "A special web-based anniversary gift for my girlfriend.",
  //   link: "https://anniv-gules.vercel.app/",
  // },
];

function ProjectCard({ project, index, projectRef, textRef }: { project: Project, index: number, projectRef: any, textRef: any }) {
  const [isInteractive, setIsInteractive] = useState(false);

  return (
    <div
      ref={projectRef}
      className="relative flex-shrink-0 w-[80vw] md:w-[60vw] lg:w-[50vw] h-[70vh] group"
    >
      <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 backdrop-blur-md bg-white/5 transition-transform duration-500 group-hover:scale-[1.02]">

        {/* The Live Iframe (Background) */}
        <iframe
          src={project.link}
          className={`absolute inset-0 w-full h-full border-none transition-all duration-500 bg-white
            ${isInteractive ? 'pointer-events-auto scale-100' : 'pointer-events-none scale-105 opacity-60 group-hover:opacity-80'}
          `}
        />

        {/* Gradient overlay - stronger for text readability */}
        <div className={`absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20 transition-opacity duration-500
          ${isInteractive ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}
        `} />

        {/* Text content - overlaps the image with parallax */}
        <div
          ref={textRef}
          className={`absolute bottom-0 left-0 right-0 p-6 md:p-10 overflow-hidden transition-all duration-500 pointer-events-none
            ${isInteractive ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}
          `}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-accent text-xs font-medium tracking-wider uppercase">
              {project.category}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/40" />
            <span className="text-white/60 text-xs">{project.year}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight text-white drop-shadow-lg">
            {project.title}
          </h3>

          <p className="text-white/70 text-sm md:text-base max-w-md leading-relaxed">
            {project.description}
          </p>

          {/* View project link */}
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto mt-6 inline-flex items-center gap-2 text-accent hover:gap-4 transition-all duration-300"
          >
            <span className="text-sm font-medium">Open in new tab</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>

        {/* The Interaction Toggle Button */}
        <div className="absolute inset-0 pointer-events-none flex z-50">
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsInteractive(!isInteractive);
            }}
            className={`pointer-events-auto absolute rounded-full bg-accent text-white font-medium shadow-lg transition-all duration-500 hover:bg-accent/80 hover:scale-105 active:scale-95
              ${isInteractive
                ? 'top-4 right-4 px-4 py-2 text-sm backdrop-blur-md bg-background/80 border border-white/10 text-white'
                : 'bottom-8 right-8 px-6 py-3 md:bottom-10 md:right-10'
              }
            `}
          >
            {isInteractive ? 'Lock Preview' : 'Live Preview'}
          </button>
        </div>

      </div>
    </div>
  );
}

export function HorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const projectRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const trigger = triggerRef.current;
    const horizontal = horizontalRef.current;

    if (!section || !trigger || !horizontal) return;

    // Calculate the scroll distance
    const scrollWidth = horizontal.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      // Create the horizontal scroll animation
      const scrollTween = gsap.to(horizontal, {
        x: -scrollWidth,
        ease: "none",
        scrollTrigger: {
          trigger: trigger,
          start: "top top",
          end: () => `+=${scrollWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Parallax effect for project text - minimal movement for readability
      projectRefs.current.forEach((project, index) => {
        if (!project) return;
        const textEl = textRefs.current[index];
        if (!textEl) return;

        gsap.to(textEl, {
          x: -10,
          ease: "none",
          scrollTrigger: {
            trigger: project,
            containerAnimation: scrollTween,
            start: "left right",
            end: "right left",
            scrub: 0.5,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="works" className="relative">
      {/* Tech Stack Section - Now First */}
      <div className="py-20 px-4 md:px-8 lg:px-16">
        {/* Tech Stack Container - Bordered and distinct */}
        <div className="w-full mb-16 py-8 border-y border-white/20 bg-transparent backdrop-blur-sm">
          {/* Section Title */}
          <div className="mb-8 text-center">
            <p className="text-accent text-sm font-medium tracking-wider uppercase mb-2">
              Technologies
            </p>
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              Tech Stack
            </h3>
          </div>

          {/* Tech Stack - Categorized in Containers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                category: "Frontend", techs: [
                  { name: "React", icon: "⚛️" },
                  { name: "TypeScript", icon: "📘" },
                  { name: "JavaScript", icon: "📜" },
                  { name: "HTML", icon: "🌐" },
                  { name: "CSS", icon: "🎨" },
                  { name: "Tailwind CSS", icon: "🌊" },
                ]
              },
              {
                category: "Backend", techs: [
                  { name: "Node.js", icon: "🟢" },
                  { name: "PHP", icon: "🐘" },
                  { name: "Express.js", icon: "🚂" },
                ]
              },
              {
                category: "Database", techs: [
                  { name: "PostgreSQL", icon: "🐘" },
                  { name: "MySQL", icon: "🐬" },
                  { name: "MongoDB", icon: "🍃" },
                  { name: "Supabase", icon: "⚡" },
                ]
              },
              {
                category: "CRM", techs: [
                  { name: "GoHighLevel", icon: "📈" },
                  { name: "HubSpot", icon: "🔶" },
                  { name: "n8n", icon: "⚙️" },
                  { name: "Make.com", icon: "🛠️" },
                ]
              },
              {
                category: "Deployment and Hosting", techs: [
                  { name: "Git", icon: "🔀" },
                  { name: "Vercel", icon: "▲" },
                  { name: "Hostinger", icon: "🌐" },
                ]
              },
            ].map(({ category, techs }, catIndex) => (
              <div
                key={category}
                className="relative p-5 rounded-xl border-y border-white/10 bg-transparent backdrop-blur-sm hover:border-accent/40 hover:bg-white/[0.03] transition-all duration-500 group overflow-hidden"
                style={{ animationDelay: `${catIndex * 100}ms` }}
              >
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Category title */}
                <h3 className="relative text-accent text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  {category}
                </h3>

                {/* Tech items grid */}
                <div className="relative flex flex-wrap gap-3">
                  {techs.map((tech, techIndex) => (
                    <span
                      key={tech.name}
                      className="group/tech inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-white/10 bg-white/[0.05] hover:scale-110 hover:border-accent/50 hover:bg-white/10 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 cursor-default"
                      style={{ animationDelay: `${(catIndex * 100) + (techIndex * 50)}ms` }}
                    >
                      <span className="w-7 h-7 flex items-center justify-center rounded-md bg-white/10 text-lg group-hover/tech:scale-110 group-hover/tech:rotate-6 transition-transform duration-300">
                        {tech.icon}
                      </span>
                      <span className="font-medium text-white/80 group-hover/tech:text-white transition-colors">{tech.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section header - Now under tech stack */}
        <p className="text-accent text-sm font-medium tracking-wider uppercase mb-4">
          Selected Works
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          My Portfolio
        </h2>
      </div>

      {/* Horizontal scroll container */}
      <div ref={triggerRef} className="relative h-screen overflow-hidden">
        <div
          ref={horizontalRef}
          className="flex h-full items-center gap-8 px-8 md:px-16"
          style={{ width: "fit-content" }}
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              projectRef={(el: any) => { projectRefs.current[index] = el; }}
              textRef={(el: any) => { textRefs.current[index] = el; }}
            />
          ))}

          {/* End spacer */}
          <div className="flex-shrink-0 w-[20vw]" />
        </div>
      </div>
    </section>
  );
}
