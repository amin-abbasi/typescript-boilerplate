import { NextFunction, Request, Response } from 'express'
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
  return translateTo[message] || message
}

export * from './types'

// middleware to set language
export default function i18n(req: Request, res: Response, next: NextFunction) {
  const headerLang = req.headers['content-language'] || req.headers['accept-language']

  // default language: 'en'
  let language: Language = SUPPORTED_LANGUAGES[0]

  if (typeof headerLang === 'string' && SUPPORTED_LANGUAGES.includes(headerLang)) {
    language = headerLang
  }

  req.language = language
  res.t = t

  return next()
}
