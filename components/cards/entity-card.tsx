"use client";

import { useHomeAssistant } from "@/lib/ha-context";
import type { EntityCardConfig, EntityCardEntity } from "@/types/card-types";
import { Card } from "@/components/ui/card";
import { Power, Droplet, Thermometer } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface EntityCardProps {
  config: EntityCardConfig;
  rounded?: "default" | "top" | "bottom" | "left" | "right" | "none";
}

const iconMap: Record<string, any> = {
  Power,
  Droplet,
  Thermometer,
  // Add more icons as needed
};

export function EntityCard({ config, rounded = "default" }: EntityCardProps) {
  const { getEntity, callService } = useHomeAssistant();
  const rawEntities =
    config.entities && config.entities.length > 0
      ? config.entities
      : [config.entity];

  const entityConfigs = rawEntities
    .filter(Boolean)
    .map((e) =>
      typeof e === "string" ? { entity: e } : (e as EntityCardEntity)
    );

  const entities = entityConfigs
    .map((e) => ({ ...e, data: getEntity(e.entity) }))
    .filter((e) => e.data);

  if (entities.length === 0) return null;

  const handleTap = (entityId: string, isActive: boolean) => {
    const action = config.tap_action || "more-info";
    if (action === "toggle") {
      const domain = entityId.split(".")[0];
      callService(domain, isActive ? "turn_off" : "turn_on", entityId);
    }
  };

  const getPrimaryInfo = (entity: any, customName?: string) => {
    const name =
      customName || entity.attributes.friendly_name || entity.entity_id;
    switch (config.primary_info || "name") {
      case "name":
        return name;
      case "state":
        return entity.state;
      case "last-changed":
        return formatDistanceToNow(new Date(entity.last_changed), {
          addSuffix: true,
        });
      case "last-updated":
        return formatDistanceToNow(new Date(entity.last_updated), {
          addSuffix: true,
        });
      case "none":
        return null;
    }
  };

  const getSecondaryInfo = (entity: any, customName?: string) => {
    const name =
      customName || entity.attributes.friendly_name || entity.entity_id;
    switch (config.secondary_info || "state") {
      case "name":
        return name;
      case "state":
        return entity.state;
      case "last-changed":
        return formatDistanceToNow(new Date(entity.last_changed), {
          addSuffix: true,
        });
      case "last-updated":
        return formatDistanceToNow(new Date(entity.last_updated), {
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

  // Border radius logic for stack cards
  const roundedClass =
    rounded === "top"
      ? "rounded-t-lg rounded-b-none"
      : rounded === "bottom"
      ? "rounded-b-lg rounded-t-none"
      : rounded === "left"
      ? "rounded-l-lg rounded-r-none"
      : rounded === "right"
      ? "rounded-r-lg rounded-l-none"
      : rounded === "none"
      ? "rounded-none"
      : "rounded-lg";

  return (
    <Card className={cn("p-4 h-full flex flex-col", roundedClass)}>
      {config.name && (
        <div className="font-semibold text-md">{config.name}</div>
      )}
      <div className={cn("flex gap-4 flex-1", layoutClass)}>
        {entities.map(({ entity, name, icon, data }) => {
          if (!data) return null;
          const isActive =
            data.state === "on" ||
            data.state === "home" ||
            data.state === "open";
          const iconColor = isActive
            ? config.icon_color || "text-blue-500"
            : "text-muted-foreground";
          const IconComponent = icon && iconMap[icon] ? iconMap[icon] : Power;
          return (
            <div
              key={data.entity_id}
              className="flex items-center gap-3 flex-1"
              onClick={() => handleTap(data.entity_id, isActive)}
              style={{ cursor: "pointer" }}
            >
              {config.icon_type !== "none" && (
                <IconComponent className={cn("h-4 w-4", iconColor)} />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between font-medium text-foreground">
                  <span>{getPrimaryInfo(data, name)}</span>
                  <span className="text-sm text-muted-foreground">
                    {isNaN(parseFloat(data.state))
                      ? data.state
                      : parseFloat(data.state).toFixed(1)}
                    {data.attributes.unit_of_measurement
                      ? ` ${data.attributes.unit_of_measurement}`
                      : ""}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
