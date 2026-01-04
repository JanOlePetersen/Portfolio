<template>
  <div id="app">
    <!-- Startup Preference Modal -->
    <div v-if="showStartupModal" class="startup-modal-overlay" role="dialog" aria-labelledby="startup-modal-title" aria-modal="true">
      <div class="startup-modal-content">
        <h2 id="startup-modal-title">{{ getEnglishText('home.startupModal.title') }}</h2>
        <p class="startup-modal-subtitle">{{ getEnglishText('home.startupModal.subtitle') }}</p>
        
        <div class="startup-options">
          <!-- Language Selection -->
          <div class="startup-option-group">
            <h3>{{ getEnglishText('home.startupModal.languageTitle') }}</h3>
            <div class="startup-buttons">
              <button 
                @click="tempLanguage = 'de'" 
                class="startup-btn" 
                :class="{ 'active': tempLanguage === 'de' }"
                :aria-label="'Deutsch'"
                :aria-pressed="tempLanguage === 'de'"
              >
                DE
              </button>
              <button 
                @click="tempLanguage = 'en'" 
                class="startup-btn" 
                :class="{ 'active': tempLanguage === 'en' }"
                :aria-label="'English'"
                :aria-pressed="tempLanguage === 'en'"
              >
                EN
              </button>
            </div>
          </div>

          <!-- Theme Selection with Preview -->
          <div class="startup-option-group">
            <h3>{{ getEnglishText('home.startupModal.themeTitle') }}</h3>
            <div class="startup-buttons">
              <button 
                @click="tempTheme = 'dark'" 
                class="startup-btn theme-btn" 
                :class="{ 'active': tempTheme === 'dark' }"
                :aria-label="getEnglishText('home.startupModal.darkMode')"
                :aria-pressed="tempTheme === 'dark'"
              >
                <span class="theme-icon"><img :src="getImagePath('/moon.png')" style="width: 2rem;"/></span>
                {{ getEnglishText('home.startupModal.darkMode') }}
              </button>
              <button 
                @click="tempTheme = 'light'" 
                class="startup-btn theme-btn" 
                :class="{ 'active': tempTheme === 'light' }"
                :aria-label="getEnglishText('home.startupModal.lightMode')"
                :aria-pressed="tempTheme === 'light'"
              >
                <span class="theme-icon"><img :src="getImagePath('/sun.png')" style="width: 2rem;"/></span>
                {{ getEnglishText('home.startupModal.lightMode') }}
              </button>
            </div>
            <div class="theme-preview" :data-theme="tempTheme">
              <div class="preview-header">
                <div class="preview-logo">Portfolio</div>
              </div>
              <div class="preview-content">
                <div class="preview-card">
                  <div class="preview-card-header"></div>
                  <div class="preview-card-body">
                    <div class="preview-line"></div>
                    <div class="preview-line short"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button @click="applyStartupPreferences" class="startup-continue-btn">
          {{ getEnglishText('home.startupModal.continue') }}
        </button>
      </div>
    </div>

    <!-- Navigation -->
    <header role="banner">
      <nav id="navbar" role="navigation" aria-label="Main navigation">
        <ul>
          <li class="logo">
            <a href="#home" aria-label="Home - Portfolio" @click.prevent="scrollToTop">
              <h1 class="hero-title">Portfolio</h1>
            </a>
          </li>
          <li class="flex controls-group" role="group" aria-label="Language and theme selection">
            <div class="language-switcher" role="group" aria-label="Language selection">
            <button 
              @click="setLanguage('de')" 
              class="lang-btn" 
              :class="{ 'active': language === 'de' }"
              :aria-label="'Switch to German'"
              :aria-pressed="language === 'de'"
              :title="'Deutsch'"
            >
              DE
            </button>
            <button 
              @click="setLanguage('en')" 
              class="lang-btn" 
              :class="{ 'active': language === 'en' }"
              :aria-label="'Switch to English'"
              :aria-pressed="language === 'en'"
              :title="'English'"
            >
              EN
            </button>
            </div>
            <div class="theme-switcher" role="group" aria-label="Theme selection">
              <button 
                @click="toggleTheme" 
                class="theme-toggle-btn" 
                :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
                :title="theme === 'dark' ? 'Light Mode' : 'Dark Mode'"
              >
                <span v-if="theme === 'dark'"><img :src="getImagePath('/sun.png')" style="width: 1.5rem;"/></span>
                <span v-else><img :src="getImagePath('/moon.png')" style="width: 1.5rem;"/></span>
              </button>
            </div>
          </li>
        </ul>
      </nav>
    </header>

    <!-- Home Component -->
    <Home />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useI18n } from './composables/useI18n'
