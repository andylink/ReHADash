export type CardLayout = "default" | "vertical" | "horizontal";
export type PrimaryInfo =
  | "name"
  | "state"
  | "last-changed"
  | "last-updated"
  | "none";
export type SecondaryInfo =
  | "name"
  | "state"
  | "last-changed"
  | "last-updated"
  | "brightness"
  | "none";
export type IconType = "icon" | "entity-picture" | "none";
export type HomeAssistantAction =
  | "toggle"
  | "more-info"
  | "none"
  | { action: string; [key: string]: any };

export type CardSize =
  | "xxs" // Half width (0.5x1)
  | "xxs-h"
  | "xxs-v" // Half sizes
  | "xs" // 1x1
  | "xs-h"
  | "xs-v"
  | "sm" // Small sizes
  | "sm-h"
  | "sm-v"
  | "md" // Medium sizes
  | "md-h"
  | "md-v"
  | "lg" // Large sizes
  | "lg-h"
  | "lg-v"
  | "xl" // Extra large sizes
  | "xl-h"
  | "xl-v";

export interface BaseCardConfig {
  entity?: string;
  icon?: string;
  name?: string;
  layout?: CardLayout;
  fill_container?: boolean;
  primary_info?: PrimaryInfo;
  secondary_info?: SecondaryInfo;
  icon_type?: IconType;
  tap_action?: HomeAssistantAction;
  hold_action?: HomeAssistantAction;
  double_tap_action?: HomeAssistantAction;
  size?: CardSize;
  colSpan?: number;
  rowSpan?: number;
  gridColumn?: number; // Explicit column position (1-based)
  gridRow?: number; // Explicit row position (1-based)
}

export interface LightCardConfig extends BaseCardConfig {
  type: "light-card";
  entityIds?: string[]; // For light groups - if provided, entity is ignored
  icon_color?: string;
  show_brightness_control?: boolean;
  show_color_temp_control?: boolean;
  show_color_control?: boolean;
  collapsible_controls?: boolean;
  use_light_color?: boolean;
}

export interface ClimateCardConfig extends BaseCardConfig {
  type: "climate-card";
  hvac_modes?: string[];
  show_temperature_control?: boolean;
  collapsible_controls?: boolean;
}

export interface EntityCardEntity {
  entity: string;
  name?: string;
  icon?: string;
}

export interface EntityCardConfig extends BaseCardConfig {
  type: "entity-card";
  icon_color?: string;
  entities?: (string | EntityCardEntity)[]; // Accepts string or object
}

export interface GraphCardConfig extends BaseCardConfig {
  type: "graph-card";
  entities: (string | EntityCardEntity)[];
  name?: string;
  hours?: number; // How many hours of history to show
  // Add more config options as needed
}

export interface CustomCardConfig extends BaseCardConfig {
  type: "custom-card";
  widget: string;
  options?: Record<string, any>;
}

export interface StackCardConfig extends BaseCardConfig {
  type: "stack-card";
  direction?: "vertical" | "horizontal";
  items: CardConfig[];
  noGap?: boolean;
}

export interface PersonCardConfig extends BaseCardConfig {
  type: "person-card";
  entityId: string;
  useAvatar?: boolean;
}

export type CardConfig =
  | LightCardConfig
  | ClimateCardConfig
  | EntityCardConfig
  | GraphCardConfig
  | StackCardConfig
  | CustomCardConfig
  | PersonCardConfig;
