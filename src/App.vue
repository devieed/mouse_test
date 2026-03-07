<template>
  <div class="app-wrapper">
    <!-- Main Content -->
    <div class="container">
      <header class="page-header">
        <h1 class="title">{{ t('title') }}</h1>
        <p class="subtitle">{{ t('subtitle') }}</p>
        
        <!-- Language Selector in Header -->
        <div class="language-selector-inline">
          <select v-model="currentLocale" @change="changeLanguage" class="lang-dropdown">
            <option value="ko">🇰🇷 한국어</option>
            <option value="en">🇺🇸 English</option>
            <option value="zh-CN">🇨🇳 简体中文</option>
            <option value="zh-TW">🇹🇼 繁體中文</option>
            <option value="ja">🇯🇵 日本語</option>
            <option value="de">🇩🇪 Deutsch</option>
            <option value="fr">🇫🇷 Français</option>
          </select>
        </div>
      </header>

      <!-- Stats Display -->
      <div class="stats-container">
        <div class="stat-card left-click">
          <div class="stat-icon">🖱️</div>
          <div class="stat-label">{{ t('leftClickSpeed') }}</div>
          <div class="stat-value">{{ t('clicksPerSecond', { count: leftClickSpeed.toFixed(1) }) }}</div>
          <div class="stat-count">{{ t('totalClicks') }}: {{ leftClickCount }}</div>
        </div>

        <div class="stat-card right-click">
          <div class="stat-icon">🖱️</div>
          <div class="stat-label">{{ t('rightClickSpeed') }}</div>
          <div class="stat-value">{{ t('clicksPerSecond', { count: rightClickSpeed.toFixed(1) }) }}</div>
          <div class="stat-count">{{ t('totalClicks') }}: {{ rightClickCount }}</div>
        </div>
      </div>

      <!-- Level progress bar: current level (left) → next level (right) -->
      <div class="progress-section">
        <span class="progress-label progress-current">{{ progressCurrentLabel }}</span>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" :style="{ width: displayProgressPercent + '%' }"></div>
        </div>
        <span class="progress-label progress-next">{{ progressNextLabel }}</span>
      </div>

      <!-- Live CPS milestone message (above test area so not covered) -->
      <Transition name="milestone">
        <div v-if="milestoneMessage" class="milestone-toast" role="status">
          {{ milestoneMessage }}
        </div>
      </Transition>

      <!-- Test Area -->
      <div 
        class="test-area"
        @click="handleLeftClick"
        @contextmenu.prevent="handleRightClick"
        :class="{ active: isActive }"
      >
        <div class="test-icon">{{ isActive ? '⚡' : '👆' }}</div>
        <div class="test-text">{{ isActive ? t('testing') : t('clickHere') }}</div>
        <div class="test-hint">{{ t('testHint') }}</div>
      </div>

      <button class="reset-button" @click="reset">
        <span class="button-icon">🔄</span>
        {{ t('reset') }}
      </button>

      <!-- How to Use Section -->
      <section class="info-section" id="how-to-use">
        <h2 class="section-title">{{ t('howToUse.title') }}</h2>
        <div class="steps-container">
          <div class="step-card">
            <div class="step-number">1</div>
            <h3>{{ t('howToUse.step1Title') }}</h3>
            <p>{{ t('howToUse.step1Desc') }}</p>
          </div>
          <div class="step-card">
            <div class="step-number">2</div>
            <h3>{{ t('howToUse.step2Title') }}</h3>
            <p>{{ t('howToUse.step2Desc') }}</p>
          </div>
          <div class="step-card">
            <div class="step-number">3</div>
            <h3>{{ t('howToUse.step3Title') }}</h3>
            <p>{{ t('howToUse.step3Desc') }}</p>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="info-section features-section" id="features">
        <h2 class="section-title">{{ t('features.title') }}</h2>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">⚡</div>
            <h3>{{ t('features.accurate') }}</h3>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🎮</div>
            <h3>{{ t('features.gaming') }}</h3>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📱</div>
            <h3>{{ t('features.mobile') }}</h3>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🆓</div>
            <h3>{{ t('features.free') }}</h3>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🌍</div>
            <h3>{{ t('features.multilang') }}</h3>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔒</div>
            <h3>{{ t('features.privacy') }}</h3>
          </div>
        </div>
      </section>

      <!-- CPS Level & Game Guide Section -->
      <section class="info-section cps-guide-section" id="cps-guide">
        <h2 class="section-title">{{ t('cpsGuide.title') }}</h2>
        <p class="cps-guide-intro">{{ t('cpsGuide.intro') }}</p>
        <div class="cps-guide-table-wrapper">
          <table class="cps-guide-table">
            <thead>
              <tr>
                <th>{{ t('cpsGuide.level') }}</th>
                <th>{{ t('cpsGuide.cpsRange') }}</th>
                <th>{{ t('cpsGuide.description') }}</th>
                <th>{{ t('cpsGuide.games') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ t('cpsGuide.row1Level') }}</td>
                <td><strong>{{ t('cpsGuide.row1Range') }}</strong></td>
                <td>{{ t('cpsGuide.row1Desc') }}</td>
                <td>{{ t('cpsGuide.row1Games') }}</td>
              </tr>
              <tr>
                <td>{{ t('cpsGuide.row2Level') }}</td>
                <td><strong>{{ t('cpsGuide.row2Range') }}</strong></td>
                <td>{{ t('cpsGuide.row2Desc') }}</td>
                <td>{{ t('cpsGuide.row2Games') }}</td>
              </tr>
              <tr>
                <td>{{ t('cpsGuide.row3Level') }}</td>
                <td><strong>{{ t('cpsGuide.row3Range') }}</strong></td>
                <td>{{ t('cpsGuide.row3Desc') }}</td>
                <td>{{ t('cpsGuide.row3Games') }}</td>
              </tr>
              <tr>
                <td>{{ t('cpsGuide.row4Level') }}</td>
                <td><strong>{{ t('cpsGuide.row4Range') }}</strong></td>
                <td>{{ t('cpsGuide.row4Desc') }}</td>
                <td>{{ t('cpsGuide.row4Games') }}</td>
              </tr>
              <tr>
                <td>{{ t('cpsGuide.row5Level') }}</td>
                <td><strong>{{ t('cpsGuide.row5Range') }}</strong></td>
                <td>{{ t('cpsGuide.row5Desc') }}</td>
                <td>{{ t('cpsGuide.row5Games') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="info-section faq-section" id="faq">
        <h2 class="section-title">{{ t('faq.title') }}</h2>
        <div class="faq-container">
          <details class="faq-item">
            <summary>{{ t('faq.q1') }}</summary>
            <p>{{ t('faq.a1') }}</p>
          </details>
          <details class="faq-item">
            <summary>{{ t('faq.q2') }}</summary>
            <p>{{ t('faq.a2') }}</p>
          </details>
          <details class="faq-item">
            <summary>{{ t('faq.q3') }}</summary>
            <p>{{ t('faq.a3') }}</p>
          </details>
          <details class="faq-item">
            <summary>{{ t('faq.q4') }}</summary>
            <p>{{ t('faq.a4') }}</p>
          </details>
          <details class="faq-item">
            <summary>{{ t('faq.q5') }}</summary>
            <p>{{ t('faq.a5') }}</p>
          </details>
        </div>
      </section>

    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-links">
          <a href="/about.html" target="_blank">{{ t('footer.about') }}</a>
          <span class="separator">|</span>
          <a href="/privacy.html" target="_blank">{{ t('footer.privacy') }}</a>
          <span class="separator">|</span>
          <a href="/terms.html" target="_blank">{{ t('footer.terms') }}</a>
        </div>
        <div class="footer-copyright">
          © 2026 CPS Test - Mouse Click Speed Test. All rights reserved.
        </div>
        <div class="footer-contact">
          Contact: <a href="mailto:3709083@gmail.com">3709083@gmail.com</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSeoMeta } from './composables/useSeoMeta'
import i18n, { updateURLLanguage } from './i18n'

const { t, locale } = useI18n()

const leftClickCount = ref(0)
const rightClickCount = ref(0)
const leftClickSpeed = ref(0)
const rightClickSpeed = ref(0)
const isActive = ref(false)

let leftClickTimes = []
let rightClickTimes = []
const speedWindow = 1000 // 1秒时间窗口

const currentLocale = ref(locale.value)

// Live milestone: show message when user reaches 5, 7, 10, 15 CPS (once per tier per session)
const lastMilestoneShown = ref(0)
const milestoneKey = ref('') // 'at5' | 'at7' | 'at10' | 'at15' — use key so message updates when locale changes
const milestoneMessage = computed(() => milestoneKey.value ? t('cpsReached.' + milestoneKey.value) : '')

const currentMaxCps = computed(() => Math.max(leftClickSpeed.value, rightClickSpeed.value))

// Progress bar: current tier (1-5) and fill % toward next tier
const progressTier = computed(() => {
  const cps = currentMaxCps.value
  if (cps < 5) return 1
  if (cps < 7) return 2
  if (cps < 10) return 3
  if (cps < 15) return 4
  return 5
})

const progressPercent = computed(() => {
  const cps = currentMaxCps.value
  if (cps < 5) return Math.min(100, (cps / 5) * 100)
  if (cps < 7) return Math.min(100, ((cps - 5) / 2) * 100)
  if (cps < 10) return Math.min(100, ((cps - 7) / 3) * 100)
  if (cps < 15) return Math.min(100, ((cps - 10) / 5) * 100)
  return 100
})

const progressCurrentLabel = computed(() => t('cpsGuide.row' + progressTier.value + 'Level'))
const progressNextLabel = computed(() =>
  progressTier.value < 5 ? t('cpsGuide.row' + (progressTier.value + 1) + 'Level') : t('progress.maxReached')
)

// Smoothed progress for the bar: lerps toward progressPercent so bar grows/shrinks smoothly
const displayProgressPercent = ref(0)
let rafId = 0
function tick() {
  const target = progressPercent.value
  const current = displayProgressPercent.value
  displayProgressPercent.value = current + (target - current) * 0.1
  rafId = requestAnimationFrame(tick)
}
onMounted(() => {
  useSeoMeta(i18n)
  rafId = requestAnimationFrame(tick)
})
onUnmounted(() => cancelAnimationFrame(rafId))

watch(currentMaxCps, (maxCps) => {
  if (maxCps >= 15 && lastMilestoneShown.value < 15) {
    lastMilestoneShown.value = 15
    milestoneKey.value = 'at15'
    return
  }
  if (maxCps >= 10 && lastMilestoneShown.value < 10) {
    lastMilestoneShown.value = 10
    milestoneKey.value = 'at10'
    return
  }
  if (maxCps >= 7 && lastMilestoneShown.value < 7) {
    lastMilestoneShown.value = 7
    milestoneKey.value = 'at7'
    return
  }
  if (maxCps >= 5 && lastMilestoneShown.value < 5) {
    lastMilestoneShown.value = 5
    milestoneKey.value = 'at5'
  }
})

const handleLeftClick = () => {
  isActive.value = true
  const now = Date.now()
  leftClickCount.value++
  leftClickTimes.push(now)
  
  // 移除超过时间窗口的点击
  leftClickTimes = leftClickTimes.filter(time => now - time < speedWindow)
  
  // 计算速度（次/秒）
  leftClickSpeed.value = leftClickTimes.length
  
  // 发送Google Analytics事件
  if (window.gtag) {
    window.gtag('event', 'left_click', {
      event_category: 'mouse_test',
      event_label: 'left_button'
    })
  }
}

const handleRightClick = () => {
  isActive.value = true
  const now = Date.now()
  rightClickCount.value++
  rightClickTimes.push(now)
  
  // 移除超过时间窗口的点击
  rightClickTimes = rightClickTimes.filter(time => now - time < speedWindow)
  
  // 计算速度（次/秒）
  rightClickSpeed.value = rightClickTimes.length
  
  // 发送Google Analytics事件
  if (window.gtag) {
    window.gtag('event', 'right_click', {
      event_category: 'mouse_test',
      event_label: 'right_button'
    })
  }
}

const reset = () => {
  leftClickCount.value = 0
  rightClickCount.value = 0
  leftClickSpeed.value = 0
  rightClickSpeed.value = 0
  leftClickTimes = []
  rightClickTimes = []
  isActive.value = false
  lastMilestoneShown.value = 0
  milestoneKey.value = ''
  displayProgressPercent.value = 0
  
  // 发送Google Analytics事件
  if (window.gtag) {
    window.gtag('event', 'reset', {
      event_category: 'mouse_test'
    })
  }
}

const changeLanguage = () => {
  locale.value = currentLocale.value
  
  // 更新URL参数
  updateURLLanguage(currentLocale.value)
  
  // 发送Google Analytics事件
  if (window.gtag) {
    window.gtag('event', 'language_change', {
      event_category: 'settings',
      event_label: currentLocale.value
    })
  }
}
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.container {
  flex: 1;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

/* Header */
.page-header {
  text-align: center;
  padding: 40px 20px 20px;
}

.title {
  font-size: 2.8rem;
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 40px;
  line-height: 1.6;
}

/* Stats Container */
.stats-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
  padding: 0 20px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.stat-card {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-card.left-click {
  border-color: #667eea;
}

.stat-card.left-click:hover {
  border-color: #667eea;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
}

.stat-card.right-click {
  border-color: #f093fb;
}

.stat-card.right-click:hover {
  border-color: #f093fb;
  background: linear-gradient(135deg, #fff5fc 0%, #ffffff 100%);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.stat-value {
  font-size: 3rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px;
  font-variant-numeric: tabular-nums;
}

.stat-count {
  font-size: 0.9rem;
  color: #888;
}

/* Level progress bar */
.progress-section {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 0 20px 24px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.progress-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2c3e50;
  flex-shrink: 0;
  min-width: 4.5em;
}

.progress-label.progress-current {
  text-align: right;
}

.progress-label.progress-next {
  text-align: left;
  color: #667eea;
}

.progress-bar-wrap {
  flex: 1;
  height: 12px;
  background: #e9ecef;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 999px;
  transition: width 0.08s ease-out;
}

@media (max-width: 600px) {
  .progress-section {
    flex-wrap: wrap;
    gap: 10px;
  }
  .progress-label {
    min-width: auto;
    font-size: 0.85rem;
  }
  .progress-label.progress-current {
    order: 1;
    width: 50%;
    text-align: left;
  }
  .progress-label.progress-next {
    order: 3;
    width: 50%;
    text-align: right;
  }
  .progress-bar-wrap {
    order: 2;
    width: 100%;
  }
}

/* Test Area */
.test-area {
  background: white;
  border: 3px dashed #ddd;
  border-radius: 20px;
  padding: 60px 40px;
  margin: 30px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  text-align: center;
}

.test-area:hover {
  border-color: #667eea;
  background: #fafbff;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.1);
}

.test-area.active {
  background: linear-gradient(135deg, #fff9e6 0%, #ffe6f0 100%);
  border-color: #667eea;
  border-style: solid;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.test-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.test-text {
  font-size: 1.5rem;
  color: #333;
  font-weight: 600;
  margin-bottom: 8px;
}

.test-hint {
  font-size: 0.95rem;
  color: #888;
}

/* Live CPS milestone toast */
.milestone-toast {
  margin: 16px 20px 24px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 600;
  text-align: center;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  line-height: 1.5;
}

.milestone-enter-active,
.milestone-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.milestone-enter-from,
.milestone-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* Reset Button */
.reset-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 36px;
  font-size: 1rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto 40px;
  display: flex;
  justify-content: center;
  max-width: 200px;
}

.reset-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.reset-button:active {
  transform: translateY(0);
}

.button-icon {
  font-size: 1.2rem;
}

/* Info Sections */
.info-section {
  background: white;
  padding: 40px 30px;
  margin: 30px 20px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
  font-weight: 700;
}

/* How to Use Steps */
.steps-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 25px;
}

@media (max-width: 900px) {
  .steps-container {
    grid-template-columns: 1fr;
  }
}

.step-card {
  text-align: center;
  padding: 25px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.step-card:hover {
  background: #f0f2f5;
  transform: translateY(-3px);
}

.step-number {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 auto 15px;
}

.step-card h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

.step-card p {
  font-size: 0.95rem;
  color: #666;
  line-height: 1.6;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

@media (max-width: 900px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.feature-item {
  text-align: center;
  padding: 20px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: #f8f9fa;
  transform: translateY(-3px);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.feature-item h3 {
  font-size: 0.95rem;
  color: #333;
  font-weight: 600;
}

/* FAQ Section */
.faq-container {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  background: #f8f9fa;
  margin-bottom: 15px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e9ecef;
}

.faq-item summary {
  padding: 18px 20px;
  cursor: pointer;
  font-weight: 600;
  color: #333;
  font-size: 1rem;
  user-select: none;
  transition: all 0.2s ease;
}

.faq-item summary:hover {
  background: #e9ecef;
}

.faq-item p {
  padding: 0 20px 18px 20px;
  color: #666;
  line-height: 1.7;
  font-size: 0.95rem;
}

.faq-item[open] summary {
  background: #e9ecef;
  border-bottom: 1px solid #dee2e6;
}

/* CPS Guide Section */
.cps-guide-section {
  margin-top: 20px;
}

.cps-guide-intro {
  max-width: 800px;
  margin: 0 auto 24px;
  color: #555;
  line-height: 1.7;
  font-size: 1rem;
  text-align: center;
}

.cps-guide-table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  background: #fafbfc;
}

.cps-guide-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.cps-guide-table th,
.cps-guide-table td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.cps-guide-table th {
  background: #667eea;
  color: white;
  font-weight: 600;
  white-space: nowrap;
}

.cps-guide-table th:first-child {
  border-radius: 12px 0 0 0;
}

.cps-guide-table th:last-child {
  border-radius: 0 12px 0 0;
}

.cps-guide-table tbody tr:hover {
  background: #f0f2f5;
}

.cps-guide-table tbody tr:last-child td {
  border-bottom: none;
}

.cps-guide-table td:first-child {
  font-weight: 600;
  color: #2c3e50;
}

.cps-guide-table td:nth-child(2) {
  font-variant-numeric: tabular-nums;
}

@media (max-width: 768px) {
  .cps-guide-table th,
  .cps-guide-table td {
    padding: 10px 12px;
    font-size: 0.85rem;
  }
}

/* Language Selector - Inline in Header */
.language-selector-inline {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lang-dropdown {
  padding: 12px 20px;
  font-size: 1rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  min-width: 180px;
}

.lang-dropdown:hover {
  border-color: #4facfe;
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.2);
  transform: translateY(-2px);
}

.lang-dropdown:focus {
  outline: none;
  border-color: #4facfe;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.15);
}

@media (max-width: 768px) {
  .lang-dropdown {
    font-size: 0.9rem;
    padding: 10px 16px;
    min-width: 160px;
  }
}

/* Footer */
.footer {
  background: #2c3e50;
  color: white;
  padding: 40px 20px 30px;
  margin-top: 60px;
}

.footer-content {
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
}

.footer-links {
  margin-bottom: 15px;
  font-size: 0.95rem;
}

.footer-links a {
  color: white;
  text-decoration: none;
  transition: opacity 0.3s ease;
  padding: 0 12px;
}

.footer-links a:hover {
  opacity: 0.8;
}

.footer-links .separator {
  color: rgba(255, 255, 255, 0.4);
  margin: 0 5px;
}

.footer-copyright {
  font-size: 0.9rem;
  opacity: 0.7;
  margin-bottom: 8px;
}

.footer-contact {
  font-size: 0.85rem;
  opacity: 0.7;
}

.footer-contact a {
  color: #8ab4f8;
  text-decoration: none;
}

.footer-contact a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .test-area {
    padding: 50px 20px;
  }
  
  .steps-container {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .info-section {
    padding: 30px 20px;
    margin: 20px 10px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1.6rem;
  }
  
  .stat-value {
    font-size: 2.5rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>

