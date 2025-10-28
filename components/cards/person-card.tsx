"use client";

import { useEntity } from "@/lib/ha-context";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PersonCardConfig } from "@/types/card-types";

interface PersonCardProps {
  config: PersonCardConfig;
  rounded?: "default" | "top" | "bottom" | "left" | "right" | "none";
}

const statusBadgeIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "home":
      return <Icons.Home className="h-5 w-5 text-green-600" />;
    case "driving":
      return <Icons.Car className="h-5 w-5 text-blue-600" />;
    case "work":
      return <Icons.Building2 className="h-5 w-5 text-green-600" />;
    case "away":
    case "not_home":
      return <Icons.Footprints className="h-5 w-5 text-yellow-600" />;
    default:
      return null;
  }
};

export function PersonCard({ config, rounded = "default" }: PersonCardProps) {
  const { entityId, name, icon = "User", useAvatar = true } = config;
  const { entity, loading } = useEntity(entityId);

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

  if (loading || !entity) {
    return (
      <Card
        className={cn(
          "p-4 h-full flex flex-col items-center justify-center",
          roundedClass
        )}
      >
        <Icons.Loader2 className="h-6 w-6 animate-spin mb-2" />
        <span>{name || "Loading..."}</span>
      </Card>
    );
  }

  const isPersonLike =
    entity.entity_id.startsWith("person.") ||
    entity.entity_id.startsWith("device_tracker.");

  const isActive = entity.state === "on" || entity.state === "home";
  const displayName = name || entity.attributes.friendly_name;
  const IconComponent =
    (Icons[icon as keyof typeof Icons] as LucideIcon) || Icons.User;

  let status: string | undefined;
  if (isPersonLike) {
    if (entity.attributes.place) {
      status = entity.attributes.place;
    } else if (entity.state === "home") {
      status = "Home";
    } else if (entity.state === "not_home") {
      status = "Away";
    } else if (entity.state === "driving") {
      status = "Driving";
    } else {
      status = entity.state;
    }
  } else {
    status = entity.state;
  }

  const avatarUrl = entity.attributes.entity_picture;

  return (
    <Card
      className={cn(
        "p-0 h-full flex flex-col items-center justify-center",
        roundedClass
      )}
    >
      <div className="relative flex items-center justify-center">
        {useAvatar && avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className={cn(
              "h-24 w-24 rounded-full object-cover border-4 border-primary",
              status?.toLowerCase() !== "home" && "grayscale"
            )}
          />
        ) : (
          <IconComponent className="h-22 w-22" />
        )}
        {status && (
          <span
            className="absolute right-0 bg-white rounded-full shadow p-1 flex items-center justify-center border border-gray-200"
            style={{ top: "-4px", right: "-4px" }} // Move badge slightly higher
          >
            {statusBadgeIcon(status)}
          </span>
        )}
      </div>
    </Card>
  );
}
