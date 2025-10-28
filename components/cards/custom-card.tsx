import React from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

  // Example: render a clock widget
  if (config.widget === "clock") {
    const [time, setTime] = React.useState(new Date());
    React.useEffect(() => {
      const interval = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(interval);
    }, []);
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
  // Add more widgets or custom rendering logic here
  return (
    <Card className={cn("h-full flex flex-col", getRoundedClass())}>
      {config.name && <CardTitle>{config.name}</CardTitle>}
      <CardContent>Custom Card</CardContent>
    </Card>
  );
}
