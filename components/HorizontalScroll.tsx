"use client";

import { useEffect, useRef } from "react";
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
    description: "Attendance Web-Based Monitoring System",
    link: "https://jajr.xandree.com/",
  },
  {
    id: 2,
    title: "AFB Mangaan",
    category: "Dashboard UI",
    year: "2024",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop",
    description: "Interactive dashboard with modern data visualization for AFB Mangaan Church",
    link: "https://afb-mangaan-jvl6jsoyh-dane-22s-projects.vercel.app/demo-dashboard.html",
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
];

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
      {/* Section header */}
      <div className="py-20 px-4 md:px-8 lg:px-16">
        <p className="text-accent text-sm font-medium tracking-wider uppercase mb-4">
          Selected Works
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          My Portfolio
        </h2>

        {/* Tech Stack - Categorized in Containers */}
        <div className="max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { category: "Frontend", techs: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS"] },
            { category: "Backend", techs: ["Node.js", "PHP", "Express.js"] },
            { category: "Database", techs: ["PostgreSQL", "MySQL", "MongoDB"] },
            { category: "CRM", techs: ["GoHighLevel", "HubSpot"] },
            { category: "Tools & Others", techs: ["Git", "Vercel", "Next.js", "GSAP"] },
          ].map(({ category, techs }) => (
            <div
              key={category}
              className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10 transition-all duration-300"
            >
              <h3 className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {techs.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-sm rounded-full border border-white/20 bg-white/5 text-white/80 hover:bg-accent/20 hover:border-accent/40 transition-all duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal scroll container */}
      <div ref={triggerRef} className="relative h-screen overflow-hidden">
        <div
          ref={horizontalRef}
          className="flex h-full items-center gap-8 px-8 md:px-16"
          style={{ width: "fit-content" }}
        >
          {projects.map((project, index) => (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              key={project.id}
              ref={(el) => { projectRefs.current[index] = el; }}
              className="relative flex-shrink-0 w-[80vw] md:w-[60vw] lg:w-[50vw] h-[70vh] group cursor-pointer"
            >
              {/* Project card with Notion-style overlap */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 backdrop-blur-md bg-white/5 transition-transform duration-500 group-hover:scale-[1.02]">
                {/* Image */}
                <div className="absolute inset-0">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                    sizes="(max-width: 768px) 80vw, (max-width: 1200px) 60vw, 50vw"
                  />
                </div>

                {/* Gradient overlay - stronger for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />

                {/* Text content - overlaps the image with parallax */}
                <div
                  ref={(el) => { textRefs.current[index] = el; }}
                  className="absolute bottom-0 left-0 right-0 p-6 md:p-10 overflow-hidden"
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
                  <div className="mt-6 flex items-center gap-2 text-accent group-hover:gap-4 transition-all duration-300">
                    <span className="text-sm font-medium">View Project</span>
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
                  </div>
                </div>
              </div>
            </a>
          ))}

          {/* End spacer */}
          <div className="flex-shrink-0 w-[20vw]" />
        </div>
      </div>
    </section>
  );
}
