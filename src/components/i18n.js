import ru from '../locales/ru.json';
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      ru: { translation: ru }, 
    },
    lng: 'fr', 
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
