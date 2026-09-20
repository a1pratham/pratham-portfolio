export const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

export const hasFinePointer = () => window.matchMedia(FINE_POINTER_QUERY).matches;

/** Cheap up-front check; the real context is created (and can still fail) in the scene. */
export function canRenderScene() {
  if (typeof window === 'undefined' || !('WebGLRenderingContext' in window)) return false;
  const { connection, hardwareConcurrency, deviceMemory } = window.navigator;
  if (connection?.saveData) return false;
  return (hardwareConcurrency ?? 8) > 2 && (deviceMemory ?? 8) > 2;
}
