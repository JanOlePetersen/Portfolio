import { ref, computed, watch } from 'vue'

const currentTheme = ref('dark') // Dark mode as default

export function useTheme() {
  const setTheme = (theme) => {
    if (theme === 'dark' || theme === 'light') {
      currentTheme.value = theme
      localStorage.setItem('theme', theme)
      applyTheme(theme)
    }
  }
  
  const toggleTheme = () => {
    const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }
  
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
  }
  
  const theme = computed(() => currentTheme.value)
  
  // Initialize theme on module load
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      currentTheme.value = savedTheme
      applyTheme(savedTheme)
    } else {
      // Default to dark mode
      currentTheme.value = 'dark'
      applyTheme('dark')
    }
  }
  
  // Initialize immediately
  initTheme()
  
  return {
    theme,
    setTheme,
    toggleTheme
  }
}

