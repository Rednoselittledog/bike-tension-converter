import test from 'node:test'
import assert from 'node:assert/strict'

import {
  CALIBRATIONS,
  calculateGaugeReading,
  calculateTension,
} from '../app/utils/calibration.js'

const calibration = CALIBRATIONS[0]

test('calculates tension from a measured gauge reading', () => {
  assert.ok(Math.abs(calculateTension(3.33, calibration) - 99.6628) < 0.001)
})

test('calculates the in-range gauge reading from tension', () => {
  assert.ok(Math.abs(calculateGaugeReading(100, calibration) - 3.3340) < 0.001)
})

test('round-trips tension through the inverse without losing precision', () => {
  const gaugeReading = calculateGaugeReading(100, calibration)
  assert.ok(Math.abs(calculateTension(gaugeReading, calibration) - 100) < 0.000001)
})

test('extrapolates outside the calibration range', () => {
  assert.ok(calculateTension(2.51, calibration) < 50)
  const gaugeReading = calculateGaugeReading(160, calibration)
  assert.ok(gaugeReading > calibration.gaugeRange.max)
  assert.ok(Math.abs(calculateTension(gaugeReading, calibration) - 160) < 0.000001)
})

test('returns null only when the curve has no answer', () => {
  assert.equal(calculateGaugeReading(20, calibration), null)
  assert.equal(calculateTension(Number.NaN, calibration), null)
})

test('stores calibration metadata independently from the calculation', () => {
  assert.equal(calibration.id, 'combined-2mm')
  assert.equal(calibration.tensionRange.min, 50)
  assert.equal(calibration.sourceGaugeRange.max, 3.9)
})
