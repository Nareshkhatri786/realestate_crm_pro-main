import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from './locales/en.json';

// TODO: Add more languages in future PRs
// import es from './locales/es.json';
// import fr from './locales/fr.json';

const resources = {
  en: {
    translation: en
  }
  // TODO: Add more languages
  // es: {
  //   translation: es
  // },
  // fr: {
  //   translation: fr
  // }
};

i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language

    interpolation: {
      escapeValue: false // React already does escaping
    },

    // Debug mode for development
    debug: import.meta.env.DEV,

    // TODO: Add language detection in future PRs
    // detection: {
    //   order: ['localStorage', 'navigator', 'htmlTag'],
    //   caches: ['localStorage']
    // }
  });

export default i18n;