import { createI18n } from 'vue-i18n'
import messages from './messages'

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

const i18n = createI18n({
  legacy: false,
  locale: getBrowserLocale(),
  fallbackLocale: 'en',
  messages
})

export default i18n

