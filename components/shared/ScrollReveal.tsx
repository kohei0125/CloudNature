"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

const variantMap: Record<string, Variants> = {
  "fade-up": {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  },
  "fade-left": {
    hidden: { opacity: 0, x: -32 },
    visible: { opacity: 1, x: 0 },
  },
  "fade-right": {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0 },
  },
};

const containerVariants: Variants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: { staggerChildren: stagger },
  }),
};

interface ScrollRevealProps {
  children: ReactNode;
  variant?: "fade-up" | "fade-left" | "fade-right";
  delay?: number;
  stagger?: number;
  className?: string;
}

const ScrollReveal = ({
  children,
  variant = "fade-up",
  delay = 0,
  stagger = 0,
  className,
}: ScrollRevealProps) => {
  if (stagger > 0) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        custom={stagger}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={variantMap[variant]}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ScrollRevealItemProps {
  children: ReactNode;
  variant?: "fade-up" | "fade-left" | "fade-right";
  className?: string;
}

const ScrollRevealItem = ({
  children,
  variant = "fade-up",
  className,
}: ScrollRevealItemProps) => {
  return (
    <motion.div
      variants={variantMap[variant]}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export { ScrollReveal, ScrollRevealItem };
