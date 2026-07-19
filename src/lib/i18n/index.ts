interface LocaleData {
  [key: string]: any;
}

const locales: Record<string, () => Promise<LocaleData>> = {
  en: () => import("./locales/en/common.json").then((m) => m.default),
  es: () => import("./locales/es/common.json").then((m) => m.default),
  fr: () => import("./locales/fr/common.json").then((m) => m.default),
};

export const defaultLocale = "en";
export const supportedLocales = Object.keys(locales);

export async function getTranslations(locale: string = defaultLocale) {
  const loadLocale = locales[locale] || locales[defaultLocale];
  return loadLocale();
}

export function getDirection(locale: string): "ltr" | "rtl" {
  const rtlLocales = ["ar", "he", "fa"];
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}