import { useTheme } from './composables/useTheme'
import { useCookieBanner } from './composables/useCookieBanner'
import Home from './views/Home.vue'
import enTranslations from './i18n/en.json'

const { t, setLanguage, language } = useI18n()
const { theme, setTheme, toggleTheme } = useTheme()
const { checkCookieBanner } = useCookieBanner()

const showStartupModal = ref(false)
const tempLanguage = ref('en')
const tempTheme = ref('dark')

// Function to get English translations for startup modal (always in English)
const getEnglishText = (key) => {
  const keys = key.split('.')
  let value = enTranslations
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k]
    } else {
      return key
    }
  }
  return value || key
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const applyStartupPreferences = () => {
  setLanguage(tempLanguage.value)
  setTheme(tempTheme.value)
  showStartupModal.value = false
  localStorage.setItem('startupPreferencesSet', 'true')
  
  // Check for cookie banner after modal closes
  nextTick(() => {
    checkCookieBanner()
  })
}

onMounted(() => {
  // Check if startup preferences have been set
  const preferencesSet = localStorage.getItem('startupPreferencesSet')
  if (!preferencesSet) {
    // Load saved preferences or use defaults
    const savedLanguage = localStorage.getItem('language')
    const savedTheme = localStorage.getItem('theme')
    
    if (savedLanguage) {
      tempLanguage.value = savedLanguage
    }
    if (savedTheme) {
      tempTheme.value = savedTheme
    }
    
    showStartupModal.value = true
  } else {
    // Apply saved preferences
    const savedLanguage = localStorage.getItem('language')
    const savedTheme = localStorage.getItem('theme')
    
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }
})

// Helper to get correct image path with base URL
const getImagePath = (imagePath) => {
  if (!imagePath) return ''
  // If already absolute URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  // Remove leading slash if present and add base URL
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  return `${import.meta.env.BASE_URL}${cleanPath}`
}
</script>

<style>
/* Reset and Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

:root {
  /* Dark mode (default) */
  --bg-primary: #0a1a1f;
  --bg-secondary: #1a2529;
  --bg-card: #1a2529;
  --text-primary: #e0e0e0;
  --text-secondary: #F5E6CC;
  --text-accent: #33e5ff;
  --accent-color: #00d9ff;
  --border-color: #333;
  --nav-bg: rgba(10, 26, 31, 0.95);
}

[data-theme="light"] {
  /* Light mode */
  --bg-primary: #f5f5f5;
  --bg-secondary: #ffffff;
  --bg-card: #ffffff;
  --text-primary: #1a1a1a;
  --text-secondary: #2a2a2a;
  --text-accent: #0066cc;
  --accent-color: #0088ff;
  --border-color: #ddd;
  --nav-bg: rgba(245, 245, 245, 0.95);
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  background-attachment: fixed;
  color: var(--text-primary);
  line-height: 1.6;
  overflow-x: hidden;
  transition: background 0.3s ease, color 0.3s ease;
}

/* Light mode gradient */
[data-theme="light"] body {
  background: linear-gradient(135deg, var(--bg-primary) 0%, #e8e8e8 50%, var(--bg-secondary) 100%);
  background-attachment: fixed;
}

#app {
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  max-width: 100vw;
}

/* Navigation */
header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

