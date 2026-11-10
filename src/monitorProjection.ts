// Map a full-resolution logical desktop to the calibrated physical screen corners.
export function monitorProjection(
  width: number,
  height: number,
  clipPath: string,
  sourceWidth = width,
): string {
  if (width <= 0 || height <= 0 || sourceWidth <= 0) return 'none';
  const values = Array.from(
    clipPath.matchAll(/(-?\d*\.?\d+)(%|px)/g),
    ([, value, unit], index) =>
      Number(value) / (unit === '%' ? 100 : index % 2 === 0 ? width : height),
  );
  if (values.length !== 8) return 'none';
  const [x0, y0, x1, y1, x2, y2, x3, y3] = values;
  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const dy3 = y0 - y1 + y2 - y3;
  const denominator = dx1 * dy2 - dx2 * dy1;
  if (Math.abs(denominator) < 1e-10) return 'none';
  const g = (dx3 * dy2 - dx2 * dy3) / denominator;
  const h = (dx1 * dy3 - dx3 * dy1) / denominator;
  const a = x1 - x0 + g * x1;
  const b = x3 - x0 + h * x3;
  const d = y1 - y0 + g * y1;
  const e = y3 - y0 + h * y3;
  const scale = width / sourceWidth;
  return `matrix3d(${[
    a * scale,
    ((d * height) / width) * scale,
    0,
    g / sourceWidth,
    ((b * width) / height) * scale,
    e * scale,
    0,
    (h / height) * scale,
    0,
    0,
    1,
    0,
    x0 * width,
    y0 * height,
    0,
    1,
  ].join(',')})`;
}
