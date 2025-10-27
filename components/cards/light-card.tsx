"use client";

import { useHomeAssistant } from "@/lib/ha-context";
import type { LightCardConfig } from "@/types/card-types";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Lightbulb, Power, Sun, Droplet, Palette } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface LightCardProps {
  config: LightCardConfig;
}

export function LightCard({ config }: LightCardProps) {
  const { getEntity, callService } = useHomeAssistant();
  const [activeControl, setActiveControl] = useState<
    "brightness" | "hue" | "saturation"
  >("brightness");

  const isGroup = config.entityIds && config.entityIds.length > 0;
  const entities = isGroup
    ? config.entityIds!.map((id) => getEntity(id)).filter(Boolean)
    : [getEntity(config.entity)].filter(Boolean);

  const [groupBrightness, setGroupBrightness] = useState(100);
  const [groupColor, setGroupColor] = useState({ h: 30, s: 80 });

  // Sync brightness and color with entity changes
  useEffect(() => {
    if (!isGroup && primaryEntity) {
      // Brightness
      const newBrightness = primaryEntity.attributes.brightness
        ? Math.round((primaryEntity.attributes.brightness / 255) * 100)
        : 100;
      setGroupBrightness(newBrightness);

      // Color
      const hs = primaryEntity.attributes.hs_color;
      if (hs && Array.isArray(hs)) {
        setGroupColor({ h: Math.round(hs[0]), s: Math.round(hs[1]) });
      }
    }
    // For groups, you may want to calculate average or representative values
    // ...optional group sync logic...
  }, [
    isGroup,
    entities.length > 0 ? entities[0]?.attributes.brightness : undefined,
    entities.length > 0 ? entities[0]?.attributes.hs_color : undefined,
  ]);

  if (entities.length === 0) return null;

  // Use first entity as representative
  const primaryEntity = entities[0]!;
  const isOn = entities.some((e) => e.state === "on");
  const allOn = entities.every((e) => e.state === "on");

  const brightness = isGroup
    ? groupBrightness
    : primaryEntity.attributes.brightness
    ? Math.round((primaryEntity.attributes.brightness / 255) * 100)
    : 100;

  const name =
    config.name ||
    (isGroup
      ? "Light Group"
      : primaryEntity.attributes.friendly_name || config.entity);

  const iconColor =
    config.use_light_color && isOn
      ? "text-amber-500"
      : config.icon_color || "text-blue-500";

  const showControls = isOn || !config.collapsible_controls;

  const getPrimaryInfo = () => {
    switch (config.primary_info || "name") {
      case "name":
        return name;
      case "state":
        return isOn ? (allOn ? "All On" : "Some On") : "Off";
      case "last-changed":
        return formatDistanceToNow(new Date(primaryEntity.last_changed), {
          addSuffix: true,
        });
      case "last-updated":
        return formatDistanceToNow(new Date(primaryEntity.last_updated), {
          addSuffix: true,
        });
      case "none":
        return null;
    }
  };

  const getSecondaryInfo = () => {
    switch (config.secondary_info || "state") {
      case "name":
        return name;
      case "state":
        return isGroup
          ? `${entities.filter((e) => e.state === "on").length}/${
              entities.length
            } on`
          : isOn
          ? "On"
          : "Off";
      case "last-changed":
        return formatDistanceToNow(new Date(primaryEntity.last_changed), {
          addSuffix: true,
        });
      case "last-updated":
        return formatDistanceToNow(new Date(primaryEntity.last_updated), {
          addSuffix: true,
        });
      case "brightness":
        return [groupBrightness + "%"];
      case "none":
        return null;
    }
  };

  const layoutClass =
    config.layout === "vertical"
      ? "flex-col items-start"
      : config.layout === "horizontal"
      ? "flex-row items-center justify-between"
      : "flex-col";

  // === HANDLERS ===

  const handleBrightnessCommit = (newBrightness: number) => {
    if (isGroup) {
      entities.forEach((entity) => {
        callService("light", "turn_on", entity.entity_id, {
          brightness_pct: newBrightness,
        });
      });
    } else {
      callService("light", "turn_on", config.entity, {
        brightness_pct: newBrightness,
      });
    }
  };

  const handleColorCommit = (h: number, s: number) => {
    if (isGroup) {
      entities.forEach((entity) => {
        callService("light", "turn_on", entity.entity_id, { hs_color: [h, s] });
      });
    } else {
      callService("light", "turn_on", config.entity, { hs_color: [h, s] });
    }
  };

  const handleToggle = () => {
    const action = config.tap_action || "toggle";
    if (action === "toggle") {
      if (isGroup) {
        const targetState = !allOn;
        entities.forEach((entity) => {
          callService(
            "light",
            targetState ? "turn_on" : "turn_off",
            entity.entity_id
          );
        });
      } else {
        callService("light", isOn ? "turn_off" : "turn_on", config.entity);
      }
    }
  };

  // === RENDER ===

  // Determine slider props based on active control
  let sliderValue = [groupBrightness];
  let sliderMax = 100;
  let sliderStep = 1;
  let sliderProps: any = {};
  let sliderLabel = "Brightness";

  if (activeControl === "hue") {
    sliderValue = [groupColor.h];
    sliderMax = 360;
    sliderLabel = "Hue";
    sliderProps.hue = true;
  } else if (activeControl === "saturation") {
    sliderValue = [groupColor.s];
    sliderMax = 100;
    sliderLabel = "Saturation";
  }

  // Handler for slider value change
  const handleSliderChange = (v: number[]) => {
    if (activeControl === "brightness") {
      setGroupBrightness(v[0]);
    } else if (activeControl === "hue") {
      setGroupColor({ h: v[0], s: groupColor.s });
    } else if (activeControl === "saturation") {
      setGroupColor({ h: groupColor.h, s: v[0] });
    }
  };

  // Handler for slider commit
  const handleSliderCommit = (v: number[]) => {
    if (activeControl === "brightness") {
      handleBrightnessCommit(v[0]);
    } else if (activeControl === "hue") {
      handleColorCommit(v[0], groupColor.s);
    } else if (activeControl === "saturation") {
      handleColorCommit(groupColor.h, v[0]);
    }
  };

  return (
    <Card
      className={cn(
        "p-4 h-full flex flex-col transition-all",
        config.fill_container && "h-full",
        isOn && "bg-card/80"
      )}
    >
      <div className={cn("flex gap-4 flex-1", layoutClass)}>
        {/* --- ICON + INFO + POWER --- */}
        <div className="flex items-center gap-3 flex-1">
          {config.icon_type !== "none" && (
            <button
              onClick={handleToggle}
              className={cn(
                "p-3 rounded-lg transition-colors",
                isOn ? "bg-primary/10" : "bg-muted"
              )}
            >
              <Lightbulb className={cn("h-5 w-5", isOn && iconColor)} />
            </button>
          )}
          <div className="flex-1">
            <div className="font-medium text-foreground">
              {getPrimaryInfo()}
            </div>
            {getSecondaryInfo() && (
              <div className="text-sm text-muted-foreground">
                {getSecondaryInfo()}
              </div>
            )}
          </div>
          <button
            onClick={handleToggle}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isOn ? "bg-primary text-primary-foreground" : "bg-muted"
            )}
          >
            <Power className="h-4 w-4" />
          </button>
        </div>

        {/* --- SINGLE SLIDER WITH CONTROL ICONS --- */}
        {showControls && (
          <div className="w-full">
            <div className="flex items-center gap-4">
              {/* Slider and label */}
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-1">
                  {/* <span className="text-muted-foreground">{sliderLabel}</span> */}
                  {/* <span className="text-foreground font-medium"> */}
                  {/* {activeControl === "brightness" && `${groupBrightness}%`} */}
                  {/* {activeControl === "hue" && `${groupColor.h}°`} */}
                  {/* {activeControl === "saturation" && `${groupColor.s}%`} */}
                  {/* </span> */}
                </div>
                <Slider
                  value={sliderValue}
                  onValueChange={handleSliderChange}
                  onValueCommit={handleSliderCommit}
                  max={sliderMax}
                  step={sliderStep}
                  className="w-full"
                  {...sliderProps}
                />
              </div>
              {/* Icons horizontally to the right of the slider */}
              <div className="flex gap-2 pl-2">
                <button
                  className={cn(
                    "p-2 rounded-full",
                    activeControl === "brightness"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                  onClick={() => setActiveControl("brightness")}
                  aria-label="Brightness"
                >
                  <Sun className="w-5 h-5" />
                </button>
                <button
                  className={cn(
                    "p-2 rounded-full",
                    activeControl === "hue"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                  onClick={() => setActiveControl("hue")}
                  aria-label="Hue"
                >
                  <Palette className="w-5 h-5" />
                </button>
                <button
                  className={cn(
                    "p-2 rounded-full",
                    activeControl === "saturation"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                  onClick={() => setActiveControl("saturation")}
                  aria-label="Saturation"
                >
                  <Droplet className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
