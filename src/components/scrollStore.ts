/**
 * Mutable scroll state shared between Lenis (writer) and useFrame
 * hooks (readers). Bypasses React entirely so we don't re-render on
 * every scroll tick.
 */
export const scrollStore = {
  /** Page progress 0..1 */
  progress: 0,
  /** Velocity in px/frame (signed) */
  velocity: 0,
  /** Section index (0..N-1) — derived from progress on home */
  section: 0,
  /** Section progress 0..1 within current section */
  sectionProgress: 0,
};
