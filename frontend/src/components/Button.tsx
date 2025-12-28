import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function Button({ variant = "primary", className = "", ...props }: Props) {
  const base =
    "w-full rounded-xl px-4 py-3 font-medium transition focus:outline-none focus:ring-2 focus:ring-brand-primary/40";
  const styles =
    variant === "primary"
      ? "bg-brand-primary text-black hover:brightness-95"
      : "bg-brand-secondary text-black hover:brightness-95";

  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
