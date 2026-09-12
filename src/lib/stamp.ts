/** A postage stamp is 4:5; the mask below is drawn for that box and scales uniformly. */
export const STAMP_RATIO = "4 / 5";

/**
 * CSS mask for a perforated stamp: a 4:5 box with half-circle notches along all
 * four edges, corners included. Drawn once at 400x500 and stretched to the
 * element, which keeps the notches round as long as the element is 4:5.
 */
export function stampMask(): string {
  const W = 400;
  const H = 500;
  const R = 11;
  const NX = 12;
  const NY = 15;
  const notch = (cx: number, cy: number) =>
    `M${(cx - R).toFixed(1)} ${cy.toFixed(1)}a${R} ${R} 0 1 0 ${2 * R} 0a${R} ${R} 0 1 0 ${-2 * R} 0Z`;
  let d = `M0 0H${W}V${H}H0Z`;
  for (let i = 0; i <= NX; i++) {
    const x = (W / NX) * i;
    d += notch(x, 0) + notch(x, H);
  }
  for (let j = 1; j < NY; j++) {
    const y = (H / NY) * j;
    d += notch(0, y) + notch(W, y);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><path fill="#000" fill-rule="evenodd" d="${d}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/** Fine paper grain, multiplied over the stamp at low opacity. */
export function paperGrain(): string {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>';
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
