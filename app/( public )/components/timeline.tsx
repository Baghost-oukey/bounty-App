"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
} from "motion/react";
import {
  Rocket,
  Cpu,
  Target,
  Flag,
  LucideIcon,
} from "lucide-react";

interface TimelineItem {
  title: string;
  date: string;
  description: string;
  icon: LucideIcon;
}

const items: TimelineItem[] = [
  {
    title: "Phase I",
    date: "January 15, 2024",
    description: "Project initialization and strategic planning begins.",
    icon: Rocket,
  },
  {
    title: "Phase II",
    date: "March 10, 2024",
    description: "Detailed research and preliminary development stage.",
    icon: Cpu,
  },
  {
    title: "Phase III",
    date: "June 5, 2024",
    description: "Core implementation and major milestones achieved.",
    icon: Target,
  },
  {
    title: "Phase IV",
    date: "September 20, 2024",
    description: "Final refinements and project completion.",
    icon: Flag,
  },
];

export default function Timeline() {
  const sectionRef = useRef(null);

  const inView = useInView(sectionRef, {
    once: false,
    amount: 0.45,
  });

  return (
    <section
      ref={sectionRef}
      className="py-32"
    >
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="mb-20 text-5xl font-bold">
          Timeline
        </h2>

        <div className="relative">

          {/* Background */}

          <div className="absolute top-6 left-0 h-[2px] w-full bg-zinc-200" />

          {/* Animated */}

          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: inView ? "100%" : "0%",
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
            }}
            className="absolute top-6 left-0 h-[2px] bg-black"
          />

          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4">

            {items.map((item, index) => (
              <TimelineCard
                key={index}
                item={item}
                index={index}
                active={inView}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface CardProps {
  item: TimelineItem;
  index: number;
  active: boolean;
}

function TimelineCard({
  item,
  index,
  active,
}: CardProps) {

  const Icon = item.icon;

  return (
    <motion.div
      initial={{
        opacity: 0.3,
        y: 20,
      }}
      animate={{
        opacity: active ? 1 : 0.3,
        y: active ? 0 : 20,
      }}
      transition={{
        duration: 0.6,
        delay: index * 0.3,
      }}
    >
      <motion.div
        initial={{
          scale: 1,
        }}
        animate={{
          scale: active ? 1.15 : 1,
        }}
        transition={{
          delay: index * 0.3,
          type: "spring",
        }}
        className="mb-10 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-300 bg-white shadow"
      >
        <Icon size={18} />
      </motion.div>

      <p className="mb-2 text-sm text-zinc-500">
        {item.date}
      </p>

      <h3 className="mb-3 text-3xl font-bold">
        {item.title}
      </h3>

      <p className="text-zinc-600 leading-8">
        {item.description}
      </p>
    </motion.div>
  );
}