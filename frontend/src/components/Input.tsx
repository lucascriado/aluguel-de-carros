import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export default function Input({ label, className = "", ...props }: Props) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-brand-secondary">{label}</span>
      <input
        className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 ${className}`}
        {...props}
      />
    </label>
  );
}
