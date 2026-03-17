<template>
  <div class="home" :style="dynamicStyles">
    <!-- Cookie Consent Banner -->
    <div v-if="showCookieBanner" class="cookie-banner" role="dialog" aria-labelledby="cookie-banner-title" aria-modal="true">
      <div class="cookie-banner-content">
        <div class="cookie-banner-text" :lang="language">
          <h3 id="cookie-banner-title">{{ getCookieBannerText('home.cookieBanner.title') }}</h3>
          <p>{{ getCookieBannerText('home.cookieBanner.text') }}</p>
        </div>
        <div class="cookie-banner-buttons" :lang="language">
          <button @click="acceptCookies" class="btn btn-primary">{{ getCookieBannerText('home.cookieBanner.accept') }}</button>
          <button @click="rejectCookies" class="btn btn-secondary">{{ getCookieBannerText('home.cookieBanner.reject') }}</button>
          <a href="#privacy-policy" @click="scrollTo('privacy-policy')" class="cookie-link">{{ getCookieBannerText('home.cookieBanner.learnMore') }}</a>
        </div>
      </div>
    </div>
    
    <main id="main-content" tabindex="-1" role="main">
      <!-- Hero Section -->
      <section id="home" class="hero" :style="{ backgroundImage: `url(/Portfolio/mq2.png)` }"><!-- latestProject && latestProject.image ? { backgroundImage: `url(${getImagePath(latestProject.image)})` } : {} -->
        <div class="hero-content">
          <h1 class="hero-title">Portfolio</h1>
          <p class="hero-subtitle" v-html="t('home.subtitle')"></p>
          <p class="hero-subtitle">{{ t('home.subtitle2') }}</p>
          <div class="hero-buttons">
            <a href="#websites" class="btn btn-primary" @click="scrollTo('websites')">{{ t('home.viewProjects') }}</a>
            <a href="#footer" class="btn btn-secondary" @click="scrollTo('footer')">{{ t('home.getInTouch') }}</a>
          </div>
        </div>
      </section>

      <!-- Skills Section -->
      <section id="skills" class="section">
        <h2 class="section-title">{{ t('home.skills') }}</h2>
        <div class="skills-container">
          <div class="skill-category">
            <h3>{{ t('home.gameDev') }}</h3>
            <div class="skill-tags">
              <span class="skill-tag">Godot Engine</span>
              <span class="skill-tag">Unity Engine</span>
              <span class="skill-tag">Game Design</span>
              <span class="skill-tag">Physics</span>
              <span class="skill-tag">Animation</span>
              <span class="skill-tag">C#</span>
              <span class="skill-tag">GDScript</span>
            </div>
          </div>
          <div class="skill-category">
            <h3>{{ t('home.webDev') }}</h3>
            <div class="skill-tags">
              <span class="skill-tag">HTML5</span>
              <span class="skill-tag">CSS3</span>
              <span class="skill-tag">JavaScript</span>
              <span class="skill-tag">Vue.js</span>
              <span class="skill-tag">React</span>
              <span class="skill-tag">Node.js</span>
              <span class="skill-tag">TypeScript</span>
              <span class="skill-tag">Responsive Design</span>
            </div>
          </div>
          <div class="skill-category">
            <h3>{{ t('home.tools') }}</h3>
            <div class="skill-tags">
              <span class="skill-tag">Git</span>
              <span class="skill-tag">GitHub</span>
              <span class="skill-tag">Figma</span>
              <span class="skill-tag">VS Code</span>
              <span class="skill-tag">Agile</span>
              <span class="skill-tag">Scrum</span>
              <span class="skill-tag">Testing</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Websites Section -->
      <section id="websites" class="section">
        <div class="section-header">
          <h2 class="section-title">{{ t('websites.title') }}</h2>
          <button @click="showAllWeb = !showAllWeb" class="btn btn-primary btn-more">
            {{ getShowMoreText(showAllWeb) }}
          </button>
        </div>
        

        <div class="project-category" v-if="displayedWebProjects.length > 0">
          <div class="projects-grid">
            <div 
              v-for="(project, index) in displayedWebProjects" 
              :key="project.id"
              class="project-card"
              :class="{ 
                'project-card-featured': project.featured && !shouldGetThreeColumns(project, index, webPairingMap) && !(index === displayedWebProjects.length - 1 && shouldGetThreeColumns(project, index, webPairingMap)),
                'project-card-featured-pair': project.featured && shouldGetThreeColumns(project, index, webPairingMap),
                'project-card-last': index === displayedWebProjects.length - 1,
                'project-card-last-featured': index === displayedWebProjects.length - 1 && project.featured && !shouldGetThreeColumns(project, index, webPairingMap) && webLayoutMap[index] && webLayoutMap[index].colStart === 0,
                'project-card-last-unfeatured': index === displayedWebProjects.length - 1 && !project.featured
              }"
            >
              <div class="project-image">
                <img v-if="project.image" :src="getImagePath(project.image)" :alt="project.title" />
                <div v-else class="project-placeholder">{{ project.title }}</div>
                <button 
                  v-if="project.video" 
                  @click="openVideoModal(project.video)"
                  class="project-play-button"
                  :aria-label="t('home.playVideo') + ' - ' + getProjectTitle(project)"
                >
                  <span class="play-icon">▶</span>
                </button>
                <button 
                  v-if="project.gallery && project.gallery.length"
                  @click="openGalleryModal(project.gallery)"
                  class="project-play-button"
                  :aria-label="t('home.viewGallery') + ' - ' + getProjectTitle(project)"
                >
                  <span class="gallery-icon">⧉</span>
                </button>
              </div>
              <div class="project-info">
                <h4>{{ getProjectTitle(project) }}</h4>
                <div v-if="project.dateFinished" class="project-date">
                  {{ formatDate(project.dateFinished) }}
                </div>
                <div v-if="project.universityProject" class="project-badge">
                  {{ t('home.universityProject') }}
                </div>
                <div v-if="project.researchProject" class="project-badge">
                  {{ t('home.researchProject') }}
                </div>
                <p v-if="getProjectText(project, 'text1')">
                  {{ getProjectText(project, 'text1') }}
                </p>
                <p v-if="getProjectText(project, 'text2')" v-html="getProjectText(project, 'text2')">
                </p>
                <div class="project-tech" role="list" aria-label="Project technologies">
                  <span v-for="keyword in getFilteredKeywords(project.keywords)" :key="keyword" role="listitem">{{ getTranslatedKeyword(keyword) }}</span>
                </div>
                <div class="project-links">
                  <template v-for="(link, index) in project.links" :key="index">
                    <a 
                      :href="link.url" 
                      class="btn btn-secondary"
                      :target="link.external ? '_blank' : '_self'"
                      :rel="link.external ? 'noopener noreferrer' : ''"
                    >
                      {{ getLinkLabel(link.label) }}
                    </a>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Games Section -->
      <section id="games" class="section">
        <div class="section-header">
          <h2 class="section-title">{{ t('games.title') }}</h2>
          <button @click="showAllGames = !showAllGames" class="btn btn-primary btn-more">
            {{ getShowMoreText(showAllGames) }}
          </button>
        </div>
        
        
        <div class="project-category" v-if="displayedGames.length > 0">
          <div class="projects-grid">
            <div 
              v-for="(project, index) in displayedGames" 
              :key="project.id"
              class="project-card"
              :class="{ 
                'project-card-featured': project.featured && !shouldGetThreeColumns(project, index, gamesPairingMap) && !(index === displayedGames.length - 1 && shouldGetThreeColumns(project, index, gamesPairingMap)),
                'project-card-featured-pair': project.featured && shouldGetThreeColumns(project, index, gamesPairingMap),
                'project-card-last': index === displayedGames.length - 1,
                'project-card-last-featured': index === displayedWebProjects.length - 1 && project.featured && !shouldGetThreeColumns(project, index, webPairingMap) && webLayoutMap[index] && webLayoutMap[index].colStart === 0,
                'project-card-last-unfeatured': index === displayedGames.length - 1 && !project.featured
              }"
            >
              <div class="project-image">
                <img v-if="project.image" :src="getImagePath(project.image)" :alt="project.title" />
                <div v-else class="project-placeholder">{{ project.title }}</div>
                <button 
                  v-if="project.video" 
                  @click="openVideoModal(project.video)"
                  class="project-play-button"
                  :aria-label="t('home.playVideo') + ' - ' + getProjectTitle(project)"
                >
                  <span class="play-icon">▶</span>
                </button>
                <button 
                  v-if="project.gallery && project.gallery.length"
                  @click="openGalleryModal(project.gallery)"
                  class="project-play-button"
                  :aria-label="t('home.viewGallery') + ' - ' + getProjectTitle(project)"
                >
                  <span class="play-icon">⧉</span>
                </button>
              </div>
              <div class="project-info">
                <h4>{{ getProjectTitle(project) }}</h4>
                <div v-if="project.dateFinished" class="project-date">
                  {{ formatDate(project.dateFinished) }}
                </div>
                <div v-if="project.universityProject" class="project-badge">
                  {{ t('home.universityProject') }}
                </div>
                <div v-if="project.researchProject" class="project-badge">
                  {{ t('home.researchProject') }}
                </div>
                <p v-if="getProjectText(project, 'text1')">
                  {{ getProjectText(project, 'text1') }}
                </p>
                <p v-if="getProjectText(project, 'text2')" v-html="getProjectText(project, 'text2')">
                </p>
                <div class="project-tech" role="list" aria-label="Project technologies">
                  <span v-for="keyword in getFilteredKeywords(project.keywords)" :key="keyword" role="listitem">{{ getTranslatedKeyword(keyword) }}</span>
                </div>
                <div class="project-links">
                  <template v-for="(link, index) in project.links" :key="index">
                    <a 
                      :href="link.url" 
                      class="btn btn-secondary"
                      :target="link.external ? '_blank' : '_self'"
                      :rel="link.external ? 'noopener noreferrer' : ''"
                    >
                      {{ getLinkLabel(link.label) }}
                    </a>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer id="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>{{ t('home.footer.getInTouch') }}</h3>
          <p class="footer-description">
            {{ t('home.footer.description') }}
          </p>
          <div class="contact-links">
            <button @click="openContactForm()" class="contact-link btn btn-secondary">
              <span class="contact-icon">✉</span>
              <span>{{ t('home.footer.email') }}</span>
            </button>
            <a 
              href="https://www.linkedin.com/in/jan-ole-petersen-478464282/" 
              target="_blank" 
              rel="noopener noreferrer"
              class="contact-link btn btn-secondary"
              :aria-label="t('home.footer.linkedin')"
            >
              <img :src="getImagePath('/in.png')" class="contact-icon linkedin-icon" :alt="t('home.footer.linkedin')" />
              <span>{{ t('home.footer.linkedin') }}</span>
            </a>
            <a 
              href="https://www.xing.com/profile/JanOle_Petersen070686" 
              target="_blank" 
              rel="noopener noreferrer"
              class="contact-link btn btn-secondary"
              :aria-label="t('home.footer.xing')"
            >
              <img :src="getImagePath('/xing.png')" class="contact-icon linkedin-icon" :alt="t('home.footer.xing')" />
              <span>{{ t('home.footer.xing') }}</span>
            </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>{{ t('home.footer.copyright') }}</p>
        <div class="footer-links">
          <a href="#privacy-policy" @click="scrollTo('privacy-policy')">{{ t('home.footer.privacyPolicy') }}</a>
          <!-- <a href="#imprint" @click="scrollTo('imprint')">{{ t('home.footer.imprint') }}</a> -->
          <a href="#accessibility-statement" @click="scrollTo('accessibility-statement')">{{ t('home.footer.accessibilityStatement') }}</a>
        </div>
      </div>
      
      <!-- Privacy Policy Modal -->
      <div v-if="showPrivacyPolicy" class="modal-overlay" @click="showPrivacyPolicy = false">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="showPrivacyPolicy = false">×</button>
          <h2 id="privacy-policy-title">{{ t('home.privacyPolicy.title') }}</h2>
          <div class="modal-body">
            <p><strong>{{ t('home.privacyPolicy.lastUpdated') }}</strong> {{ new Date().toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US') }}</p>
            <h3>{{ t('home.privacyPolicy.informationWeCollect') }}</h3>
            <p>
              {{ t('home.privacyPolicy.informationWeCollectText') }}
            </p>
            <h3>{{ t('home.privacyPolicy.howWeUse') }}</h3>
            <p>
              {{ t('home.privacyPolicy.howWeUseText') }}
            </p>
            <h3>{{ t('home.privacyPolicy.dataSecurity') }}</h3>
            <p>
              {{ t('home.privacyPolicy.dataSecurityText') }}
            </p>
            <h3>{{ t('home.privacyPolicy.contact') }}</h3>
            <p>
              {{ t('home.privacyPolicy.contactText') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Imprint Modal -->
      <div 
        v-if="showImprint" 
        class="modal-overlay" 
        @click="showImprint = false"
        role="dialog"
        aria-modal="true"
        aria-labelledby="imprint-title"
      >
        <div class="modal-content" @click.stop>
          <button 
            class="modal-close" 
            @click="showImprint = false"
            aria-label="Close imprint"
          >×</button>
          <h2 id="imprint-title">{{ t('home.imprint.title') }}</h2>
          <div class="modal-body">
            <p><strong>{{ t('home.imprint.lastUpdated') }}</strong> {{ new Date().toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US') }}</p>
            <h3>{{ t('home.imprint.responsible') }}</h3>
            <p>
              {{ t('home.imprint.name') }}<br>
              {{ t('home.imprint.address') }}<br>
              {{ t('home.imprint.postalCode') }}<br>
              {{ t('home.imprint.country') }}
            </p>
            <h3>{{ t('home.imprint.contact') }}</h3>
            <p>
              {{ t('home.imprint.email') }}: <a href="mailto:janole.petersen@gmx.de">janole.petersen@gmx.de</a><br>
              <span v-if="t('home.imprint.phone')">{{ t('home.imprint.phone') }}: {{ t('home.imprint.phoneNumber') }}</span>
            </p>
            <h3>{{ t('home.imprint.websiteHost') }}</h3>
            <p>
              {{ t('home.imprint.websiteHostText') }}
            </p>
            <h3>{{ t('home.imprint.liability') }}</h3>
            <p>
              {{ t('home.imprint.liabilityText') }}
            </p>
            <h3>{{ t('home.imprint.links') }}</h3>
            <p>
              {{ t('home.imprint.linksText') }}
            </p>
            <h3>{{ t('home.imprint.copyright') }}</h3>
            <p>
              {{ t('home.imprint.copyrightText') }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Accessibility Statement Modal -->
      <div 
        v-if="showAccessibilityStatement" 
        class="modal-overlay" 
        @click="showAccessibilityStatement = false"
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-statement-title"
      >
        <div class="modal-content" @click.stop>
          <button 
            class="modal-close" 
            @click="showAccessibilityStatement = false"
            aria-label="Close accessibility statement"
          >×</button>
          <h2 id="accessibility-statement-title">{{ t('home.accessibilityStatement.title') }}</h2>
          <div class="modal-body">
            <p><strong>{{ t('home.accessibilityStatement.lastUpdated') }}</strong> {{ new Date().toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US') }}</p>
            <h3>{{ t('home.accessibilityStatement.compliance') }}</h3>
            <p>{{ t('home.accessibilityStatement.complianceText') }}</p>
            <h3>{{ t('home.accessibilityStatement.standards') }}</h3>
            <p>{{ t('home.accessibilityStatement.standardsText') }}</p>
            <h3>{{ t('home.accessibilityStatement.measures') }}</h3>
            <ul>
              <li>{{ t('home.accessibilityStatement.measure1') }}</li>
              <li>{{ t('home.accessibilityStatement.measure2') }}</li>
              <li>{{ t('home.accessibilityStatement.measure3') }}</li>
              <li>{{ t('home.accessibilityStatement.measure4') }}</li>
              <li>{{ t('home.accessibilityStatement.measure5') }}</li>
            </ul>
            <h3>{{ t('home.accessibilityStatement.feedback') }}</h3>
            <p>{{ t('home.accessibilityStatement.feedbackText') }}</p>
            <p>
              <strong>{{ t('home.accessibilityStatement.contact') }}</strong><br>
              {{ t('home.imprint.email') }}: <a href="mailto:janole.petersen@gmx.de">janole.petersen@gmx.de</a>
            </p>
          </div>
        </div>
      </div>

      <!-- Video Modal -->
      <div v-if="showVideoModal" class="modal-overlay" @click="closeVideoModal">
        <div class="modal-content video-modal-content" @click.stop>
          <button class="modal-close" @click="closeVideoModal" :aria-label="t('home.closeVideo')">×</button>
          <div class="video-modal-body">
            <iframe 
              v-if="currentVideo && isYouTubeUrl(currentVideo)" 
              :src="getYouTubeEmbedUrl(currentVideo)" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
              class="modal-video"
            ></iframe>
            <video 
              v-else-if="currentVideo" 
              :src="currentVideo" 
              controls
              class="modal-video"
            ></video>
          </div>
        </div>
      </div>

      <!-- Carousel Modal -->
      <div v-if="showGalleryModal" class="modal-overlay" @click="closeGalleryModal">
        <div class="modal-content video-modal-content" @click.stop>
          <button class="modal-close" @click="closeGalleryModal" :aria-label="t('home.closeGallery')">×</button>
          <div class="video-modal-body">
            <div class="carousel-container">
              <button 
                v-if="currentGallery.length > 1" 
                @click.stop="prevImage" 
                class="carousel-btn carousel-prev"
              ><span data-v-18fc5d82="" class="carousel-arrow-left">‹</span></button>
              <img 
                v-if="currentGallery.length > 0"
                :src="getImagePath(currentGallery[currentGalleryIndex])"
                alt="Gallery image"
                class="carousel-image"
              />
              <button 
                v-if="currentGallery.length > 1" 
                @click.stop="nextImage" 
                class="carousel-btn carousel-next"
              ><span data-v-18fc5d82="" class="carousel-arrow-right">›</span></button>
              
              <div v-if="currentGallery.length > 1" class="carousel-indicators" style="position: absolute; bottom: 10px; display: flex; gap: 8px; z-index: 10;">
                <span 
                  v-for="(_, idx) in currentGallery" 
                  :key="idx" 
                  @click.stop="currentGalleryIndex = idx"
                  :class="idx === currentGalleryIndex ? 'carousel-indicator-point-selected' : 'carousel-indicator-point'"
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Form Modal -->
      <div v-if="showContactForm" class="modal-overlay" @click="closeContactForm">
        <div class="modal-content contact-form-modal" @click.stop>
          <button class="modal-close" @click="closeContactForm" :aria-label="t('home.contactForm.close')">×</button>
          <h2 id="contact-form-title">
            {{ t('home.contactForm.title') }}
          </h2>
          <form @submit.prevent="submitForm" class="contact-form" novalidate>
            <div class="form-group">
              <label for="contact-name">{{ t('home.contactForm.name') }} <span class="required">*</span></label>
              <input
                id="contact-name"
                v-model="formData.name"
                type="text"
                :placeholder="t('home.contactForm.namePlaceholder')"
                required
                :aria-invalid="formErrors.name ? 'true' : 'false'"
                :aria-describedby="formErrors.name ? 'name-error' : null"
              />
              <span v-if="formErrors.name" id="name-error" class="error-message" role="alert">{{ formErrors.name }}</span>
            </div>

            <div class="form-group">
              <label for="contact-email">
                {{ t('home.contactForm.emailRequired') }}
                <span class="required">*</span>
              </label>
              <input
                id="contact-email"
                v-model="formData.email"
                type="email"
                :placeholder="t('home.contactForm.emailPlaceholder')"
                required
                :aria-invalid="formErrors.email ? 'true' : 'false'"
                :aria-describedby="formErrors.email ? 'email-error' : null"
              />
              <span v-if="formErrors.email" id="email-error" class="error-message" role="alert">{{ formErrors.email }}</span>
            </div>

            <div class="form-group">
              <label for="contact-message">{{ t('home.contactForm.message') }} <span class="required">*</span></label>
              <textarea
                id="contact-message"
                v-model="formData.message"
                :placeholder="t('home.contactForm.messagePlaceholder')"
                rows="6"
                required
                :aria-invalid="formErrors.message ? 'true' : 'false'"
                :aria-describedby="formErrors.message ? 'message-error' : null"
              ></textarea>
              <span v-if="formErrors.message" id="message-error" class="error-message" role="alert">{{ formErrors.message }}</span>
            </div>

            <div v-if="formSuccess" class="success-message" role="alert">
              {{ t('home.contactForm.success') }}
            </div>
            <div v-if="formError" class="error-message" role="alert">
              {{ t('home.contactForm.error') }}
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                {{ isSubmitting ? t('home.contactForm.sending') : t('home.contactForm.send') }}
              </button>
              <button type="button" class="btn btn-secondary" @click="closeContactForm">
                {{ t('home.contactForm.close') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import '../styles/Home.css'
import projectsData from '../data/projects.json'
import { useI18n } from '../composables/useI18n'
import { useCookieBanner } from '../composables/useCookieBanner'
import enTranslations from '../i18n/en.json'
import deTranslations from '../i18n/de.json'

const { t, language } = useI18n()
const { shouldShowCookieBanner, checkCookieBanner } = useCookieBanner()

// Computed property for cookie banner language - defaults to English if no language is set
// This is reactive and will update when language changes
const cookieBannerLang = computed(() => {
  // Use the reactive language value from useI18n, which updates when language changes
  return language.value || 'en'
})

// Function to get cookie banner text - uses reactive language
const getCookieBannerText = (key) => {
  const currentLang = cookieBannerLang.value
  const translations = currentLang === 'de' ? deTranslations : enTranslations
  
  const keys = key.split('.')
  let value = translations
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k]
    } else {
      return key
    }
  }
  return value || key
}

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

const showPrivacyPolicy = ref(false)
const showImprint = ref(false)
const showAccessibilityStatement = ref(false)
// Use shared cookie banner state
const showCookieBanner = shouldShowCookieBanner
const showContactForm = ref(false)
const showVideoModal = ref(false)
const showGalleryModal = ref(false)
const currentVideo = ref(null)
const currentGallery = ref([])
const currentGalleryIndex = ref(0)
const isSubmitting = ref(false)
const formSuccess = ref(false)
const formError = ref(false)

// Form data
const formData = ref({
  name: '',
  email: '',
  message: ''
})

// Form errors
const formErrors = ref({
  name: '',
  email: '',
  message: ''
})

// Handle keyboard events for modals
const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    if (showPrivacyPolicy.value) showPrivacyPolicy.value = false
    if (showImprint.value) showImprint.value = false
    if (showAccessibilityStatement.value) showAccessibilityStatement.value = false
    if (showContactForm.value) closeContactForm()
    if (showVideoModal.value) closeVideoModal()
    if (showGalleryModal.value) closeGalleryModal()
  }
  
  if (showGalleryModal.value) {
    if (e.key === 'ArrowLeft') prevImage()
    if (e.key === 'ArrowRight') nextImage()
  }
}

// Check if cookie consent has been given
// Only show cookie banner after startup preferences have been set
onMounted(() => {
  checkCookieBanner()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Cookie consent functions
const acceptCookies = () => {
  localStorage.setItem('cookieConsent', 'accepted')
  localStorage.setItem('cookieConsentDate', new Date().toISOString())
  showCookieBanner.value = false
}

const rejectCookies = () => {
  localStorage.setItem('cookieConsent', 'rejected')
  localStorage.setItem('cookieConsentDate', new Date().toISOString())
  // Remove language preference if cookies are rejected
  localStorage.removeItem('language')
  showCookieBanner.value = false
}

// Focus management for modals
const openModal = (modalRef) => {
  modalRef.value = true
  // Focus the modal after it's rendered
  setTimeout(() => {
    const modal = document.querySelector('.modal-content')
    if (modal) {
      const closeButton = modal.querySelector('.modal-close')
      if (closeButton) {
        closeButton.focus()
      }
    }
  }, 100)
}


// Date cache for performance
const dateCache = new Map()

// Helper function to parse dateFinished (format: "YYYY-MM") with caching
const parseDate = (dateStr) => {
  if (!dateStr) return new Date(0)
  if (dateCache.has(dateStr)) return dateCache.get(dateStr)
  const [year, month] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, 1)
  dateCache.set(dateStr, date)
  return date
}

// Helper function to sort projects (optimized)
const sortProjects = (projects) => {
  return [...projects].sort((a, b) => {
    const dateA = parseDate(a.dateFinished)
    const dateB = parseDate(b.dateFinished)
    return dateB - dateA // Newest first
  })
}

// Projects data - sorted by dateFinished (newest first)
const projects = computed(() => {
  return sortProjects(projectsData.projects)
})

// State for showing all projects vs featured only
const showAllGames = ref(false)
const showAllWeb = ref(false)

// Game projects - all
const allGames = computed(() => {
  return projects.value.filter(p => p.category === 'Game Development')
})

// Web projects - all
const webProjects = computed(() => {
  return projects.value.filter(p => p.category === 'Web Development')
})

// Displayed game projects (filtered based on showAllGames)
const displayedGames = computed(() => {
  if (showAllGames.value) {
    return allGames.value
  }
  return allGames.value.filter(p => p.featured)
})

// Displayed web projects (filtered based on showAllWeb)
const displayedWebProjects = computed(() => {
  if (showAllWeb.value) {
    return webProjects.value
  }
  return webProjects.value.filter(p => p.featured)
})

const hasHiddenGames = computed(() => allGames.value.some(p => !p.featured))
const hasHiddenWeb = computed(() => webProjects.value.some(p => !p.featured))

const getShowMoreText = (isShowLess) => {
  if (language.value === 'de') {
    return isShowLess ? 'Weniger anzeigen' : 'Mehr anzeigen'
  }
  return isShowLess ? 'Show Less' : 'Show More'
}


// Pre-calculate pairing maps for performance
const gamesPairingMap = computed(() => calculateFeaturedPairing(displayedGames.value))
const webPairingMap = computed(() => calculateFeaturedPairing(displayedWebProjects.value))

const gamesLayoutMap = computed(() => calculateLayout(displayedGames.value, gamesPairingMap.value))
const webLayoutMap = computed(() => calculateLayout(displayedWebProjects.value, webPairingMap.value))

// Latest project with image (by dateFinished)
const latestProject = computed(() => {
  // Projects are already sorted by dateFinished (newest first)
  return projects.value.find(p => p.image && p.image.trim() !== '') || null
})

// Map project titles to translation keys (cached for performance)
const PROJECT_TITLE_MAP = {
  'Welt-Aal': 'weltAal',
  'Collectivity: Gemeinsam zurück in die Zukunft': 'collectivity',
  'Defeat the Beast': 'defeatTheBeast',
  'escooty': 'escooty',
  'Underwater8': 'underwater8',
  'Galerie “Der Sturm”': 'galerieDerSturm',
  'pitips.de': 'pitipsDe',
  'PARTiZiPATiONSHUB': 'partizipationsHub',
  'Bachelor Thesis Web App': 'bachelorThesisWebApp',
  'Informationen zu Bürgerbeteiligung': 'bachelorThesisWebApp',
  'Vermittlung von grundlegenden Programmierkonzepten mithilfe von VR': 'masterThesisGame',
  'Optical Illusions in VR': 'opticalIllusionsVR',
  'Optische Illusionen in VR': 'opticalIllusionsVR',
  'Portfolio Website': 'portfolioWebsite',
  'Interactive Dashboard': 'interactiveDashboard',
  'WebGL Game Engine': 'webglGameEngine',
  'Social Media App': 'socialMediaApp',
  'Zukunftsentscheid Hamburg': 'zukunftsentscheidHamburg'
}

const getProjectTranslationKey = (title) => PROJECT_TITLE_MAP[title] || null

// Get translated project text
const getProjectText = (project, textKey) => {
  const translationKey = getProjectTranslationKey(project.title)
  if (translationKey) {
    const translationKeyPath = `home.projectTranslations.${translationKey}.${textKey}`
    const translation = t(translationKeyPath)
    // If translation returns the key path (translation not found), return empty
    // Otherwise return the translation
    if (translation && translation !== translationKeyPath && typeof translation === 'string') {
      return translation
    }
  }
  return ''
}

// Get translated project title
const getProjectTitle = (project) => {
  const translationKey = getProjectTranslationKey(project.title)
  if (translationKey) {
    const translation = t(`home.projectTranslations.${translationKey}.title`)
    // If translation returns the key path, it means translation not found, return original title
    if (translation && !translation.includes('projectTranslations')) {
      return translation
    }
  }
  return project.title
}

// Get translated keyword
const getTranslatedKeyword = (keyword) => {
  if (!keyword) return ''
  const translation = t(`home.keywords.${keyword}`)
  // If translation returns the key path, it means translation not found, return original keyword
  if (translation && !translation.includes('keywords.')) {
    return translation
  }
  return keyword
}

// Filter keywords to remove empty strings
const getFilteredKeywords = (keywords) => {
  return keywords.filter(k => k && k.trim() !== '')
}

// Get translated link label (cache translations)
const LINK_LABEL_KEYS = {
  'Play on itch.io': 'home.playOnItchIo',
  'Visit Website': 'home.visitWebsite',
  'Visit the Meet-Up Website': 'home.visitMeetUpWebsite',
  'View on GitHub': 'home.viewOnGitHub'
}

const getLinkLabel = (label) => {
  const key = LINK_LABEL_KEYS[label]
  return key ? t(key) : label
}

// Format dateFinished (format: "YYYY-MM") to display format
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const [year, month] = dateStr.split('-')
  const monthNames = language.value === 'de' 
    ? ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const monthIndex = parseInt(month, 10) - 1
  return `${monthNames[monthIndex]} ${year}`
}

// Pre-calculate which featured projects should be paired (to avoid circular dependencies)
const calculateFeaturedPairing = (projects) => {
  const pairingMap = {}
  
  // Iterate through projects and find pairs of featured projects that can share a row
  for (let i = 0; i < projects.length; i++) {
    if (!projects[i].featured || pairingMap[i]) continue
    
    // Calculate position of current project (assuming it takes 4 columns for now)
    let currentColumn = 0
    for (let k = 0; k < i; k++) {
      currentColumn += projects[k].featured ? (pairingMap[k] ? 3 : 4) : 2
    }
    
    const currentRow = Math.floor(currentColumn / 6)
    const currentPositionInRow = currentColumn % 6
    
    // Find next featured project
    for (let j = i + 1; j < projects.length; j++) {
      if (!projects[j].featured || pairingMap[j]) continue
      
      // Calculate where next featured would be if current takes 3 columns
      let nextColumn = currentColumn + 3 // Current takes 3 columns
      
      // Add columns for all projects between i and j
      for (let k = i + 1; k < j; k++) {
        // Use actual width: paired featured = 3, unpaired featured = 4, unfeatured = 2
        nextColumn += projects[k].featured ? (pairingMap[k] ? 3 : 4) : 2
      }
      
      const nextRow = Math.floor(nextColumn / 6)
      const nextPositionInRow = nextColumn % 6
      
      // If both would be on the same row and both fit with 3 columns each
      // Special case: if they're the last two projects and both are featured, try to pair them
      const areLastTwo = i === projects.length - 2 && j === projects.length - 1
      
      if (areLastTwo && projects[i].featured && projects[j].featured) {
        // Last two featured projects should pair if there's space (current position + 3 <= 6)
        if (currentPositionInRow + 3 <= 6) {
          pairingMap[i] = true
          pairingMap[j] = true
        }
      } else if (currentRow === nextRow && 
          currentPositionInRow + 3 <= 6 && 
          nextPositionInRow + 3 <= 6) {
        pairingMap[i] = true
        pairingMap[j] = true
      }
      break // Only check the next featured project
    }
  }
  
  return pairingMap
}

// Pre-calculate layout to determine if items start on a new row
const calculateLayout = (projects, pairingMap) => {
  const layoutMap = {}
  let row = 0
  let col = 0
  
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i]
    const isFeatured = project.featured
    const isPaired = isFeatured && pairingMap[i]
    const width = isFeatured ? (isPaired ? 3 : 4) : 2
    
    // Check if fits in current row
    if (col + width > 6) {
      // Wrap to next row
      row++
      col = 0
    }
    
    layoutMap[i] = {
      row,
      colStart: col,
      width
    }
    
    col += width
  }
  return layoutMap
}

// Check if a featured project should get 3 columns (when on same row as another featured)
const shouldGetThreeColumns = (project, index, pairingMap) => {
  return project.featured && pairingMap[index] === true
}

// YouTube URL helpers (optimized with regex)
const YOUTUBE_REGEX = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
const isYouTubeUrl = (url) => {
  return url ? YOUTUBE_REGEX.test(url) : false
}

const getYouTubeEmbedUrl = (url) => {
  if (!url) return ''
  const match = url.match(YOUTUBE_REGEX)
  return match ? `https://www.youtube.com/embed/${match[1]}` : url
}

// Open contact form
const openContactForm = () => {
  formData.value = {
    name: '',
    email: '',
    message: ''
  }
  formErrors.value = {
    name: '',
    email: '',
    message: ''
  }
  formSuccess.value = false
  formError.value = false
  showContactForm.value = true
  openModal(showContactForm)
}

// Close contact form
const closeContactForm = () => {
  showContactForm.value = false
  // Reset form after animation
  setTimeout(() => {
    formData.value = {
      name: '',
      email: '',
      message: ''
    }
    formErrors.value = {
      name: '',
      email: '',
      message: ''
    }
    formSuccess.value = false
    formError.value = false
  }, 300)
}

// Open video modal
const openVideoModal = (videoUrl) => {
  currentVideo.value = videoUrl
  showVideoModal.value = true
  openModal(showVideoModal)
}

// Close video modal
const closeVideoModal = () => {
  showVideoModal.value = false
  setTimeout(() => {
    currentVideo.value = null
  }, 300)
}

// Open gallery modal
const openGalleryModal = (gallery) => {
  currentGallery.value = gallery
  currentGalleryIndex.value = 0
  showGalleryModal.value = true
  openModal(showGalleryModal)
}

// Close gallery modal
const closeGalleryModal = () => {
  showGalleryModal.value = false
  setTimeout(() => {
    currentGallery.value = []
    currentGalleryIndex.value = 0
  }, 300)
}

// Gallery navigation
const nextImage = () => {
  if (currentGallery.value.length === 0) return
  currentGalleryIndex.value = (currentGalleryIndex.value + 1) % currentGallery.value.length
}

const prevImage = () => {
  if (currentGallery.value.length === 0) return
  currentGalleryIndex.value = (currentGalleryIndex.value - 1 + currentGallery.value.length) % currentGallery.value.length
}

// Email validation regex (compiled once)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Validate form
const validateForm = () => {
  formErrors.value = {
    name: '',
    email: '',
    message: ''
  }
  let isValid = true

  if (!formData.value.name.trim()) {
    formErrors.value.name = t('home.contactForm.nameRequired')
    isValid = false
  }

  if (!formData.value.email.trim()) {
    formErrors.value.email = t('home.contactForm.emailInvalid')
    isValid = false
  } else if (!EMAIL_REGEX.test(formData.value.email)) {
    formErrors.value.email = t('home.contactForm.emailInvalid')
    isValid = false
  }

  if (!formData.value.message.trim()) {
    formErrors.value.message = t('home.contactForm.messageRequired')
    isValid = false
  }

  return isValid
}

// Submit form
const submitForm = () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  formError.value = false
  formSuccess.value = false

  try {
    // Prepare email data
    const subject = encodeURIComponent('Contact Form - Portfolio')
    const emailBody = encodeURIComponent(
      `Name: ${formData.value.name}\n` +
      `Email: ${formData.value.email}\n\n` +
      `Message:\n${formData.value.message}`
    )

    // Create mailto link to open user's email client
    const mailtoLink = `mailto:janole.petersen@gmx.de?subject=${subject}&body=${emailBody}`
    
    // Open email client
    window.location.href = mailtoLink
    
    // Show success message
    formSuccess.value = true
    
    // Reset form after a short delay
    setTimeout(() => {
      closeContactForm()
    }, 2000)
  } catch (error) {
    console.error('Error opening email client:', error)
    formError.value = true
  } finally {
    isSubmitting.value = false
  }
}

// Color system - cyan theme
const accentColor = ref('#00d9ff') // Primary cyan
const secondaryColor = ref('#0a1a1f') // Dark blue/black
const lighterAccentColor = ref('#33e5ff') // Lighter cyan

// Calculate luminance for contrast checking
const getLuminance = (hex) => {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    val = val / 255
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// RGB cache for performance
const rgbCache = new Map()

// Convert hex to RGB (with caching)
const hexToRgb = (hex) => {
  if (rgbCache.has(hex)) return rgbCache.get(hex)
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  const rgb = result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
  if (rgb) rgbCache.set(hex, rgb)
  return rgb
}

// Get readable text color based on background
const getReadableAccentColor = (bgColor) => {
  const bgLuminance = getLuminance(bgColor)
  const accentLuminance = getLuminance(accentColor.value)
  
  // If background is dark (luminance < 0.2), ensure accent is bright enough
  if (bgLuminance < 0.2) {
    // If accent is too dark, brighten it
    if (accentLuminance < 0.3) {
      return adjustBrightness(accentColor.value, 0.5)
    }
    return accentColor.value
  }
  
  // If background is light, darken the accent
  if (bgLuminance > 0.5) {
    return adjustDarkness(accentColor.value, 0.3)
  }
  
  return accentColor.value
}

// Get a darker variant for hover states (cached)
const getDarkerAccent = computed(() => {
  return adjustDarkness(accentColor.value, 0.15)
})

// Adjust brightness
const adjustBrightness = (hex, percent) => {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  
  const adjust = (val) => {
    const newVal = Math.max(0, Math.min(255, val + ((255 - val) * percent)))
    return Math.round(newVal)
  }
  
  const r = adjust(rgb.r).toString(16).padStart(2, '0')
  const g = adjust(rgb.g).toString(16).padStart(2, '0')
  const b = adjust(rgb.b).toString(16).padStart(2, '0')
  
  return `#${r}${g}${b}`
}

// Adjust darkness
const adjustDarkness = (hex, percent) => {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  
  const adjust = (val) => {
    const newVal = Math.max(0, Math.min(255, val * (1 - percent)))
    return Math.round(newVal)
  }
  
  const r = adjust(rgb.r).toString(16).padStart(2, '0')
  const g = adjust(rgb.g).toString(16).padStart(2, '0')
  const b = adjust(rgb.b).toString(16).padStart(2, '0')
  
  return `#${r}${g}${b}`
}

// Compute dynamic styles
const dynamicStyles = computed(() => {
  // Dark background colors used in the portfolio
  const darkBg = secondaryColor.value
  const cardBg = '#1a2529' // Slightly lighter than secondary for cards
  
  // Get readable accent colors for different backgrounds
  const accentOnDark = getReadableAccentColor(darkBg)
  const accentOnCard = getReadableAccentColor(cardBg)
  
  // Create gradient for hero title
  const lighterAccent = lighterAccentColor.value
  const gradient = `linear-gradient(135deg, ${accentColor.value} 0%, ${lighterAccent} 100%)`
  
  // Hover states
  const accentHover = getDarkerAccent.value
  const accentHoverLight = lighterAccent
  
  // Create rgba version for radial gradient with opacity
  const rgb = hexToRgb(accentColor.value)
  const accentRgba = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)` : 'rgba(0, 217, 255, 0.1)'
  
  // Get base URL for assets
  const baseUrl = import.meta.env.BASE_URL
  
  return {
    '--accent-color': accentColor.value,
    '--accent-on-dark': accentOnDark,
    '--accent-on-card': accentOnCard,
    '--accent-gradient': gradient,
    '--accent-hover': accentHover,
    '--accent-hover-light': accentHoverLight,
    '--accent-lighter': lighterAccent,
    '--accent-rgba': accentRgba,
    '--secondary-color': secondaryColor.value,
    '--bg-image-url': `url(${baseUrl}bg.jpg)`
  }
})

const scrollTo = (elementId) => {
  if (elementId === 'privacy-policy') {
    openModal(showPrivacyPolicy)
    return
  }
  if (elementId === 'imprint') {
    openModal(showImprint)
    return
  }
  if (elementId === 'accessibility-statement') {
    openModal(showAccessibilityStatement)
    return
  }
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>
