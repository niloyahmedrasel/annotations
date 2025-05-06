// lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { i18nConfig } from './config';
import { en } from './languages/en';
import { ar } from './languages/ar';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: i18nConfig.defaultLocale,
    fallbackLng: i18nConfig.defaultLocale,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

export const isRTL = (lang: string) => i18nConfig.rtlLocales.includes(lang as 'ar');
