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

function isWithinRange(value, range) {
  return Number.isFinite(value) && value >= range.min && value <= range.max
}

export function calculateTension(gaugeReading, calibration) {
  if (!isWithinRange(gaugeReading, calibration.gaugeRange)) return null
  const { a, b, c } = calibration.coefficients
  return a * gaugeReading ** 2 + b * gaugeReading + c
}

export function calculateGaugeReading(tension, calibration) {
  if (!isWithinRange(tension, calibration.tensionRange)) return null
  const { a, b, c } = calibration.coefficients
  const discriminant = b ** 2 - 4 * a * (c - tension)
  if (discriminant < 0) return null
  const roots = [
    (-b - Math.sqrt(discriminant)) / (2 * a),
    (-b + Math.sqrt(discriminant)) / (2 * a),
  ]
  return roots.find(root => isWithinRange(root, calibration.gaugeRange)) ?? null
}

export function formatValue(value, digits = 2) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}
