import { HeroBanner, heroBackgrounds } from "@/components/hero-banner";
import { ServerStatus } from "@/components/server-status";
import { ServerStats } from "@/components/server-stats";
import { NewsSection } from "@/components/news-section";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const bgImage =
    heroBackgrounds[Math.floor(Math.random() * heroBackgrounds.length)];

  return (
    <div>
      <HeroBanner bgImage={bgImage} />
      <div className="flex justify-center mt-6 relative z-10">
        <ServerStatus />
      </div>
      <ServerStats />
      <NewsSection />
    </div>
  );
}
