<template>
  <section
    class="reaction-section"
    :class="{ 'reaction-section--embedded': embedded }"
    id="reaction-test"
    aria-labelledby="reaction-title"
  >
    <h2 id="reaction-title" class="section-title">{{ t('reaction.title') }}</h2>
    <p class="reaction-subtitle">{{ t('reaction.subtitle') }}</p>
    <p class="reaction-precision">{{ t('reaction.precisionNote') }}</p>

    <div
      class="reaction-area"
      :class="[
        `reaction-phase--${phase}`,
        phase === 'result' && tierClass ? `reaction-tier--${tierClass}` : ''
      ]"
      role="button"
      tabindex="0"
      @click="onAreaClick"
      @keydown.enter.prevent="onAreaClick"
      @keydown.space.prevent="onAreaClick"
    >
      <template v-if="phase === 'idle'">
        <div class="reaction-icon">🟢</div>
        <div class="reaction-main">{{ t('reaction.startHint') }}</div>
        <div class="reaction-sub">{{ t('reaction.startBtn') }}</div>
      </template>
      <template v-else-if="phase === 'waiting'">
        <div class="reaction-icon reaction-pulse">🟢</div>
        <div class="reaction-main">{{ t('reaction.waiting') }}</div>
      </template>
      <template v-else-if="phase === 'ready'">
        <div class="reaction-icon reaction-shake">🔴</div>
        <div class="reaction-main reaction-flash">{{ t('reaction.clickNow') }}</div>
      </template>
      <template v-else-if="phase === 'error'">
        <div class="reaction-icon">⚠️</div>
        <div class="reaction-main reaction-error-text">{{ t('reaction.tooEarly') }}</div>
        <button type="button" class="reaction-secondary-btn" @click.stop="tryAgain">
          {{ t('reaction.tryAgain') }}
        </button>
      </template>
      <template v-else-if="phase === 'result'">
        <div class="reaction-icon">{{ tierEmoji }}</div>
        <div class="reaction-result-ms">
          {{ t('reaction.resultLabel') }}:
          <strong>{{ formattedMs }}</strong>
          {{ t('reaction.msUnit') }}
        </div>
        <div class="reaction-tier-msg">{{ tierMessage }}</div>
        <button type="button" class="reaction-secondary-btn" @click.stop="tryAgain">
          {{ t('reaction.tryAgain') }}
        </button>
      </template>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps({
  embedded: {
    type: Boolean,
    default: false
  }
})

const { t } = useI18n()

/** idle → waiting (green) → ready (red, timer starts) → result | error */
const phase = ref('idle')
const reactionMs = ref(null)
const tierClass = ref('')

let timeoutId = null
let redShownAt = 0

const MIN_DELAY_MS = 1000
const MAX_DELAY_MS = 3500

function clearWaitTimer() {
  if (timeoutId != null) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
}

function tierKeyFromMs(ms) {
  if (ms < 150) return 'elite'
  if (ms < 200) return 'excellent'
  if (ms < 250) return 'veryGood'
  if (ms < 300) return 'good'
  if (ms < 400) return 'average'
  if (ms < 500) return 'slow'
  return 'verySlow'
}

function tierI18nKey(ms) {
  const k = tierKeyFromMs(ms)
  const map = {
    elite: 'reaction.tierElite',
    excellent: 'reaction.tierExcellent',
    veryGood: 'reaction.tierVeryGood',
    good: 'reaction.tierGood',
    average: 'reaction.tierAverage',
    slow: 'reaction.tierSlow',
    verySlow: 'reaction.tierVerySlow'
  }
  return map[k] || 'reaction.tierAverage'
}

const tierMessage = computed(() => {
  if (reactionMs.value == null) return ''
  return t(tierI18nKey(reactionMs.value))
})

const tierEmoji = computed(() => {
  if (reactionMs.value == null) return '✨'
  const k = tierKeyFromMs(reactionMs.value)
  const map = {
    elite: '🏆',
    excellent: '⚡',
    veryGood: '🔥',
    good: '👍',
    average: '📊',
    slow: '🐢',
    verySlow: '💪'
  }
  return map[k] || '✨'
})

const formattedMs = computed(() => {
  if (reactionMs.value == null) return '—'
  return reactionMs.value.toFixed(2)
})

function scheduleRed() {
  clearWaitTimer()
  const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS)
  timeoutId = window.setTimeout(() => {
    timeoutId = null
    if (phase.value !== 'waiting') return
    phase.value = 'ready'
    redShownAt = performance.now()
  }, delay)
}

function startRound() {
  clearWaitTimer()
  reactionMs.value = null
  tierClass.value = ''
  phase.value = 'waiting'
  scheduleRed()
}

