"use client";

import { useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

import { Loader } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader } from "./ui/card";

type Props = {
  index: number;
  started: boolean;
};

const LOADER_TIME = 1;
const BAR_TIME = 0.5;
const STEP_GAP = 0.1;

const STEP_DURATION = LOADER_TIME + BAR_TIME + STEP_GAP;

export function GettingStartedList({
  steps,
}: {
  steps: { title: string; description: string }[];
}) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(triggerRef, { once: true, margin: "-40px" });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (isInView) setStarted(true);
  }, [isInView]);

  return (
    <div
      ref={triggerRef}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
    >
      {steps.map((step, index) => (
        <Card
          className="pb-0 pt-1.5 bg-transparent ring-0 shadow-none"
          key={step.title + index}
        >
          <GettingStartedProgress key={index} index={index} started={started} />
          <CardHeader className="px-0">
            <span className="size-12 font-semibold text-lg inline-flex items-center justify-center bg-background text-highlight">
              {`${index + 1}`.padStart(2, "0")}
            </span>
          </CardHeader>
          <CardContent className="space-y-3 px-0">
            <h3 className="text-xl font-medium font-heading">{step.title}</h3>
            <p className="opacity-80 text-base">{step.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function GettingStartedProgress({ index, started }: Props) {
  const baseDelay = index * STEP_DURATION;

  return (
    <div className="flex gap-2 items-center">
      {/* ICON */}
      <div className="relative size-6 flex items-center justify-center">
        {/* PLACEHOLDER */}
        <motion.div
          className="absolute size-5 rounded-full bg-foreground/20"
          initial={{ opacity: 1 }}
          animate={started ? { opacity: 0 } : { opacity: 1 }}
          transition={{ delay: baseDelay, duration: 0.15 }}
        />

        {/* LOADER */}
        <motion.div
          className="absolute"
          initial={{ opacity: 0 }}
          animate={started ? { opacity: [0, 1, 0] } : { opacity: 0 }}
          transition={{ delay: baseDelay, duration: LOADER_TIME }}
        >
          <Loader className="size-5 animate-spin text-highlight" />
        </motion.div>

        {/* CHECK */}
        <motion.svg
          viewBox="0 0 24 24"
          className="absolute size-6 fill-primary"
          initial={{ scale: 0, opacity: 0 }}
          animate={
            started ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
          }
          transition={{
            delay: baseDelay + LOADER_TIME,
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
        </motion.svg>
      </div>

      {/* PROGRESS BAR */}
      <div className="h-1 flex-1 rounded-full bg-foreground/20 overflow-hidden">
        <motion.div
          className="h-full bg-highlight origin-left"
          initial={{ scaleX: 0 }}
          animate={started ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{
            delay: baseDelay + LOADER_TIME,
            duration: BAR_TIME,
            ease: "easeOut",
          }}
        />
      </div>
    </div>
  );
}
