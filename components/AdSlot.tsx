"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
  adCode?: string | null;
  format?: "banner" | "sidebar";
  className?: string;
}

export function AdSlot({ adCode, format = "banner", className = "" }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adCode || !containerRef.current) return;

    // Clear any previous content
    containerRef.current.innerHTML = "";

    // Create a wrapper and inject the ad HTML
    const wrapper = document.createElement("div");
    wrapper.innerHTML = adCode;

    // Execute any <script> tags inside the ad code
    const scripts = wrapper.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      // Copy all attributes
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      // Copy inline script content
      newScript.textContent = oldScript.textContent;
      oldScript.replaceWith(newScript);
    });

    containerRef.current.appendChild(wrapper);
  }, [adCode]);

  if (!adCode) {
    return (
      <div
        data-ad-slot={format}
        className={`bg-stone-100 border border-stone-200 border-dashed flex flex-col items-center justify-center text-stone-400 font-sans text-[10px] uppercase tracking-widest ${
          format === "banner" ? "w-full min-h-[120px]" : "w-full min-h-[250px]"
        } ${className}`}
      >
        Advertisement
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      data-ad-slot={format}
      className={`ad-container ${format} ${className}`}
    />
  );
}
