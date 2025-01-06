import { AnalyticsBrowser } from "@segment/analytics-next";

const isProduction = process.env.NODE_ENV === "production";

const analytics = AnalyticsBrowser.load({
  writeKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY,
  // Add any additional settings here
  // Example: debug: !isProduction
});
export default analytics;
