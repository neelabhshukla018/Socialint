"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

interface CustomSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: (CustomSelectOption | string)[];
  placeholder?: string;
  className?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

export default function CustomSelect({
  id,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className = "",
  icon: LeadIcon,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to CustomSelectOption objects
  const normalizedOptions: CustomSelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="
          flex
          w-full
          items-center
          justify-between
          gap-2
          rounded-xl
          border
          border-zinc-200
          dark:border-zinc-700
          bg-white
          dark:bg-zinc-800/80
          px-3.5
          py-2.5
          text-left
          text-xs
          sm:text-sm
          font-medium
          text-zinc-900
          dark:text-zinc-100
          shadow-2xs
          outline-none
          transition-all
          duration-150
          hover:border-[#457B9D]/60
          dark:hover:border-[#457B9D]/60
          focus:border-[#457B9D]
          focus:ring-2
          focus:ring-[#457B9D]/20
        "
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1 truncate">
          {LeadIcon && (
            <LeadIcon size={16} className="text-zinc-400 dark:text-zinc-500 shrink-0" />
          )}
          {selectedOption?.icon && (
            <selectedOption.icon size={16} className="text-[#457B9D] shrink-0" />
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown
          size={16}
          className={`text-zinc-400 dark:text-zinc-500 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#457B9D]" : ""
          }`}
        />
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="
            absolute
            left-0
            right-0
            top-full
            z-50
            mt-1.5
            max-h-64
            overflow-y-auto
            rounded-2xl
            border
            border-zinc-200
            dark:border-zinc-700
            bg-white
            dark:bg-zinc-900
            p-1.5
            shadow-xl
            backdrop-blur-md
            animate-fadeIn
          "
        >
          {normalizedOptions.map((option) => {
            const isSelected = option.value === value;
            const OptIcon = option.icon;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                className={`
                  flex
                  w-full
                  items-center
                  justify-between
                  gap-2
                  rounded-xl
                  px-3
                  py-2
                  text-left
                  text-xs
                  sm:text-sm
                  transition-colors
                  duration-150
                  ${
                    isSelected
                      ? "bg-[#457B9D]/10 dark:bg-[#457B9D]/20 text-[#457B9D] font-semibold"
                      : "text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
                  }
                `}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {OptIcon && (
                    <OptIcon
                      size={15}
                      className={isSelected ? "text-[#457B9D]" : "text-zinc-400"}
                    />
                  )}
                  <div className="min-w-0 truncate">
                    <p className="truncate font-medium">{option.label}</p>
                    {option.description && (
                      <p className="text-[11px] text-zinc-400 truncate">
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <Check size={15} strokeWidth={2.5} className="text-[#457B9D] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
