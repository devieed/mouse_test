import { watch } from 'vue'

// Map internal locale codes to URL ?lang= parameter values
const LOCALE_TO_PARAM = {
  'en': null,       // root URL, no param
  'ko': 'ko',
  'zh-CN': 'zh-cn',
  'zh-TW': 'zh-tw',
  'ja': 'ja',
  'de': 'de',
  'fr': 'fr'
}

// Map internal locale codes to BCP-47 hreflang values
const LOCALE_TO_HREFLANG = {
  'en': 'en',
  'ko': 'ko',
  'zh-CN': 'zh-Hans',
  'zh-TW': 'zh-Hant',
  'ja': 'ja',
  'de': 'de',
  'fr': 'fr'
}

const BASE_URL = 'https://ed9e.net'

function buildCanonicalUrl(locale, tab) {
  const param = LOCALE_TO_PARAM[locale]
  const url = new URL(BASE_URL + '/')
  if (param) url.searchParams.set('lang', param)
  if (tab === 'reaction') url.searchParams.set('tab', 'reaction')
  return url.toString()
}

function updateCanonical(locale, tab) {
  const href = buildCanonicalUrl(locale, tab)
  let el = document.querySelector('link[rel="canonical"]')
  if (el) {
    el.setAttribute('href', href)
  } else {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    el.setAttribute('href', href)
    document.head.appendChild(el)
  }
}

function updateHreflang(locale) {
  // Remove existing dynamically-added hreflang links (keep static ones from HTML)
  document.querySelectorAll('link[rel="alternate"][data-dynamic]').forEach(el => el.remove())

  // All language versions with their canonical URLs
  const alternates = [
    { hreflang: 'en', href: `${BASE_URL}/` },
    { hreflang: 'x-default', href: `${BASE_URL}/` },
    { hreflang: 'ko', href: `${BASE_URL}/?lang=ko` },
    { hreflang: 'zh-Hans', href: `${BASE_URL}/?lang=zh-cn` },
    { hreflang: 'zh-Hant', href: `${BASE_URL}/?lang=zh-tw` },
    { hreflang: 'ja', href: `${BASE_URL}/?lang=ja` },
    { hreflang: 'de', href: `${BASE_URL}/?lang=de` },
    { hreflang: 'fr', href: `${BASE_URL}/?lang=fr` }
  ]

  // Only inject dynamically if current locale differs from default (en),
  // to avoid duplicating what the static HTML already provides.
  if (locale !== 'en') {
    alternates.forEach(({ hreflang, href }) => {
      const el = document.createElement('link')
      el.setAttribute('rel', 'alternate')
      el.setAttribute('hreflang', hreflang)
      el.setAttribute('href', href)
      el.setAttribute('data-dynamic', '1')
      document.head.appendChild(el)
    })
  }
}

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
  // Use dynamic-faq-jsonld; hide the static one once Vue is active
  let el = document.getElementById('dynamic-faq-jsonld')
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = 'dynamic-faq-jsonld'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(schema)

  // Hide the static FAQ schema now that a dynamic one is active
  const staticEl = document.getElementById('static-faq-jsonld')
  if (staticEl) staticEl.remove()
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

    // Update meta tags
    updateMetaTag('name', 'description', description)
    updateMetaTag('name', 'keywords', keywords)

    // Update Open Graph
    updateMetaTag('property', 'og:title', title)
    updateMetaTag('property', 'og:description', description)

    // Update Twitter
    updateMetaTag('property', 'twitter:title', title)
    updateMetaTag('property', 'twitter:description', description)

    // Update HTML lang attribute
    document.documentElement.lang = locale === 'zh-CN' ? 'zh-Hans'
      : locale === 'zh-TW' ? 'zh-Hant'
      : locale

    // Update canonical URL
    updateCanonical(locale, tab)

    // Update hreflang for non-English pages
    updateHreflang(locale)

    // Update FAQ structured data
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
