"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "./Input";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SearchableSelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  loading?: boolean;
  name?: string;
}

export function SearchableSelect({
  label,
  placeholder = "Search...",
  options,
  value,
  onChange,
  error,
  loading = false,
  name,
}: SearchableSelectProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);
  const filtered = options.filter(
    (o) =>
      o.label.toLowerCase().includes(query.toLowerCase()) ||
      o.description?.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative w-full" ref={ref}>
      {name && value && <input type="hidden" name={name} value={value} />}
      {label && <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm text-left bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-400" : "border-gray-200"
        }`}
      >
        <span className={selected ? "text-gray-900" : "text-gray-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <span className="text-gray-400">▾</span>
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="p-2">
            <Input
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          <ul className="max-h-48 overflow-y-auto">
            {loading && (
              <li className="px-4 py-3 text-sm text-gray-400">Loading...</li>
            )}
            {!loading && filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-400">No results</li>
            )}
            {filtered.map((opt) => (
              <li
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); setQuery(""); }}
                className={`cursor-pointer px-4 py-2.5 text-sm hover:bg-blue-50 ${
                  opt.value === value ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700"
                }`}
              >
                <div>{opt.label}</div>
                {opt.description && <div className="text-xs text-gray-400">{opt.description}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
