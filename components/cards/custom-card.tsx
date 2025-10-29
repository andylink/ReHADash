"use client";

import React from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Trash2, Package, Recycle } from "lucide-react";

export function CustomCard({
  config,
  rounded = "default",
}: {
  config: any;
  rounded?: "default" | "top" | "bottom" | "left" | "right" | "none";
}) {
  // Helper to get rounded class
  const getRoundedClass = () => {
    switch (rounded) {
      case "top":
        return "rounded-t-lg rounded-b-none";
      case "bottom":
        return "rounded-b-lg rounded-t-none";
      case "left":
        return "rounded-l-lg rounded-r-none";
      case "right":
        return "rounded-r-lg rounded-l-none";
      case "none":
        return "rounded-none";
      default:
        return "rounded-lg";
    }
  };

  // Use useEntity hook to fetch entity data from Home Assistant
  // Only pass entity id in config
  // eslint-disable-next-line
  // @ts-ignore
  const { entity, loading } = require("@/lib/ha-context").useEntity(
    config.entity
  );

  // Example: render a clock widget
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (config.widget === "clock") {
    return (
      <Card className={cn("h-full flex flex-col", getRoundedClass())}>
        {config.name && <CardTitle>{config.name}</CardTitle>}
        <CardContent>
          <div
            style={{
              color: config.options?.color || "#333",
              fontSize: config.options?.fontSize || "1.5rem",
              textAlign: "center",
            }}
          >
            {time.toLocaleTimeString([], {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
            <div
              style={{
                fontSize: "1rem",
                color: config.options?.dateColor || "#666",
                marginTop: "0.5em",
              }}
            >
              {time.toLocaleDateString([], {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (config.widget === "bin-collection") {
    // Fallback if entity not found
    if (!entity) {
      return (
        <Card className={cn("h-full flex flex-col", getRoundedClass())}>
          {config.name && <CardTitle>{config.name}</CardTitle>}
          <CardContent>
            <div className="text-muted-foreground">No bin data available</div>
          </CardContent>
        </Card>
      );
    }
    let parsedState: Record<string, string> = {};
    try {
      parsedState = entity.state ? JSON.parse(entity.state) : {};
    } catch {
      parsedState = {};
    }
    const rawData: Record<string, string> = entity.attributes?.raw_data || {};
    const bins = [
      {
        key: "General Waste",
        color: "#64748b",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
        icon: Trash2,
        iconBg: "bg-slate-500",
      },
      {
        key: "Bulky Collection",
        color: "#a67c52",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        icon: Package,
        iconBg: "bg-amber-600",
      },
      {
        key: "Recycling",
        color: "#10b981",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        icon: Recycle,
        iconBg: "bg-emerald-500",
      },
    ];
    // Helper to calculate days until a date
    const getDaysUntil = (dateStr: string) => {
      if (!dateStr) return null;
      // Accept both DD/MM/YYYY and YYYY-MM-DD
      let date;
      if (/\d{2}\/\d{2}\/\d{4}/.test(dateStr)) {
        const [d, m, y] = dateStr.split("/").map(Number);
        date = new Date(y, m - 1, d);
      } else if (/\d{4}-\d{2}-\d{2}/.test(dateStr)) {
        date = new Date(dateStr);
      } else {
        return null;
      }
      const now = new Date();
      // Zero out time for today
      now.setHours(0, 0, 0, 0);
      const diff = Math.ceil(
        (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diff >= 0 ? diff : null;
    };

    // Get urgency label
    const getUrgencyLabel = (days: number | null) => {
      if (days === null) return null;
      if (days === 0) return "Today";
      if (days === 1) return "Tomorrow";
      return null;
    };

    return (
      <Card className={cn("h-full flex flex-col", getRoundedClass())}>
        {config.name && (
          <CardTitle className="flex items-center gap-1 text-sm">
            <Recycle className="w-4 h-4" />
            {config.name}
          </CardTitle>
        )}
        <CardContent className="flex-1 p-1">
          <div className="space-y-1">
            {bins.map((bin) => {
              const dateStr = parsedState[bin.key] || rawData[bin.key] || "";
              const days = getDaysUntil(dateStr);
              const urgencyLabel = getUrgencyLabel(days);
              const Icon = bin.icon;

              return (
                <div
                  key={bin.key}
                  className={cn(
                    "group relative overflow-hidden rounded border transition-all duration-200 hover:shadow-sm",
                    bin.borderColor,
                    bin.bgColor
                  )}
                >
                  <div className="flex items-center gap-1 p-1">
                    {/* Icon with days badge */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={cn(
                          "flex items-center justify-center w-7 h-7 rounded transition-transform duration-200 group-hover:scale-105",
                          bin.iconBg
                        )}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      {days !== null && (
                        <div
                          className={cn(
                            "absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold text-white shadow",
                            days === 0
                              ? "bg-red-500 animate-pulse"
                              : days === 1
                              ? "bg-orange-500"
                              : "bg-blue-500"
                          )}
                        >
                          {days}
                        </div>
                      )}
                    </div>

                    {/* Bin info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-0.5">
                        <h3
                          className="font-semibold text-xs"
                          style={{ color: bin.color }}
                        >
                          {bin.key}
                        </h3>
                        {urgencyLabel && (
                          <span
                            className={cn(
                              "px-1 py-0.5 text-[9px] font-medium rounded-full",
                              days === 0
                                ? "bg-red-100 text-red-700"
                                : "bg-orange-100 text-orange-700"
                            )}
                          >
                            {urgencyLabel}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        {dateStr ? (
                          <>
                            <span className="font-medium">{dateStr}</span>
                            {days !== null && days > 1 && (
                              <span className="text-[9px]">
                                • in {days} days
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-muted-foreground/60 text-[9px]">
                            No collection scheduled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className={cn("h-full flex flex-col", getRoundedClass())}>
      {config.name && <CardTitle>{config.name}</CardTitle>}
      <CardContent>Custom Card</CardContent>
    </Card>
  );
}
