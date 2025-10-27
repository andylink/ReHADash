"use client";

import { useHomeAssistant } from "@/lib/ha-context";
import type { LightCardConfig } from "@/types/card-types";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Lightbulb, Power } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface LightCardProps {
  config: LightCardConfig;
}

export function LightCard({ config }: LightCardProps) {
  const { getEntity, callService } = useHomeAssistant();

  const isGroup = config.entityIds && config.entityIds.length > 0;
  const entities = isGroup
    ? config.entityIds!.map((id) => getEntity(id)).filter(Boolean)
    : [getEntity(config.entity)].filter(Boolean);

  const [groupBrightness, setGroupBrightness] = useState(100);
  const [groupColor, setGroupColor] = useState({ h: 30, s: 80 });

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

        {/* --- BRIGHTNESS CONTROL --- */}
        {showControls && config.show_brightness_control && (
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Brightness</span>
              <span className="text-foreground font-medium">{brightness}%</span>
            </div>
            <Slider
              value={[groupBrightness]}
              onValueChange={(v) => setGroupBrightness(v[0])}
              onValueCommit={(v) => handleBrightnessCommit(v[0])}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        )}

        {/* --- COLOR CONTROL --- */}
        {showControls && config.show_color_control && (
          <div className="w-full space-y-2">
            <div className="text-sm text-muted-foreground">Color</div>
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Hue</div>
                <Slider
                  value={[groupColor.h]}
                  onValueChange={(v) =>
                    setGroupColor({ h: v[0], s: groupColor.s })
                  }
                  onValueCommit={(v) => handleColorCommit(v[0], groupColor.s)}
                  max={360}
                  step={1}
                />
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">
                  Saturation
                </div>
                <Slider
                  value={[groupColor.s]}
                  onValueChange={(v) =>
                    setGroupColor({ h: groupColor.h, s: v[0] })
                  }
                  onValueCommit={(v) => handleColorCommit(groupColor.h, v[0])}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
