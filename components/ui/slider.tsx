"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface SliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  hue?: boolean;
}

function Slider({
  className,
  value,
  min = 0,
  max = 100,
  hue = false,
  ...props
}: SliderProps) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={
          "relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-8 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-8"
        }
        style={
          hue
            ? {
                background:
                  "linear-gradient(90deg, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%))",
              }
            : undefined
        }
      >
        {!hue && (
          <SliderPrimitive.Range
            data-slot="slider-range"
            className={
              "bg-primary absolute rounded-full data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
            }
          />
        )}
      </SliderPrimitive.Track>
      {Array.isArray(value) &&
        value.map((_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className={cn(
              hue
                ? "block w-3 h-8 rounded bg-white border border-gray-300 shadow flex items-center justify-center"
                : "block size-0 shrink-0 rounded-full opacity-0 focus-visible:outline-hidden disabled:pointer-events-none"
            )}
          >
            {hue && (
              <span
                className="block w-0.5 h-3 bg-gray-500 rounded"
                style={{ marginLeft: "auto", marginRight: "auto" }}
              />
            )}
          </SliderPrimitive.Thumb>
        ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
