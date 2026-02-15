import { HeroBanner } from "@/components/hero-banner";
import { ServerStatus } from "@/components/server-status";
import { ServerStats } from "@/components/server-stats";
import { NewsSection } from "@/components/news-section";

export default function HomePage() {
  return (
    <div>
      <HeroBanner />
      <div className="flex justify-center mt-6 relative z-10">
        <ServerStatus />
      </div>
      <ServerStats />
      <NewsSection />
    </div>
  );
}
