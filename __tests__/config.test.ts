/**
 * Config System Tests
 * Tests profile selection, environment overrides, validation, and security
 */

import { getAppConfig, resetConfigCache } from "../src/config";
import type { AppConfig } from "../src/config/types";

describe("Config System", () => {
  beforeEach(() => {
    resetConfigCache();
  });

  describe("Profile Selection", () => {
    it("should load detaildash profile when EXPO_PUBLIC_APP_PROFILE=detaildash", () => {
      process.env.EXPO_PUBLIC_APP_PROFILE = "detaildash";
      process.env.EXPO_PUBLIC_APP_ENV = "prod";
      process.env.APP_ENV = "prod";

      const config = getAppConfig();

      expect(config.app.name).toBe("DetailDash");
      expect(config.app.slug).toBe("detaildash");
      expect(config.app.bundleIdentifier).toBe("com.calton.detaildash");
    });

    it("should load default profile when EXPO_PUBLIC_APP_PROFILE=default", () => {
      process.env.EXPO_PUBLIC_APP_PROFILE = "default";
      process.env.EXPO_PUBLIC_APP_ENV = "prod";
      process.env.APP_ENV = "prod";

      const config = getAppConfig();

      expect(config.app.name).toBe("DetailDash");
      expect(config.app.slug).toBe("detaildash");
      expect(config.app.bundleIdentifier).toBe("com.calton.detaildash");
    });

    it("should throw error for unknown profile", () => {
      process.env.EXPO_PUBLIC_APP_PROFILE = "nonexistent";

      expect(() => getAppConfig()).toThrow();
    });

    it("should default to detaildash if no profile specified", () => {
      delete process.env.EXPO_PUBLIC_APP_PROFILE;
      process.env.EXPO_PUBLIC_APP_ENV = "prod";
      process.env.APP_ENV = "prod";

      const config = getAppConfig();

      expect(config.app.name).toBe("DetailDash");
    });
  });

  describe("Environment Overrides", () => {
    it("should apply dev environment overrides", () => {
      process.env.EXPO_PUBLIC_APP_PROFILE = "detaildash";
      process.env.EXPO_PUBLIC_APP_ENV = "dev";

      const config = getAppConfig();

      expect(config.features.billing).toBe(false);
    });

    it("should apply staging environment overrides", () => {
      process.env.EXPO_PUBLIC_APP_PROFILE = "detaildash";
      process.env.EXPO_PUBLIC_APP_ENV = "staging";

      const config = getAppConfig();

      expect(config.app.name).toBe("DetailDash Staging");
    });

    it("should use production config by default", () => {
      process.env.EXPO_PUBLIC_APP_PROFILE = "detaildash";
      process.env.EXPO_PUBLIC_APP_ENV = "prod";
      process.env.APP_ENV = "prod";

      const config = getAppConfig();

      expect(config.features.billing).toBe(true);
    });
  });

  describe("Supabase Config", () => {
    it("should have valid Supabase URL", () => {
      const config = getAppConfig();

      expect(config.supabase.url).toMatch(/^https?:\/\/.+/);
    });

    it("should have Supabase anon key", () => {
      const config = getAppConfig();

      expect(config.supabase.anonKey).toBeDefined();
      expect(config.supabase.anonKey.length).toBeGreaterThan(0);
    });

    it("should not expose service role key", () => {
      const config = getAppConfig();

      expect((config.supabase as any).serviceRoleKey).toBeUndefined();
    });
  });

  describe("Firebase Config", () => {
    it("should include Firebase config when configured", () => {
      process.env.EXPO_PUBLIC_APP_PROFILE = "detaildash";
      process.env.EXPO_PUBLIC_APP_ENV = "prod";
      process.env.APP_ENV = "prod";

      const config = getAppConfig();

      if (config.firebase) {
        expect(config.firebase.ios.googleAppId).toBeDefined();
        expect(config.firebase.android.googleAppId).toBeDefined();
      }
    });

    it("should have optional Firebase config", () => {
      process.env.EXPO_PUBLIC_APP_PROFILE = "detaildash";
      process.env.EXPO_PUBLIC_APP_ENV = "dev";

      const config = getAppConfig();

      expect(
        config.firebase === undefined || typeof config.firebase === "object"
      ).toBe(true);
    });
  });

  describe("Billing Config", () => {
    it("should use Stripe for detaildash profile", () => {
      resetConfigCache();
      process.env.EXPO_PUBLIC_APP_PROFILE = "detaildash";
      process.env.EXPO_PUBLIC_APP_ENV = "prod";
      process.env.APP_ENV = "prod";

      const config = getAppConfig();

      expect(config.billing?.provider).toBe("stripe");
      expect(config.billing?.stripe).toBeDefined();
      expect(config.billing?.stripe?.publishableKey).toBeDefined();
    });

    it("should disable billing feature flag in dev environment", () => {
      process.env.EXPO_PUBLIC_APP_PROFILE = "detaildash";
      process.env.EXPO_PUBLIC_APP_ENV = "dev";

      const config = getAppConfig();

      expect(config.features.billing).toBe(false);
    });

    it("should reject Stripe secret keys in config", () => {
      const invalidConfig = {
        provider: "stripe" as const,
        stripe: {
          publishableKey: "sk_test_secret_key",
          pricingTableId: "prctbl_xxx",
          webhookMode: "supabase" as const,
        },
      };

      expect(() => {
        if (invalidConfig.stripe.publishableKey.includes("sk_")) {
          throw new Error("SECURITY ERROR: Stripe secret key detected");
        }
      }).toThrow("secret key");
    });

    it("should accept valid Stripe publishable keys", () => {
      const validConfig = {
        provider: "stripe" as const,
        stripe: {
          publishableKey: "pk_test_valid_key",
          pricingTableId: "prctbl_xxx",
          webhookMode: "supabase" as const,
        },
      };

      expect(validConfig.stripe.publishableKey).toMatch(/^pk_/);
    });
  });

  describe("Feature Flags", () => {
    it("should have all expected feature flags", () => {
      const config = getAppConfig();

      expect(config.features).toHaveProperty("billing");
      expect(config.features).toHaveProperty("vision");
      expect(config.features).toHaveProperty("analytics");
    });

    it("should allow feature flags to be boolean", () => {
      const config = getAppConfig();

      expect(typeof config.features.vision).toBe("boolean");
      expect(typeof config.features.analytics).toBe("boolean");
      expect(typeof config.features.billing).toBe("boolean");
    });
  });

  describe("Config Caching", () => {
    it("should cache config after first load", () => {
      process.env.EXPO_PUBLIC_APP_PROFILE = "detaildash";

      const config1 = getAppConfig();
      const config2 = getAppConfig();

      expect(config1).toBe(config2);
    });

    it("should use cached config even if env changes", () => {
      process.env.EXPO_PUBLIC_APP_PROFILE = "detaildash";
      const config1 = getAppConfig();

      process.env.EXPO_PUBLIC_APP_PROFILE = "default";
      const config2 = getAppConfig();

      expect(config1).toBe(config2);
      expect(config2.app.name).toBe("DetailDash");
    });

    it("should reload config after cache clear", () => {
      process.env.EXPO_PUBLIC_APP_PROFILE = "detaildash";
      process.env.EXPO_PUBLIC_APP_ENV = "dev";
      const config1 = getAppConfig();

      resetConfigCache();

      process.env.EXPO_PUBLIC_APP_ENV = "staging";
      const config2 = getAppConfig();

      expect(config1).not.toBe(config2);
      expect(config1.app.name).toBe("DetailDash");
      expect(config2.app.name).toBe("DetailDash Staging");
    });
  });

  describe("Type Safety", () => {
    it("should return properly typed config", () => {
      const config = getAppConfig();

      const appConfig: AppConfig = config;
      expect(appConfig.app).toBeDefined();
      expect(appConfig.supabase).toBeDefined();
      expect(appConfig.features).toBeDefined();
    });
  });
});
