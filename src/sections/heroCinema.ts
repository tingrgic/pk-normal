let modulePromise: Promise<typeof import("../three/scene")> | undefined;

export function isClubPage() {
  return !["#brojac", "#karta", "#dvoboji", "#shop"].includes(location.hash);
}

export function loadCinema() {
  // Share the early request with the hero, including React's development remount.
  return (modulePromise ??= import("../three/scene").catch((error) => {
    modulePromise = undefined;
    throw error;
  }));
}

export function prepareHero() {
  if (!isClubPage() || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!document.querySelector('link[data-hero-reflections]')) {
    const preload = document.createElement("link");
    preload.rel = "preload";
    preload.as = "image";
    preload.crossOrigin = "anonymous";
    preload.href = import.meta.env.BASE_URL + "studio-reflections.webp";
    preload.dataset.heroReflections = "";
    document.head.append(preload);
  }
  // A failed speculative request must not become an unhandled rejection.
  void loadCinema().catch(() => {});
}
