"use client";

import { motion } from "framer-motion";

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6 flex flex-wrap items-end justify-between gap-4"
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-gradient-soft">
            <Icon className="h-6 w-6 text-brand-violet-soft" />
          </span>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-head md:text-3xl">
            {title}
          </h1>
          {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </motion.div>
  );
}
