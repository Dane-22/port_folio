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
      {/* Tech Stack Section - Now First */}
      <div className="py-20 px-4 md:px-8 lg:px-16">
        {/* Tech Stack - Categorized in Containers */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            { category: "Frontend", gradient: "from-blue-500/20 to-cyan-500/20", techs: [
              { name: "React", icon: "⚛️", bg: "bg-blue-500/30" },
              { name: "TypeScript", icon: "📘", bg: "bg-blue-600/30" },
              { name: "JavaScript", icon: "📜", bg: "bg-yellow-500/30" },
              { name: "HTML", icon: "🌐", bg: "bg-orange-500/30" },
              { name: "CSS", icon: "🎨", bg: "bg-blue-400/30" },
              { name: "Tailwind CSS", icon: "🌊", bg: "bg-cyan-500/30" },
            ]},
            { category: "Backend", gradient: "from-green-500/20 to-emerald-500/20", techs: [
              { name: "Node.js", icon: "🟢", bg: "bg-green-500/30" },
              { name: "PHP", icon: "🐘", bg: "bg-indigo-500/30" },
              { name: "Express.js", icon: "🚂", bg: "bg-gray-500/30" },
            ]},
            { category: "Database", gradient: "from-amber-500/20 to-orange-500/20", techs: [
              { name: "PostgreSQL", icon: "🐘", bg: "bg-blue-500/30" },
              { name: "MySQL", icon: "🐬", bg: "bg-orange-500/30" },
              { name: "MongoDB", icon: "🍃", bg: "bg-green-500/30" },
              { name: "Supabase", icon: "⚡", bg: "bg-emerald-500/30" },
            ]},
            { category: "CRM", gradient: "from-red-500/20 to-pink-500/20", techs: [
              { name: "GoHighLevel", icon: "📈", bg: "bg-red-500/30" },
              { name: "HubSpot", icon: "🔶", bg: "bg-orange-500/30" },
            ]},
            { category: "Deployment and Hosting", gradient: "from-purple-500/20 to-violet-500/20", techs: [
              { name: "Git", icon: "🔀", bg: "bg-red-500/30" },
              { name: "Vercel", icon: "▲", bg: "bg-black/50" },
              { name: "Next.js", icon: "▶️", bg: "bg-white/20" },
              { name: "GSAP", icon: "🎬", bg: "bg-green-500/30" },
            ]},
          ].map(({ category, gradient, techs }, catIndex) => (
            <div
              key={category}
              className={`relative p-5 rounded-xl border border-white/10 backdrop-blur-md bg-gradient-to-br ${gradient} hover:border-white/40 hover:shadow-xl hover:shadow-accent/20 transition-all duration-500 group overflow-hidden`}
              style={{ animationDelay: `${catIndex * 100}ms` }}
            >
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
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
                    className={`group/tech inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-white/10 ${tech.bg} backdrop-blur-sm hover:scale-110 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 cursor-default`}
                    style={{ animationDelay: `${(catIndex * 100) + (techIndex * 50)}ms` }}
                  >
                    <span className="w-7 h-7 flex items-center justify-center rounded-md bg-black/30 text-lg group-hover/tech:scale-110 group-hover/tech:rotate-6 transition-transform duration-300">
                      {tech.icon}
                    </span>
                    <span className="font-medium text-white/90 group-hover/tech:text-white transition-colors">{tech.name}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
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
