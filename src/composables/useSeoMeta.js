import { watch } from 'vue'

export function useSeoMeta(i18n) {
  const updateMeta = () => {
    const locale = i18n.global.locale.value
    const messages = i18n.global.messages.value[locale]
    
    if (!messages || !messages.meta) return
    
    // Update title
    document.title = messages.meta.title
    
    // Update meta description
    updateMetaTag('name', 'description', messages.meta.description)
    updateMetaTag('name', 'keywords', messages.meta.keywords)
    
    // Update Open Graph
    updateMetaTag('property', 'og:title', messages.meta.title)
    updateMetaTag('property', 'og:description', messages.meta.description)
    
    // Update Twitter
    updateMetaTag('property', 'twitter:title', messages.meta.title)
    updateMetaTag('property', 'twitter:description', messages.meta.description)
    
    // Update HTML lang attribute
    document.documentElement.lang = locale
  }
  
  const updateMetaTag = (attr, attrValue, content) => {
    let element = document.querySelector(`meta[${attr}="${attrValue}"]`)
    if (element) {
      element.setAttribute('content', content)
    } else {
      element = document.createElement('meta')
      element.setAttribute(attr, attrValue)
      element.setAttribute('content', content)
      document.head.appendChild(element)
    }
  }
  
  // Watch for locale changes
  watch(() => i18n.global.locale.value, updateMeta, { immediate: true })
  
  return { updateMeta }
}