nav {
  width: 100%;
  background: linear-gradient(135deg, var(--nav-bg) 0%, rgba(26, 42, 47, 0.95) 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  padding: 0 2rem;
  height: 70px;
  display: flex;
  align-items: center;
  transition: background 0.3s ease, border-color 0.3s ease;
}

/* Light mode nav gradient */
[data-theme="light"] nav {
  background: linear-gradient(135deg, var(--nav-bg) 0%, rgba(235, 235, 235, 0.95) 100%);
}

nav ul {
  list-style: none;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-end;
  gap: 2rem;
}

.language-switcher {
  margin-left: 1rem;
}

nav ul li.logo {
  margin-right: auto;
  display: flex;
  align-items: center;
  height: 100%;
  z-index: 1001;
  position: relative;
  flex: 0 0 auto;
  min-width: 0;
  max-width: calc(100% - 180px); /* Reserve space for 3 buttons */
}

nav ul li.logo h1 {
  font-size: 1.5rem;
  color: var(--accent-color) !important;
  font-weight: 700;
  margin: 0;
  padding: 0;
  line-height: 1;
  display: inline-block;
  position: relative;
  vertical-align: middle;
  z-index: 1002;
  -webkit-text-fill-color: var(--accent-color) !important;
  background: none !important;
  -webkit-background-clip: unset !important;
  background-clip: unset !important;
  transition: color 0.3s ease;
}

nav ul li.logo h1::after,
nav ul li.logo h1::before {
  display: none;
}

nav ul li.logo a,
nav ul li.logo router-link {
  text-decoration: none;
  display: flex;
  align-items: center;
  height: 100%;
  position: relative;
  z-index: 1001;
  color: inherit;
}

nav ul li.logo a *,
nav ul li.logo router-link * {
  color: inherit;
}

nav ul li.flex {
  display: flex;
  align-items: center;
}

nav a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: all 0.3s ease;
  cursor: pointer;
}

nav a:hover {
  color: var(--accent-color);
  background-color: rgba(0, 136, 255, 0.1);
}

.controls-group {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-shrink: 0;
  min-width: 0;
}

.language-switcher {
  display: flex;
  gap: 0.5rem;
}

.theme-switcher {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  min-width: 0;
}

.lang-btn {
  background-color: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 50px;
  text-align: center;
  box-sizing: border-box;
  white-space: nowrap;
}

.lang-btn:hover {
  color: var(--accent-color);
  border-color: var(--accent-color);
  background-color: rgba(0, 136, 255, 0.1);
}

.lang-btn.active {
  border-color: var(--accent-color);
  background-color: rgba(0, 136, 255, 0.2);
  font-weight: 700;
}

.theme-toggle-btn {
  background-color: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  white-space: nowrap;
}

.theme-toggle-btn:hover {
  color: var(--accent-color);
  border-color: var(--accent-color);
  background-color: rgba(0, 136, 255, 0.1);
}

/* Startup Modal */
.startup-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 2rem;
  animation: fadeIn 0.3s ease;
  overflow-y: auto;
}

.startup-modal-content {
  background-color: var(--bg-card);
  border-radius: 15px;
  max-width: 600px;
  width: 100%;
  padding: 2.5rem;
  border: 1px solid var(--border-color);
  animation: slideUp 0.3s ease;
  transition: background-color 0.3s ease, border-color 0.3s ease;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on mobile */
}

