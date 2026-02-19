import { HeroBannerContent } from "./hero-banner-content";

export const heroBackgrounds = [
  // Vanilla
  "/img/World of Warcraft Classic 1920x1080/ClassicLaunch_WoW_STV_1920x1080.jpg",
  "/img/World of Warcraft Classic 1920x1080/ClassicLaunch_WoW_Onyxia_1920x1080.jpg",
  "/img/World of Warcraft Classic 1920x1080/ClassicStormwind.jpg",
  "/img/World of Warcraft Classic 1920x1080/ClassicOrgrimmar.jpg",
  "/img/World of Warcraft Classic 1920x1080/ClassicLaunch_WoW_Andorhal_1920x1080.jpg",
  "/img/World of Warcraft Classic 1920x1080/WoW_ClassicLaunchPressKit_UngoroHunter_1920x1080.jpg",
  "/img/World of Warcraft Classic 1920x1080/ClassicDungeon.jpg",
  // TBC
  "/img/Burning Crusade Classic  Black Temple Screenshots 1080/BCC_Black_Temple_Illidan.jpg",
  "/img/Burning Crusade Classic  Black Temple Screenshots 1080/BCC_Hyjal_Archimonde.jpg",
  "/img/Burning Crusade Classic  Black Temple Screenshots 1080/BCC_BlackTemple_Entrance.jpg",
  "/img/Burning Crusade Classic Overlords of Outland Screenshots 1080p/BCC_Overlords_of_Outland_Serpentshrine_Cavern_1920x1080.jpg",
  "/img/Burning Crusade Classic Overlords of Outland Screenshots 1080p/BCC_Overlords_of_Outland_Lady_Vashj_1920x1080.jpg",
  "/img/Burning Crusade Classic Overlords of Outland Announce/BCC_Overlords_of_Outland_KaelThas_1920x1080.jpg",
  "/img/Burning Crusade Classic Fury of the Sunwell Screenshots 4K/WoW_BCC_FuryOfTheSunwell_Kiljaeden_010_png_jpgcopy.jpg",
  "/img/Burning Crusade Classic  The Gods of ZulAman Screenshots 1080p/BCC_Zul_Aman_Zuljin_002_1920x1080_png_jpgcopy.jpg",
  // WotLK
  "/img/Wrath of the Lich King Classic Cinematic Stills/Wrath_of_the_Lich_King_Classic_Cinematic_Still__(1).jpg",
  "/img/Wrath of the Lich King Classic Cinematic Stills/Wrath_of_the_Lich_King_Classic_Cinematic_Still__(5).jpg",
  "/img/Wrath of the Lich King Classic Reveal Screenshots 1080p/WoW_Wrath_Icecrown_006_1080p_png_jpgcopy.jpg",
  "/img/Wrath of the Lich King Classic Reveal Screenshots 1080p/WoW_Wrath_HowlingFjord_007_1080p_png_jpgcopy.jpg",
  "/img/Wrath of the Lich King Classic Reveal Screenshots 1080p/WoW_Wrath_Dalaran_004_1080p_png_jpgcopy.jpg",
  "/img/Wrath of the Lich King Classic Reveal Screenshots 1080p/WoW_Wrath_Ulduar_003_1080p_png_jpgcopy.jpg",
  "/img/Wrath of the Lich King Classic Secret of Ulduar Screenshots 4K/WoW_Wrath_Ulduar_003_4K_png_jpgcopy.jpg",
  "/img/Wrath Classic Fall of the Lich King Launch Screenshots/WoW_WrathClassic_Fall_of_the_Lich_King_(3)_png_jpgcopy.jpg",
  "/img/Wrath Classic Fall of the Lich King Launch Screenshots/WoW_WrathClassic_Fall_of_the_Lich_King_(5)_png_jpgcopy.jpg",
];

export const HeroBanner = ({ bgImage }: { bgImage: string }) => {
  const encodedBgImage = encodeURI(bgImage);

  return (
    <section className="relative w-full min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background image (server-rendered) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url('${encodedBgImage}')` }}
      />

      {/* Multi-layer overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-wow-darker/80 via-wow-darker/40 to-wow-darker" />
      <div className="absolute inset-0 bg-gradient-to-r from-wow-darker/50 via-transparent to-wow-darker/50" />

      {/* Radial glow from center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,195,247,0.08)_0%,transparent_70%)]" />

      {/* Bottom edge glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-wow-blue/30 to-transparent" />

      <HeroBannerContent />
    </section>
  );
};
