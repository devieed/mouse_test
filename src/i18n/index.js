import { createI18n } from 'vue-i18n'
import messages from './messages'

// 从URL参数获取语言
function getLanguageFromURL() {
  const params = new URLSearchParams(window.location.search)
  const lang = params.get('lang')
  
  if (lang) {
    // 语言代码标准化
    const langMap = {
      'zh': 'zh-CN',
      'zh-cn': 'zh-CN',
      'zh-hans': 'zh-CN',
      'cn': 'zh-CN',
      'zh-tw': 'zh-TW',
      'zh-hant': 'zh-TW',
      'tw': 'zh-TW',
      'en': 'en',
      'ja': 'ja',
      'jp': 'ja',
      'ko': 'ko',
      'kr': 'ko',
      'de': 'de',
      'fr': 'fr'
    }
    
    const normalizedLang = langMap[lang.toLowerCase()] || lang
    
    // 验证语言是否支持
    if (messages[normalizedLang]) {
      return normalizedLang
    }
  }
  
  return null
}

// 获取浏览器语言并匹配支持的语言
function getBrowserLocale() {
  const browserLang = navigator.language || navigator.userLanguage
  
  // 语言映射
  const localeMap = {
    'zh-CN': 'zh-CN',
    'zh-SG': 'zh-CN',
    'zh': 'zh-CN',
    'zh-TW': 'zh-TW',
    'zh-HK': 'zh-TW',
    'zh-MO': 'zh-TW',
    'en': 'en',
    'en-US': 'en',
    'en-GB': 'en',
    'ja': 'ja',
    'ja-JP': 'ja',
    'ko': 'ko',
    'ko-KR': 'ko',
    'de': 'de',
    'de-DE': 'de',
    'fr': 'fr',
    'fr-FR': 'fr'
  }
  
  // 精确匹配
  if (localeMap[browserLang]) {
    return localeMap[browserLang]
  }
  
  // 匹配主语言代码
  const mainLang = browserLang.split('-')[0]
  if (localeMap[mainLang]) {
    return localeMap[mainLang]
  }
  
  // 默认英文
  return 'en'
}

// 获取初始语言：优先URL参数，其次浏览器语言
function getInitialLocale() {
  return getLanguageFromURL() || getBrowserLocale()
}

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages
})

// 导出语言切换函数
export function setLanguageFromURL() {
  const urlLang = getLanguageFromURL()
  if (urlLang && urlLang !== i18n.global.locale.value) {
    i18n.global.locale.value = urlLang
  }
}

// 导出更新URL参数的函数
export function updateURLLanguage(locale) {
  const url = new URL(window.location.href)
  url.searchParams.set('lang', locale)
  window.history.replaceState({}, '', url.toString())
}

export default i18n


