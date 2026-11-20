import { assetUrl } from "./paths";

export function scenarioForHub(hubId: string): string {
  if (hubId === "ALL" || !hubId) {
    return assetUrl("/images/escenarios/escenario_hero_bosque.jpg");
  }
  if (hubId.includes("amazonia")) {
    return assetUrl("/images/escenarios/escenario_amazonia.jpg");
  }
  if (hubId.includes("pacifico") || hubId.includes("atrato")) {
    return assetUrl("/images/escenarios/escenario_pacifico.jpg");
  }
  if (hubId === "caribe" || hubId.includes("orinoquia")) {
    return assetUrl("/images/escenarios/escenario_orinoquia_caribe.jpg");
  }
  return assetUrl("/images/escenarios/escenario_andino.jpg");
}

const OFFICIAL_PHOTO_PREFIXES = [
  "asomasuc_",
  "forestar_",
  "asomadegua_nosotros",
  "ecoserrania_",
  "coomagua_",
];

export function photoOriginLabel(imagePath: string): {
  label: string;
  isOfficial: boolean;
} {
  const name = imagePath.split("/").pop() || "";
  const isOfficial = OFFICIAL_PHOTO_PREFIXES.some((p) => name.startsWith(p));
  return isOfficial
    ? { label: "Foto oficial de la asociación", isOfficial: true }
    : { label: "Fotografía ilustrativa de la especie/producto", isOfficial: false };
}