function onAreaClick() {
  if (phase.value === 'idle') {
    startRound()
    return
  }
  if (phase.value === 'waiting') {
    clearWaitTimer()
    phase.value = 'error'
    return
  }
  if (phase.value === 'ready') {
    const elapsed = performance.now() - redShownAt
    reactionMs.value = Math.round(elapsed * 100) / 100
    tierClass.value = tierKeyFromMs(elapsed)
    phase.value = 'result'
    return
  }
}

function tryAgain() {
  clearWaitTimer()
  reactionMs.value = null
  tierClass.value = ''
  phase.value = 'idle'
}

onUnmounted(() => {
  clearWaitTimer()
})
</script>

<style scoped>
.reaction-section {
  background: white;
  padding: 40px 30px;
  margin: 30px 20px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.reaction-section--embedded {
  margin: 0;
  padding: 28px 22px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.reaction-subtitle {
  text-align: center;
  color: #555;
  margin-bottom: 8px;
  line-height: 1.6;
}

.reaction-precision {
  text-align: center;
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 24px;
}

.reaction-area {
  min-height: 220px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 28px 20px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s ease, box-shadow 0.35s ease, transform 0.2s ease;
  border: 3px solid transparent;
}

.reaction-phase--idle {
  background: linear-gradient(180deg, #e8f5e9 0%, #c8e6c9 100%);
  border-color: #81c784;
}

.reaction-phase--waiting {
  background: linear-gradient(180deg, #c8e6c9 0%, #a5d6a7 100%);
  border-color: #66bb6a;
}

.reaction-phase--ready {
  background: linear-gradient(180deg, #ffcdd2 0%, #ef9a9a 100%);
  border-color: #e57373;
  animation: reaction-red-pulse 0.6s ease-in-out infinite alternate;
}

.reaction-phase--error {
  background: linear-gradient(180deg, #fff3e0 0%, #ffe0b2 100%);
  border-color: #ffb74d;
  cursor: default;
}

.reaction-phase--result {
  background: linear-gradient(180deg, #e3f2fd 0%, #bbdefb 100%);
  border-color: #64b5f6;
  cursor: default;
}

.reaction-tier--elite {
  box-shadow: 0 0 32px rgba(255, 215, 0, 0.85);
  border-color: #ffc107;
  animation: reaction-tier-glow 1.2s ease-in-out infinite;
}

.reaction-tier--excellent {
  box-shadow: 0 0 24px rgba(156, 39, 176, 0.45);
  border-color: #ab47bc;
}

.reaction-tier--veryGood {
  box-shadow: 0 0 20px rgba(33, 150, 243, 0.45);
  border-color: #42a5f5;
}

.reaction-tier--good {
  box-shadow: 0 0 16px rgba(76, 175, 80, 0.35);
  border-color: #66bb6a;
}

.reaction-tier--average {
  box-shadow: 0 0 12px rgba(120, 144, 156, 0.35);
}

.reaction-tier--slow,
.reaction-tier--verySlow {
  box-shadow: 0 0 10px rgba(158, 158, 158, 0.35);
}

@keyframes reaction-red-pulse {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.01);
  }
}

@keyframes reaction-tier-glow {
  0%,
  100% {
    box-shadow: 0 0 28px rgba(255, 193, 7, 0.6);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 215, 0, 0.95);
  }
}

.reaction-icon {
  font-size: 3rem;
  line-height: 1;
}

.reaction-pulse {
  animation: reaction-icon-pulse 1.2s ease-in-out infinite;
}

.reaction-shake {
  animation: reaction-shake 0.35s ease-in-out infinite;
}

@keyframes reaction-icon-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.08);
    opacity: 0.92;
  }
}

@keyframes reaction-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-3px);
  }
  75% {
    transform: translateX(3px);
  }
}

.reaction-main {
  font-size: 1.35rem;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
}

.reaction-flash {
  color: #c62828;
  animation: reaction-text-flash 0.45s ease-in-out infinite alternate;
}

@keyframes reaction-text-flash {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.75;
  }
}

.reaction-sub {
  font-size: 1rem;
  color: #388e3c;
  font-weight: 600;
}

.reaction-error-text {
  color: #e65100;
}

.reaction-result-ms {
  font-size: 1.15rem;
  color: #333;
}

.reaction-result-ms strong {
  font-size: 1.6rem;
  color: #1565c0;
  font-variant-numeric: tabular-nums;
}

.reaction-tier-msg {
  font-size: 1.05rem;
  color: #444;
  text-align: center;
  max-width: 420px;
  line-height: 1.5;
}

.reaction-secondary-btn {
  margin-top: 8px;
  padding: 10px 24px;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
}

.reaction-secondary-btn:hover {
  transform: translateY(-1px);
}

@media (max-width: 480px) {
  .reaction-area {
    min-height: 200px;
  }
  .reaction-main {
    font-size: 1.15rem;
  }
}
</style>
