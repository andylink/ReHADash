"use client";

import { useEntity } from "@/lib/ha-context";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface EntityChipProps {
  entityId: string;
  name?: string;
  icon?: string;
  useAvatar?: boolean;
}

export function PersonChip({
  entityId,
  name,
  icon = "Circle",
  useAvatar = false,
}: EntityChipProps) {
  const { entity, callService, loading } = useEntity(entityId);

  if (loading || !entity) {
    return (
      <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm font-medium transition-colors">
        <Icons.Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span>{name || "Loading..."}</span>
      </button>
    );
  }

  // Treat both person.* and device_tracker.* as "person-like"
  const isPersonLike =
    entity.entity_id.startsWith("person.") ||
    entity.entity_id.startsWith("device_tracker.");

  const isActive = entity.state === "on" || entity.state === "home";
  const displayName = name || entity.attributes.friendly_name;
  const IconComponent =
    (Icons[icon as keyof typeof Icons] as LucideIcon) || Icons.Circle;

  // Prefer place for person-like entities
  let status: string | undefined;
  if (isPersonLike) {
    if (entity.attributes.place) {
      status = entity.attributes.place;
    } else if (entity.state === "home") {
      status = "Home";
    } else if (entity.state === "not_home") {
      status = "Away";
    } else {
      status = entity.state;
    }
  } else {
    if (
      entity.state !== "on" &&
      entity.state !== "off" &&
      entity.state !== "home" &&
      entity.state !== "away"
    ) {
      status = entity.state;
    }
  }

  const handleClick = () => {
    if (
      entity.entity_id.startsWith("switch.") ||
      entity.entity_id.startsWith("light.")
    ) {
      const domain = entity.entity_id.split(".")[0];
      callService(domain, "toggle", entity.entity_id);
    }
  };
  const avatarUrl = entity.attributes.entity_picture;
  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95",
        isActive
          ? "bg-primary text-primary-foreground shadow-md"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      )}
    >
      {useAvatar && avatarUrl ? (
        <img
          src={avatarUrl}
          alt={displayName}
          className="h-5 w-5 rounded-full object-cover"
        />
      ) : (
        <IconComponent className="h-3.5 w-3.5" />
      )}

      <span>{displayName}</span>
      {status && status.toLowerCase() !== "home" && (
        <span className="text-xs opacity-75 capitalize">{status}</span>
      )}
    </button>
  );
}
