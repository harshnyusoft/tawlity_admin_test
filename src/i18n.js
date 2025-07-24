import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './i18n/en.json';
import ar from './i18n/ar.json';

// Get stored language or default to 'en'
const getStoredLanguage = () => {
  const stored = localStorage.getItem('language');
  return stored && ['en', 'ar'].includes(stored) ? stored : 'en';
};

// Set initial direction based on language
const setInitialDirection = (language) => {
  const isRTL = language === 'ar';
  const direction = isRTL ? 'rtl' : 'ltr';
  
  document.documentElement.setAttribute('dir', direction);
  document.documentElement.setAttribute('lang', language);
  
  if (isRTL) {
    document.body.classList.add('rtl');
  } else {
    document.body.classList.remove('rtl');
  }
  
  localStorage.setItem('direction', direction);
};

const initialLanguage = getStoredLanguage();
setInitialDirection(initialLanguage);

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: initialLanguage,
    fallbackLng: 'en',
    debug: false,
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language',
    },

    interpolation: {
      escapeValue: false,
    },

    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    
    // React options
    react: {
      useSuspense: false,
    },
  });

// Listen for language changes to update direction
i18n.on('languageChanged', (language) => {
  setInitialDirection(language);
});

export default i18n;
