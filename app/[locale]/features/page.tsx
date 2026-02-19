import { FeaturesGrid } from "@/components/features-grid";
import { RatesSection, RaidProgressionSection } from "@/components/rates-table";

export default function FeaturesPage() {
  return (
    <div
      className="relative bg-cover bg-center"
      style={{
        backgroundImage:
          "url('/img/Burning Crusade Classic  Black Temple Screenshots 1080/BCC_Hyjal_Archimonde.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-wow-darker/90" />

      <div className="relative container mx-auto max-w-7xl px-6 py-16 space-y-20">
        <RatesSection />
        <FeaturesGrid />
        <RaidProgressionSection />
      </div>
    </div>
  );
}
