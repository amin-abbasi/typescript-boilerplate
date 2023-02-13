import { Context, Next } from 'koa'
import { MESSAGES } from './types'

import en from './locales/en.json'
import fa from './locales/fa.json'

// export type LANGUAGES = 'en' | 'fa' | 'tr'

export const SUPPORTED_LANGUAGES = ['en', 'fa', 'tr']
export type Language = typeof SUPPORTED_LANGUAGES[number]

// export type Translations = {
//   [key in Language]: {
//     [key in MESSAGES]: string
//   }
// }
export type Translations = {
  [key: string]: {
    [key: string]: string
  }
}

const translations: Translations = { en, fa }

// Function to translate based on set language [default: 'en']
export type Translate = (message: MESSAGES, lang: Language) => string

export const t: Translate = (message: MESSAGES, lang: Language): string => {
  const translateTo = translations[lang] || translations['en']
  const result = translateTo[message] || message
  console.log('t translateTo: ', translateTo)
  console.log('t message: ', message)
  console.log('t result: ', result)
  return result
}

// middleware to set language
export default function i18n(ctx: Context, next: Next) {
  const headerLang = ctx.headers['content-language'] || ctx.headers['accept-language']

  // default language: 'en'
  let language: Language = SUPPORTED_LANGUAGES[0]

  if (typeof headerLang === 'string' && SUPPORTED_LANGUAGES.includes(headerLang)) {
    language = headerLang
  }

  ctx.language = language
  ctx.t = t

  return next()
}
