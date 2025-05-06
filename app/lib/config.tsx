export const i18nConfig = {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    rtlLocales: ['ar'],
  } as const;
  
  export type Locale = typeof i18nConfig.locales[number];