"use client";

import { useEntity } from "@/lib/ha-context";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { PersonCardConfig } from "@/types/card-types";
import { getDaysInMonth } from "date-fns";

interface PersonCardProps {
  config: PersonCardConfig;
  rounded?: "default" | "top" | "bottom" | "left" | "right" | "none";
}

const statusBadgeIcon = (status: string) => {
  if (status && status.toLowerCase().includes("gym")) {
    return <Icons.Dumbbell className="h-5 w-5 text-orange-600" />;
  }
  switch (status.toLowerCase()) {
    case "home":
      return <Icons.Home className="h-5 w-5 text-primary" />;
    case "driving":
      return <Icons.Car className="h-5 w-5 text-primary" />;
    case "work":
      return <Icons.Building2 className="h-5 w-5 text-primary" />;
    case "away":
    case "not_home":
      return <Icons.Footprints className="h-5 w-5 text-primary" />;

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
  // Responsive avatar/icon size based on config.size
  const sizeMap = {
    xxs: "h-16 w-16",
    xs: "h-14 w-14",
    sm: "h-18 w-18",
    md: "h-24 w-24",
    lg: "h-28 w-28",
    xl: "h-32 w-32",
    xxl: "h-36 w-36",
  };
  const avatarSize =
    sizeMap[config.size as keyof typeof sizeMap] || "h-24 w-24";

  const badgeSizeMap = {
    xxs: "h-6 w-6 text-xs",
    xs: "h-5 w-5 text-sm",
    sm: "h-6 w-6 text-base",
    md: "h-7 w-7 text-lg",
    lg: "h-8 w-8 text-xl",
    xl: "h-9 w-9 text-2xl",
    xxl: "h-10 w-10 text-3xl",
  };
  const badgeSize =
    badgeSizeMap[config.size as keyof typeof badgeSizeMap] || "h-7 w-7 text-lg";

  // Optionally adjust badge position for very small cards
  const badgePosition =
    config.size === "xxs"
      ? { top: "-4px", right: "-4px" }
      : { top: "-4px", right: "-4px" };

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
              `${avatarSize} rounded-full object-cover border-4 border-primary`,
              status?.toLowerCase() !== "home" && "grayscale"
            )}
          />
        ) : (
          <IconComponent className={avatarSize} />
        )}
        {status && (
          <span
            className={cn(
              "absolute bg-white rounded-full shadow flex items-center justify-center border border-gray-200",
              badgeSize
            )}
            style={badgePosition}
          >
            {statusBadgeIcon(status)}
          </span>
        )}
      </div>
    </Card>
  );
}
