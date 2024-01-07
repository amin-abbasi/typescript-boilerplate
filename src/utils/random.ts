const numbers = '0123456789',
  alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  specials = '!$%^&*()_+|~-=`{}[]:;<>?,./'

type Charset = 'numeric' | 'alphabetic' | 'alphanumeric' | 'all'

interface Options {
  length: number
  charset: Charset
  exclude: string[]
}

const DEFAULT_LENGTH: number = 8
const DEFAULT_CHARSET: Charset = 'all'

function useDefault(options?: Options): Options {
  const defaultOptions: Options = {
    length: options?.length || DEFAULT_LENGTH,
    charset: options?.charset || DEFAULT_CHARSET,
    exclude: Array.isArray(options?.exclude) ? options.exclude : []
  }
  return defaultOptions
}

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
