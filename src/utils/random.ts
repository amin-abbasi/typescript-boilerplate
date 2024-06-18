const numbers = '0123456789',
  alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  specials = '!$%^&*()_+|~-=`{}[]:;<>?,./'

type Charset = 'numeric' | 'alphabetic' | 'alphanumeric' | 'all'

interface Options {
  /**
   * The length of the generated string.
   */
  length: number
  /**
   * The character set to use for generating the string.
   * - 'numeric': Only numeric characters (0-9).
   * - 'alphabetic': Only alphabetic characters (A-Z, a-z).
   * - 'alphanumeric': Both numeric and alphabetic characters.
   * - 'all': Numeric, alphabetic, and special characters.
   */
  charset: Charset
  /**
   * Characters to exclude from the generated string.
   */
  exclude: string[]
}

const DEFAULT_LENGTH: number = 8
const DEFAULT_CHARSET: Charset = 'all'

/**
 * Merges provided options with default values.
 *
 * @param options - Custom options to override the defaults.
 * @returns Complete options object with defaults applied.
 */
function useDefault(options?: Options): Options {
  const defaultOptions: Options = {
    length: options?.length || DEFAULT_LENGTH,
    charset: options?.charset || DEFAULT_CHARSET,
    exclude: Array.isArray(options?.exclude) ? options.exclude : []
  }
  return defaultOptions
}

/**
 * Builds the character string to be used for generating random strings based on the given options.
 *
 * @param options - Options specifying the desired character set and exclusions.
 * @returns A string containing characters to use for random string generation.
 */
function buildChars(options: Options): string {
  let chars = ''
  switch (options.charset) {
    case 'numeric':
      chars = numbers
      break
    case 'alphabetic':
      chars = alphabets
      break
    case 'alphanumeric':
      chars = numbers + alphabets
      break
    default:
      chars = numbers + alphabets + specials
      break
  }
  if (options.exclude) {
    for (let i = 0; i < options.exclude.length; i++) {
      chars = chars.replace(options.exclude[i], '')
    }
  }
  return chars
}

/**
 * Generates a random string based on the provided options.
 *
 * @param options - Optional configuration for generating the random string.
 * @returns A random string of specified length and character set.
 */
export function random(options?: Options): string {
  options = useDefault(options)
  const length = options.length
  let random = ''
  const allChars = buildChars(options)
  const charsLength = allChars.length
  for (let i = 1; i <= length; i++) {
    const index = Math.floor(Math.random() * charsLength)
    random += allChars.substring(index, index + 1)
  }
  return random
}
