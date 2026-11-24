<script setup>
import { computed, ref } from 'vue'
import { CALIBRATIONS, calculateGaugeReading, calculateTension, formatValue } from '~/utils/calibration'

const calibrationId = ref(CALIBRATIONS[0].id)
const mode = ref('tension')
const inputValue = ref('100')
const preservedInputValue = ref(null)
const calibration = computed(() => CALIBRATIONS.find(item => item.id === calibrationId.value) ?? CALIBRATIONS[0])
const inputLabel = computed(() => mode.value === 'tension' ? 'Spoke tension' : 'Gauge reading')
const inputUnit = computed(() => mode.value === 'tension' ? 'kgf' : 'mm')
const outputLabel = computed(() => mode.value === 'tension' ? 'Gauge reading' : 'Spoke tension')
const outputUnit = computed(() => mode.value === 'tension' ? 'mm' : 'kgf')
const inputRange = computed(() => mode.value === 'tension' ? calibration.value.tensionRange : calibration.value.gaugeRange)
const numericInput = computed(() => preservedInputValue.value ?? Number(inputValue.value))
const result = computed(() => mode.value === 'tension'
  ? calculateGaugeReading(numericInput.value, calibration.value)
  : calculateTension(numericInput.value, calibration.value))
const errorMessage = computed(() => {
  if (inputValue.value === '') return 'กรอกค่าที่ต้องการแปลง'
  if (!Number.isFinite(numericInput.value)) return 'กรุณากรอกตัวเลข'
  return result.value === null ? `รุ่นนี้รองรับ ${formatValue(inputRange.value.min)}–${formatValue(inputRange.value.max)} ${inputUnit.value}` : ''
})

function flipDirection() {
  const previousResult = result.value
  if (previousResult !== null) {
    preservedInputValue.value = previousResult
    inputValue.value = previousResult.toFixed(2)
  }
  mode.value = mode.value === 'tension' ? 'gauge' : 'tension'
}

function handleInput() {
  preservedInputValue.value = null
}
</script>

<template>
  <main class="page-shell">
    <section class="calculator" aria-labelledby="page-title">
      <header class="intro">
        <h1 id="page-title">Spoke converter</h1>
        <p class="calibration-note">2.0 mm spokes</p>
        <code class="equation">T = 24.919m² − 82.726m + 98.818</code>
      </header>
      <div class="conversion-grid">
        <div class="field-group">
          <label for="source-value">{{ inputLabel }}</label>
          <div class="number-input">
            <input id="source-value" v-model="inputValue" inputmode="decimal" type="number" step="0.01" :min="inputRange.min" :max="inputRange.max" :aria-describedby="errorMessage ? 'range-message' : 'range-hint'" @input="handleInput">
            <span>{{ inputUnit }}</span>
          </div>
          <p id="range-hint" class="help-text">{{ formatValue(inputRange.min) }}–{{ formatValue(inputRange.max) }} {{ inputUnit }}</p>
        </div>
        <button class="flip-button" type="button" aria-label="สลับทิศทางการแปลง" @click="flipDirection">⇄<span>สลับ</span></button>
        <output class="result" :class="{ invalid: result === null }" aria-live="polite">
          <span>{{ outputLabel }}</span>
          <strong v-if="result !== null">{{ formatValue(result) }}</strong><strong v-else>—</strong>
          <small>{{ outputUnit }}</small>
        </output>
      </div>
      <p v-if="errorMessage" id="range-message" class="error-message" role="alert">{{ errorMessage }}</p>
    </section>
  </main>
</template>

<style>
:root { color: #f4f7f5; background: #0b1110; font-family: Inter, ui-sans-serif, system-ui, sans-serif; } * { box-sizing: border-box; } body { margin: 0; } button, input, select { font: inherit; }
.page-shell { min-height: 100vh; display: grid; place-items: center; padding: 2rem 1rem; background: radial-gradient(circle at 15% 0%, #18352d 0, transparent 30rem), radial-gradient(circle at 90% 100%, #201c3d 0, transparent 34rem), #0b1110; }
.calculator { width: min(100%, 48rem); padding: clamp(1.5rem, 5vw, 3.25rem); background: rgb(16 24 23 / 92%); border: 1px solid #2d3a37; border-radius: 1.25rem; box-shadow: 0 2rem 5rem rgb(0 0 0 / 38%); }
.intro { margin-bottom: 2.25rem; } h1 { margin: 0; font-family: Georgia, serif; font-size: clamp(2.35rem, 7vw, 4.5rem); line-height: .93; letter-spacing: -.055em; } .calibration-note { margin: .9rem 0 .55rem; color: #8ce0b5; font-size: .85rem; font-weight: 700; letter-spacing: .04em; } .equation { color: #8b9e96; font-size: .78rem; }
.field-group { display: grid; gap: .55rem; } label, .result > span { color: #e8efeb; font-size: .9rem; font-weight: 750; } select, input { width: 100%; min-height: 3.5rem; border: 1px solid #3a4c46; border-radius: .65rem; background: #111a18; padding: .75rem .9rem; color: #f4f7f5; transition: border-color .15s ease, background .15s ease; } select:hover, input:hover { border-color: #668278; } select:focus, input:focus, .flip-button:focus-visible { outline: 3px solid #7adba9; outline-offset: 3px; border-color: #7adba9; } .help-text, .muted { margin: 0; color: #899b94; font-size: .84rem; line-height: 1.55; }
.conversion-grid { display: grid; grid-template-columns: 1fr auto 1fr; align-items: end; gap: 1.15rem; margin: 0; } .number-input { position: relative; } .number-input input { padding-right: 4.25rem; font-size: 1.45rem; font-weight: 750; letter-spacing: -.02em; } .number-input span { position: absolute; top: 50%; right: 1rem; transform: translateY(-50%); color: #8ce0b5; font-size: .9rem; font-weight: 700; } .flip-button { display: grid; place-items: center; width: 3.35rem; height: 3.35rem; border: 1px solid #76d4a5; border-radius: 50%; background: #76d4a5; color: #092016; cursor: pointer; box-shadow: 0 .5rem 1.5rem rgb(77 209 147 / 20%); transition: transform .15s ease, background .15s ease; } .flip-button span { display: none; } .flip-button:hover { background: #a7ecc7; transform: translateY(-2px); }
.result { min-height: 7.8rem; display: grid; align-content: center; padding: 1.15rem 1.25rem; border: 1px solid #344e44; border-left: .32rem solid #76d4a5; border-radius: .75rem; background: linear-gradient(135deg, #15241f, #111918); } .result strong { margin-top: .35rem; color: #f5fff9; font-size: clamp(2.35rem, 5vw, 3.4rem); line-height: .95; letter-spacing: -.055em; } .result small { margin-top: .45rem; color: #8ce0b5; font-weight: 700; } .result.invalid { border-color: #ff8e80; } .error-message { margin: 0; color: #ffaea5; font-weight: 650; }
@media (max-width: 42rem) { .calculator { border-radius: .9rem; } .conversion-grid { grid-template-columns: 1fr; } .flip-button { transform: rotate(90deg); justify-self: center; } .flip-button:hover { transform: rotate(90deg) translateY(-2px); } .result { min-height: 6.3rem; } }
</style>
