"use client";
import React, { useId, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const SparklesCore = (props: ParticlesProps) => {
  const { id, className, background, minSize, maxSize, speed, particleColor, particleDensity } = props;
  const [init, setInit] = useState(false);
  const controls = useAnimation();
  const generatedId = useId();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  return (
    <motion.div animate={controls} className={cn("opacity-0", className)}>
      {init && (
        <Particles
          id={id || generatedId}
          className="h-full w-full"
          particlesLoaded={async (container) => {
            if (container) controls.start({ opacity: 1, transition: { duration: 1 } });
          }}
          options={{
            background: { color: { value: background || "transparent" } },
            fullScreen: { enable: false, zIndex: 1 },
            fpsLimit: 120,
            particles: {
              color: { value: particleColor || "#C00000" },
              move: {
                direction: "none",
                enable: true,
                outModes: { default: "out" },
                speed: { min: 0.1, max: speed || 0.8 },
              },
              number: {
                density: { enable: true, width: 400, height: 400 },
                value: particleDensity || 80,
              },
              opacity: {
                value: { min: 0.1, max: 0.8 },
                animation: { enable: true, speed: 2, sync: false },
              },
              shape: { type: "circle" },
              size: { value: { min: minSize || 1, max: maxSize || 3 } },
              links: { enable: false },
            },
            detectRetina: true,
            interactivity: {
              events: {
                onClick: { enable: true, mode: "push" },
                onHover: { enable: false },
              },
              modes: { push: { quantity: 4 } },
            },
          }}
        />
      )}
    </motion.div>
  );
};