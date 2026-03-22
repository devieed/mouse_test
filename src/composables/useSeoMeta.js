import { watch } from 'vue'

function updateFaqJsonLd(messages) {
  const faq = messages.faq
  if (!faq) return
  const mainEntity = []
  for (let i = 1; i <= 12; i++) {
    const q = faq[`q${i}`]
    const a = faq[`a${i}`]
    if (q && a) {
      mainEntity.push({
        '@type': 'Question',
        name: q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: a
        }
      })
    }
  }
  if (!mainEntity.length) return
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity
  }
  let el = document.getElementById('dynamic-faq-jsonld')
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = 'dynamic-faq-jsonld'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(schema)
}

export function useSeoMeta(i18n, activeTabRef) {
  const updateMeta = () => {
    const locale = i18n.global.locale.value
    const messages = i18n.global.messages.value[locale]

    if (!messages || !messages.meta) return

    const tab = activeTabRef?.value ?? 'cps'
    const useReaction =
      tab === 'reaction' &&
      messages.meta.titleReaction &&
      messages.meta.descriptionReaction

    const title = useReaction ? messages.meta.titleReaction : messages.meta.title
    const description = useReaction ? messages.meta.descriptionReaction : messages.meta.description
    const keywords = useReaction
      ? messages.meta.keywordsReaction || messages.meta.keywords
      : messages.meta.keywords

    // Update title
    document.title = title

    // Update meta description
    updateMetaTag('name', 'description', description)
    updateMetaTag('name', 'keywords', keywords)

    // Update Open Graph
    updateMetaTag('property', 'og:title', title)
    updateMetaTag('property', 'og:description', description)

    // Update Twitter
    updateMetaTag('property', 'twitter:title', title)
    updateMetaTag('property', 'twitter:description', description)

    // Update HTML lang attribute
    document.documentElement.lang = locale

    updateFaqJsonLd(messages)
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
  
  watch(
    () => [i18n.global.locale.value, activeTabRef?.value],
    updateMeta,
    { immediate: true }
  )
  
  return { updateMeta }
}

