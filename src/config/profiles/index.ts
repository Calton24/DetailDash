/**
 * App Profile Registry
 */

import { AppProfile, AppProfileConfig } from "../types";
import { defaultConfig } from "./default";
import { detaildashConfig } from "./detaildash";

export const APP_PROFILES: Record<AppProfile, AppProfileConfig> = {
  default: defaultConfig,
  detaildash: detaildashConfig,
};

export { defaultConfig, detaildashConfig };
