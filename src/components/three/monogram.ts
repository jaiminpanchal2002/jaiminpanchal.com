/**
 * The J/ monogram: a J hook beside a forward slash (the "/" from JAIMIN / BEYOND CODE).
 * One geometry definition drives both the 3D glass object and the 2D header mark.
 * Units: the mark spans x ≈ -0.5..2.35, y = 0..2 (y up).
 */
export const MONO = {
  // J: stem x 0.55..1.0, hook centred at (0.25, 0.75), outer radius 0.75, inner 0.3
  cx: 0.25,
  cy: 0.75,
  R: 0.75,
  r: 0.3,
  top: 2,
  lip: 0.95,
  slash: [
    [1.15, 0],
    [1.6, 0],
    [2.35, 2],
    [1.9, 2],
  ] as const,
};

/** SVG path data (y flipped for screen coordinates). viewBox: "-0.6 -0.1 3.05 2.2". */
export function monogramSvgPath() {
  const { cx, cy, R, r, top, lip, slash } = MONO;
  const f = (y: number) => +(top - y).toFixed(3);
  const j = [
    `M${cx + r} ${f(top)}`,
    `L${cx + R} ${f(top)}`,
    `L${cx + R} ${f(cy)}`,
    `A${R} ${R} 0 0 1 ${cx - R} ${f(cy)}`,
    `L${cx - R} ${f(lip)}`,
    `L${cx - r} ${f(lip)}`,
    `L${cx - r} ${f(cy)}`,
    `A${r} ${r} 0 0 0 ${cx + r} ${f(cy)}`,
    "Z",
  ].join(" ");
  const s = `M${slash.map(([x, y]) => `${x} ${f(y)}`).join(" L")} Z`;
  return `${j} ${s}`;
}
