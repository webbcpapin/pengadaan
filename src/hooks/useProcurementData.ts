import { useMemo, useState } from "react";
import { appSeed } from "../data/seed";
import { getLocalPackages, saveLocalPackages } from "../lib/storage";
import type { PackageItem } from "../types/procurement";

export function useProcurementData() {
  const [localPackages, setLocalPackages] = useState<PackageItem[]>(() => getLocalPackages());

  const packages = useMemo(
    () => [...appSeed.DATA_PAKET, ...localPackages],
    [localPackages],
  );

  function addLocalPackage(item: PackageItem) {
    const next = [item, ...localPackages];
    setLocalPackages(next);
    saveLocalPackages(next);
  }

  return {
    seed: appSeed,
    packages,
    localPackages,
    addLocalPackage,
  };
}
