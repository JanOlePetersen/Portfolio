import { ref } from 'vue'

const shouldShowCookieBanner = ref(false)

export function useCookieBanner() {
  const checkCookieBanner = () => {
    const startupPreferencesSet = localStorage.getItem('startupPreferencesSet')
    const cookieConsent = localStorage.getItem('cookieConsent')
    
    // Only show cookie banner if startup preferences are already set and no consent given
    if (startupPreferencesSet && !cookieConsent) {
      shouldShowCookieBanner.value = true
    } else {
      shouldShowCookieBanner.value = false
    }
  }
  
  return {
    shouldShowCookieBanner,
    checkCookieBanner
  }
}

