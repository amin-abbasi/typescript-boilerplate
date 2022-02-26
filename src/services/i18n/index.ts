import path from 'path'
import { I18n } from 'i18n'

/**
 * create a new instance with it's configuration
 */
const i18n = new I18n()
i18n.configure({
  locales: ['en', 'fa'],
  defaultLocale: 'en',
  header: 'accept-language',
  directory: path.join(__dirname, '/locales'),
})

export default i18n
