import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.fighters.wekito",
  appName: "Wekito Fighters",
  webDir: "dist",
  server: {
    url: undefined,
    cleartext: true,
  },
};

export default config;
