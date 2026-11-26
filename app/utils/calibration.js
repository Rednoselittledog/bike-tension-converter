const COMBINED_2MM_COEFFICIENTS = {
  a: 24.9188245263,
  b: -82.725920818,
  c: 98.8177989573,
}

export const CALIBRATIONS = [{
  id: 'combined-2mm',
  name: 'Combined 2.0 mm spokes',
  description: 'Pooled quadratic regression from CN STD 14C, CN MAC 14, DT Swiss Champion, and Sapim Leader.',
  coefficients: COMBINED_2MM_COEFFICIENTS,
  tensionRange: { min: 50, max: 150 },
  gaugeRange: { min: 2.5522, max: 3.8529 },
  sourceGaugeRange: { min: 2.52, max: 3.9 },
}]

// No range limits: values outside tensionRange/gaugeRange are extrapolated from the curve.
export function calculateTension(gaugeReading, calibration) {
  if (!Number.isFinite(gaugeReading)) return null
  const { a, b, c } = calibration.coefficients
  return a * gaugeReading ** 2 + b * gaugeReading + c
}

export function calculateGaugeReading(tension, calibration) {
  if (!Number.isFinite(tension)) return null
  const { a, b, c } = calibration.coefficients
  const discriminant = b ** 2 - 4 * a * (c - tension)
  if (discriminant < 0) return null
  // Larger root = the rising branch of the curve, where real gauge readings live (a > 0).
  return (-b + Math.sqrt(discriminant)) / (2 * a)
}

export function formatValue(value, digits = 2) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}
