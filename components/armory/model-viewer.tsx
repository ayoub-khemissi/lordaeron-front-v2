"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

import { TC_TO_WMV_SLOT } from "@/lib/armory-constants";
import { EquipmentSlot } from "@/types/armory";

declare global {
  interface Window {
    CONTENT_PATH: string;
    jQuery: unknown;
    ZamModelViewer: unknown;
  }
}

interface ModelViewerProps {
  race: number;
  gender: number;
  skin: number;
  face: number;
  hairStyle: number;
  hairColor: number;
  facialStyle: number;
  equipment: EquipmentSlot[];
}

/** Weapon slots use meta/item/, armor slots use meta/armor/{slot}/ */
const WEAPON_WMV_SLOTS = [21, 22];

/** Check if a display ID has a valid model on the CDN */
async function validateDisplayId(
  wmvSlot: number,
  displayId: number,
): Promise<boolean> {
  try {
    const path = WEAPON_WMV_SLOTS.includes(wmvSlot)
      ? `/modelviewer/wrath/meta/item/${displayId}.json`
      : `/modelviewer/wrath/meta/armor/${wmvSlot}/${displayId}.json`;

    const res = await fetch(path, { method: "HEAD" });

    return res.ok;
  } catch {
    return false;
  }
}

/** Resolve equipment to validated [wmvSlot, displayId] pairs using DB displayIds */
async function resolveItems(
  equipment: EquipmentSlot[],
): Promise<[number, number][]> {
  const renderableItems = equipment.filter(
    (e) => TC_TO_WMV_SLOT[e.slot] !== undefined && e.displayId > 0,
  );

  const results = await Promise.all(
    renderableItems.map(async (e) => {
      const wmvSlot = TC_TO_WMV_SLOT[e.slot];
      const displayId = e.displayId;

      // 1) Check if the displayId exists on the CDN
      if (await validateDisplayId(wmvSlot, displayId)) {
        return [wmvSlot, displayId] as [number, number];
      }

      // 2) Try alternate slot mapping (chest→robe, etc.)
      const altSlot = { 5: 20, 16: 21, 18: 22 }[wmvSlot];

      if (altSlot && (await validateDisplayId(altSlot, displayId))) {
        return [altSlot, displayId] as [number, number];
      }

      return null;
    }),
  );

  return results.filter((e): e is [number, number] => e !== null);
}

function setupGlobals() {
  window.CONTENT_PATH = "/modelviewer/wrath/";

  if (!(window as any).WH) {
    (window as any).WH = {};
  }
  const WH = (window as any).WH;

  if (!WH.debug) {
    WH.debug = function () {};
  }
  if (!WH.defaultAnimation) {
    WH.defaultAnimation = "Stand";
  }
  if (!WH.WebP) {
    WH.WebP = {
      getImageExtension() {
        return ".webp";
      },
    };
  }
  if (!WH.Wow) {
    WH.Wow = {
      Item: {
        INVENTORY_TYPE_HEAD: 1,
        INVENTORY_TYPE_NECK: 2,
        INVENTORY_TYPE_SHOULDERS: 3,
        INVENTORY_TYPE_SHIRT: 4,
        INVENTORY_TYPE_CHEST: 5,
        INVENTORY_TYPE_WAIST: 6,
        INVENTORY_TYPE_LEGS: 7,
        INVENTORY_TYPE_FEET: 8,
        INVENTORY_TYPE_WRISTS: 9,
        INVENTORY_TYPE_HANDS: 10,
        INVENTORY_TYPE_FINGER: 11,
        INVENTORY_TYPE_TRINKET: 12,
        INVENTORY_TYPE_ONE_HAND: 13,
        INVENTORY_TYPE_SHIELD: 14,
        INVENTORY_TYPE_RANGED: 15,
        INVENTORY_TYPE_BACK: 16,
        INVENTORY_TYPE_TWO_HAND: 17,
        INVENTORY_TYPE_BAG: 18,
        INVENTORY_TYPE_TABARD: 19,
        INVENTORY_TYPE_ROBE: 20,
        INVENTORY_TYPE_MAIN_HAND: 21,
        INVENTORY_TYPE_OFF_HAND: 22,
        INVENTORY_TYPE_HELD_IN_OFF_HAND: 23,
        INVENTORY_TYPE_PROJECTILE: 24,
        INVENTORY_TYPE_THROWN: 25,
        INVENTORY_TYPE_RANGED_RIGHT: 26,
        INVENTORY_TYPE_QUIVER: 27,
        INVENTORY_TYPE_RELIC: 28,
        INVENTORY_TYPE_PROFESSION_TOOL: 29,
        INVENTORY_TYPE_PROFESSION_ACCESSORY: 30,
      },
    };
  }
}

export function ModelViewer({
  race,
  gender,
  skin,
  face,
  hairStyle,
  hairColor,
  facialStyle,
  equipment,
}: ModelViewerProps) {
  const viewerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptsReady, setScriptsReady] = useState(false);
  const [jqueryLoaded, setJqueryLoaded] = useState(false);

  // On mount: check if scripts are already loaded (client-side navigation)
  useEffect(() => {
    if ((window as any).jQuery) {
      setupGlobals();
      setJqueryLoaded(true);
    }
    if ((window as any).ZamModelViewer) {
      setScriptsReady(true);
    }

    return () => {
      if (viewerRef.current?.destroy) {
        try {
          viewerRef.current.destroy();
        } catch {
          // Ignore cleanup errors
        }
      }
      viewerRef.current = null;
    };
  }, []);

  // Initialize viewer once scripts are ready
  useEffect(() => {
    if (!scriptsReady) return;

    let cancelled = false;
    let rafId: number;

    const createViewer = async () => {
      const container = containerRef.current;

      if (!container || cancelled) return;

      const $ = (window as any).jQuery;
      const Zam = (window as any).ZamModelViewer;

      if (!$ || !Zam) return;

      // Ensure layout is resolved
      if (container.clientWidth === 0) {
        rafId = requestAnimationFrame(() => {
          createViewer();
        });

        return;
      }

      // Destroy previous instance
      if (viewerRef.current?.destroy) {
        try {
          viewerRef.current.destroy();
        } catch {
          // Ignore
        }
        viewerRef.current = null;
      }
      container.innerHTML = "";

      // Fetch real display IDs from Wowhead (cached server-side)
      const items = await resolveItems(equipment);

      if (cancelled) return;

      const modelId = race * 2 - 1 + gender;

      viewerRef.current = new Zam({
        type: 2,
        contentPath: window.CONTENT_PATH,
        container: $(container),
        aspect: 1,
        models: {
          id: modelId,
          type: 16,
        },
        items: items,
      });
    };

    rafId = requestAnimationFrame(() => {
      createViewer();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [
    scriptsReady,
    race,
    gender,
    skin,
    face,
    hairStyle,
    hairColor,
    facialStyle,
    equipment,
  ]);

  const handleJqueryLoad = () => {
    setupGlobals();
    setJqueryLoaded(true);
  };

  const handleViewerScriptLoad = () => {
    setScriptsReady(true);
  };

  return (
    <>
      <Script
        src="https://code.jquery.com/jquery-3.7.1.min.js"
        strategy="afterInteractive"
        onLoad={handleJqueryLoad}
      />
      {jqueryLoaded && (
        <Script
          src="/modelviewer/wrath/viewer/viewer.min.js"
          strategy="afterInteractive"
          onLoad={handleViewerScriptLoad}
        />
      )}
      <div
        ref={containerRef}
        id="armory-model-viewer"
        style={{ width: "100%", height: 420, background: "#000" }}
      />
    </>
  );
}