.startup-modal-content h2 {
  color: var(--text-accent);
  font-size: 2rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.startup-modal-subtitle {
  color: var(--text-secondary);
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.startup-options {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
}

.startup-option-group h3 {
  color: var(--text-accent);
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-align: center;
}

.startup-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.startup-btn {
  background-color: transparent;
  color: var(--text-secondary);
  border: 2px solid var(--border-color);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
}

.startup-btn:hover {
  border-color: var(--accent-color);
  background-color: rgba(0, 136, 255, 0.1);
  color: var(--accent-color);
}

.startup-btn.active {
  border-color: var(--accent-color);
  background-color: rgba(0, 136, 255, 0.2);
  color: var(--accent-color);
}

.theme-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-icon {
  font-size: 1.2rem;
}

.theme-preview {
  margin-top: 1.5rem;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  overflow: hidden;
  background-color: var(--bg-primary);
  transition: all 0.3s ease;
}

.theme-preview .preview-header {
  background-color: var(--nav-bg);
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.theme-preview .preview-logo {
  color: var(--accent-color);
  font-weight: 700;
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.theme-preview .preview-content {
  padding: 1rem;
}

.theme-preview .preview-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.theme-preview .preview-card-header {
  height: 60px;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  transition: all 0.3s ease;
}

.theme-preview .preview-card-body {
  padding: 1rem;
}

.theme-preview .preview-line {
  height: 8px;
  background-color: var(--border-color);
  border-radius: 4px;
  margin-bottom: 0.5rem;
  transition: background-color 0.3s ease;
}

.theme-preview .preview-line.short {
  width: 60%;
}

.startup-continue-btn {
  width: 100%;
  padding: 1rem;
  background-color: rgba(0, 136, 255, 0.2);
  color: var(--text-secondary);
  border: 2px solid var(--accent-color);
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: auto;
}

.startup-continue-btn:hover {
  background-color: rgba(0, 136, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 136, 255, 0.5);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}



/* Focus indicators for keyboard navigation */
a:focus,
button:focus,
input:focus,
textarea:focus,
select:focus {
  outline: 2px solid #00d9ff;
  outline-offset: 2px;
}

a:focus:not(:focus-visible),
button:focus:not(:focus-visible) {
  outline: none;
}

a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid #00d9ff;
  outline-offset: 2px;
}

/* Responsive Design */
@media (max-width: 768px) {
  nav {
    padding: 0 0.75rem;
    height: auto;
    min-height: 70px;
  }

  nav ul {
    gap: 0;
    flex-wrap: nowrap;
    overflow: visible;
    justify-content: space-between;
  }

  nav ul li.logo {
    margin-right: 0.5rem;
    flex: 0 1 auto;
    min-width: 0;
  }

  nav ul li.logo h1 {
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  nav a {
    font-size: 0.9rem;
    padding: 0.5rem;
  }

  .controls-group {
    gap: 0.4rem;
    flex-wrap: nowrap;
    flex: 0 0 auto;
    margin-left: 0.5rem;
    min-width: 0;
    overflow: visible;
  }

  .language-switcher {
    margin-left: 0;
    gap: 0.3rem;
    flex-shrink: 0;
  }

  .theme-switcher {
    flex-shrink: 0;
  }

  .lang-btn {
    padding: 0.4rem 0.5rem;
    font-size: 0.85rem;
    width: 40px;
    flex-shrink: 0;
    box-sizing: border-box;
    white-space: nowrap;
  }

  .theme-toggle-btn {
    padding: 0.4rem 0.5rem;
    font-size: 0.85rem;
    width: 40px;
    flex-shrink: 0;
    box-sizing: border-box;
    white-space: nowrap;
  }

  .startup-modal-overlay {
    padding: 1rem;
    align-items: center;
  }

  .startup-modal-content {
    padding: 1.5rem;
    max-height: 95vh;
    border-radius: 15px;
    -webkit-overflow-scrolling: touch;
  }

  .startup-modal-content h2 {
    font-size: 1.5rem;
  }

  .startup-modal-subtitle {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .startup-options {
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .startup-option-group h3 {
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
  }

  .startup-btn {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
    min-width: 70px;
  }

  .theme-preview {
    margin-top: 1rem;
  }
}

@media (max-width: 480px) {
  nav {
    padding: 0 0.5rem;
  }

  nav ul {
    gap: 0;
    justify-content: space-between;
    flex-wrap: nowrap;
    overflow: visible;
  }

  nav ul li.logo {
    flex: 0 1 auto;
    margin-right: 0.4rem;
    min-width: 0;
  }

  nav ul li.logo h1 {
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .controls-group {
    gap: 0.25rem;
    flex-wrap: nowrap;
    flex: 0 0 auto;
    margin-left: 0.3rem;
    min-width: 0;
    overflow: visible;
  }

  .language-switcher {
    gap: 0.2rem;
    flex-shrink: 0;
  }

  .theme-switcher {
    flex-shrink: 0;
  }

  .lang-btn {
    padding: 0.35rem 0.4rem;
    font-size: 0.8rem;
    width: 36px;
    flex-shrink: 0;
    box-sizing: border-box;
    white-space: nowrap;
  }

  .theme-toggle-btn {
    padding: 0.35rem 0.4rem;
    font-size: 0.8rem;
    width: 36px;
    flex-shrink: 0;
    box-sizing: border-box;
    white-space: nowrap;
  }

  .startup-modal-overlay {
    padding: 0.5rem;
    align-items: center;
  }

  .startup-modal-content {
    padding: 1.25rem;
    max-height: 98vh;
    border-radius: 15px;
    -webkit-overflow-scrolling: touch;
  }

  .startup-modal-content h2 {
    font-size: 1.3rem;
    margin-bottom: 0.25rem;
  }

  .startup-modal-subtitle {
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  .startup-options {
    gap: 1.25rem;
    margin-bottom: 1.25rem;
  }

  .startup-option-group h3 {
    font-size: 1rem;
  }

  .startup-buttons {
    gap: 0.75rem;
  }

  .startup-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    min-width: 60px;
  }

  .startup-continue-btn {
    padding: 0.875rem;
    font-size: 1rem;
  }
}
</style>