<template>
  <div class="app-wrapper">
    <div class="container">
      <h1 class="title">{{ t('title') }}</h1>
      
      <div class="instruction">
        {{ t('instruction') }}
      </div>

      <div class="stats-container">
        <div class="stat-card left-click">
          <div class="stat-label">{{ t('leftClickSpeed') }}</div>
          <div class="stat-value">{{ t('clicksPerSecond', { count: leftClickSpeed.toFixed(1) }) }}</div>
          <div class="stat-count">{{ t('leftClick') }}: {{ leftClickCount }}</div>
        </div>

        <div class="stat-card right-click">
          <div class="stat-label">{{ t('rightClickSpeed') }}</div>
          <div class="stat-value">{{ t('clicksPerSecond', { count: rightClickSpeed.toFixed(1) }) }}</div>
          <div class="stat-count">{{ t('rightClick') }}: {{ rightClickCount }}</div>
        </div>
      </div>

      <div 
        class="test-area"
        @click="handleLeftClick"
        @contextmenu.prevent="handleRightClick"
        :class="{ active: isActive }"
      >
        <div class="test-text">{{ isActive ? t('testing') : t('clickHere') }}</div>
      </div>

      <button class="reset-button" @click="reset">{{ t('reset') }}</button>

      <div class="language-selector">
        <select v-model="currentLocale" @change="changeLanguage">
          <option value="zh-CN">简体中文</option>
          <option value="zh-TW">繁體中文</option>
          <option value="en">English</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
          <option value="de">Deutsch</option>
          <option value="fr">Français</option>
        </select>
      </div>
    </div>

    <footer class="footer">
      <div class="footer-links">
        <a href="/about.html" target="_blank">{{ t('footer.about') }}</a>
        <span class="separator">|</span>
        <a href="/privacy.html" target="_blank">{{ t('footer.privacy') }}</a>
        <span class="separator">|</span>
        <a href="/terms.html" target="_blank">{{ t('footer.terms') }}</a>
      </div>
      <div class="footer-copyright">
        © 2026 Mouse Click Speed Test. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSeoMeta } from './composables/useSeoMeta'
import i18n, { updateURLLanguage } from './i18n'

const { t, locale } = useI18n()

// SEO meta management
onMounted(() => {
  useSeoMeta(i18n)
})

const leftClickCount = ref(0)
const rightClickCount = ref(0)
const leftClickSpeed = ref(0)
const rightClickSpeed = ref(0)
const isActive = ref(false)

let leftClickTimes = []
let rightClickTimes = []
const speedWindow = 1000 // 1秒时间窗口

const currentLocale = ref(locale.value)

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
}

.container {
  flex: 1;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
}

.instruction {
  color: #666;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.stats-container {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px;
  border-radius: 15px;
  min-width: 250px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card.left-click {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card.right-click {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-label {
  font-size: 1rem;
  margin-bottom: 10px;
  opacity: 0.9;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.stat-count {
  font-size: 0.9rem;
  opacity: 0.8;
}

.test-area {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  border: 3px dashed #999;
  border-radius: 20px;
  padding: 80px 40px;
  margin: 30px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.test-area:hover {
  border-color: #667eea;
  transform: scale(1.02);
}

.test-area.active {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  border-color: #667eea;
  border-style: solid;
}

.test-text {
  font-size: 1.5rem;
  color: #555;
  font-weight: 500;
}

.reset-button {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.1rem;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.reset-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.reset-button:active {
  transform: translateY(0);
}

.language-selector {
  margin-top: 40px;
}

.language-selector select {
  padding: 10px 20px;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 10px;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.language-selector select:hover {
  border-color: #667eea;
}

.language-selector select:focus {
  outline: none;
  border-color: #667eea;
}

@media (max-width: 600px) {
  .title {
    font-size: 2rem;
  }
  
  .stats-container {
    flex-direction: column;
    align-items: center;
  }
  
  .stat-card {
    width: 100%;
    max-width: 300px;
  }
  
  .test-area {
    padding: 60px 20px;
  }
}

.footer {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px 20px;
  text-align: center;
  margin-top: 60px;
}

.footer-links {
  margin-bottom: 15px;
  font-size: 1rem;
}

.footer-links a {
  color: white;
  text-decoration: none;
  transition: opacity 0.3s ease;
  padding: 0 10px;
}

.footer-links a:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.footer-links .separator {
  color: rgba(255, 255, 255, 0.6);
  margin: 0 5px;
}

.footer-copyright {
  font-size: 0.9rem;
  opacity: 0.8;
}
</style>

