// Camera coordinates are scene units. Keep phone and tablet art direction
// independent of the desktop wordmark overlap.
export const compositions = {
  phone: {
    fov: 48, dpr: 1.35,
    camera: [3, 2, 16.5], target: [0, 0.1, 0],
    entryZ: 17.3, sideRadius: 8.5, sideTargetZ: 16.3, followRadius: 6.5,
    sideDuration: 1.1, rate: 0.88,
  },
  tablet: {
    fov: 42, dpr: 1.75,
    camera: [5, 3, 17], target: [-1.5, 1.1, 0],
    entryZ: 16.5, sideRadius: 8, sideTargetZ: 15, followRadius: 8,
    sideDuration: 0.9, rate: 1,
  },
  desktop: {
    fov: 38, dpr: 1.75,
    camera: [6.4, 4.25, 15.2], target: [-4.1, 1.25, 0],
    entryZ: 17, sideRadius: 8, sideTargetZ: 15, followRadius: 8,
    sideDuration: 0.9, rate: 1,
  },
} as const;

export function compositionFor(width: number, height: number) {
  if (width < 700) return compositions.phone;
  if (width < 1100 && height > width) return compositions.tablet;
  return compositions.desktop;
}
