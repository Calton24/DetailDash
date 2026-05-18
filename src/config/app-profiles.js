/**
 * App Profiles for Expo Config (build-time)
 */

const APP_PROFILES = {
  default: {
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
  },

  detaildash: {
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
  },
};

module.exports = { APP_PROFILES };
