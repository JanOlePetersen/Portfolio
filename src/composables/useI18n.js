import { ref, computed } from 'vue'
import deTranslations from '../i18n/de.json'
import enTranslations from '../i18n/en.json'

const currentLanguage = ref('en') // English as default

const translations = {
  de: deTranslations,
  en: enTranslations
}

// Translation cache to avoid repeated lookups
const translationCache = new Map()

export function useI18n() {
  const t = (key, params = {}) => {
    // Create cache key with language
    const cacheKey = `${currentLanguage.value}:${key}`
    
    // Check cache first
    if (translationCache.has(cacheKey) && Object.keys(params).length === 0) {
      return translationCache.get(cacheKey)
    }
    
    const keys = key.split('.')
    let value = translations[currentLanguage.value]
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        const result = key
        if (Object.keys(params).length === 0) {
          translationCache.set(cacheKey, result)
        }
        return result
      }
    }
    
    // Replace parameters in translation
    if (typeof value === 'string' && params && Object.keys(params).length > 0) {
      Object.keys(params).forEach(param => {
        value = value.replace(`{${param}}`, params[param])
      })
    }
    
    const result = value || key
    // Cache only if no params (params make it dynamic)
    if (Object.keys(params).length === 0) {
      translationCache.set(cacheKey, result)
    }
    return result
  }
  
  const setLanguage = (lang) => {
    if (translations[lang]) {
      currentLanguage.value = lang
      localStorage.setItem('language', lang)
      // Update HTML lang attribute for proper hyphenation and accessibility
      document.documentElement.setAttribute('lang', lang)
    }
  }
  
  const language = computed(() => currentLanguage.value)
  
  // Load language from localStorage on init
  const savedLanguage = localStorage.getItem('language')
  if (savedLanguage && translations[savedLanguage]) {
    currentLanguage.value = savedLanguage
    // Set HTML lang attribute on init
    document.documentElement.setAttribute('lang', savedLanguage)
  } else {
    // Set default language attribute
    document.documentElement.setAttribute('lang', 'en')
  }
  
  return {
    t,
    setLanguage,
    language
  }
}
