/**
 * DetailDash App Configuration
 */

import { AppProfileConfig } from "../types";

export const detaildashConfig: AppProfileConfig = {
  supabase: {
    url:
      process.env.EXPO_PUBLIC_SUPABASE_URL ||
      "https://your-detaildash-project.supabase.co",
    anonKey:
      process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY",
  },

  firebase: {
    ios: {
      googleAppId: "1:123456789:ios:abcdef123456",
      gcmSenderId: "123456789",
      apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      projectId: "detaildash-prod",
      storageBucket: "detaildash-prod.appspot.com",
      clientId:
        "123456789-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com",
      bundleId: "com.calton.detaildash",
    },
    android: {
      googleAppId: "1:123456789:android:abcdef123456",
      apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      projectId: "detaildash-prod",
      storageBucket: "detaildash-prod.appspot.com",
      gcmSenderId: "123456789",
      clientId:
        "123456789-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com",
      packageName: "com.calton.detaildash",
    },
  },

  billing: {
    provider: "stripe" as const,
    stripe: {
      publishableKey: "pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      mode: "checkout" as const,
      priceIds: {
        monthly: "price_monthly_xxxxxxxxxxxxxx",
        yearly: "price_yearly_xxxxxxxxxxxxxx",
        premium: "price_premium_xxxxxxxxxxxxxx",
      },
      defaultPriceId: "price_monthly_xxxxxxxxxxxxxx",
      successUrl: "detaildash://checkout/success",
      cancelUrl: "detaildash://checkout/cancel",
    },
  },

  features: {
    vision: false,
    water: false,
    habit: true,
    analytics: true,
    growth: false,
    haptics: true,
    notifications: true,
    firebaseAnalytics: false,
    crashReporting: false,
    performanceMonitoring: false,
    billing: true,
    i18n: true,
    presence: true,
    activityMonitor: true,
    liveActivity: true,
    maintenance: true,
    allowUnsafeClientWrites: false,
  },

  app: {
    name: "DetailDash",
    slug: "detaildash",
    bundleIdentifier: "com.calton.detaildash",
    androidPackage: "com.calton.detaildash",
    version: "1.0.0",
    scheme: "detaildash",
  },

  environments: {
    dev: {
      features: {
        analytics: false,
        growth: true,
        billing: false, // dev: billing UI off; prod uses Stripe
      },
      app: {
        name: "DetailDash",
        slug: "detaildash-dev",
      },
    },
    staging: {
      app: {
        name: "DetailDash Staging",
      },
    },
    prod: {},
  },
};
