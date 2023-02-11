const numbers = '0123456789',
  alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  specials = '!$%^&*()_+|~-=`{}[]:;<>?,./'

type Charset = 'numeric' | 'alphabetic' | 'alphanumeric' | 'all'

interface Options {
  length?: number
  charset?: Charset
  exclude?: string[]
}

function useDefault(options?: Options): Options {
  options || (options = {})
  return {
    length: options.length || 8,
    charset: options.charset || 'all',
    exclude: Array.isArray(options.exclude) ? options.exclude : [],
  } as Options
}

function buildChars(options?: Options): string {
  let chars: string = ''
  switch (options?.charset) {
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
  if (options?.exclude)
    for (let i = 0; i <= options.exclude.length; i++) {
      chars = chars.replace(options.exclude[i], '')
    }
  return chars
}

export default function random(options?: Options): string {
  options = useDefault(options)
  const length: number = options.length as number
  let index: number, random: string = ''
  const allChars: string = buildChars(options), charsLength = allChars.length
  for (let i = 1; i <= length; i++) {
    index = Math.floor(Math.random() * charsLength)
    random += allChars.substring(index, index + 1)
  }
  return random
}
