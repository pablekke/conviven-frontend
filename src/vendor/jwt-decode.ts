const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

interface JwtDecodeOptions {
  header?: boolean
}

function padBase64(input: string) {
  const remainder = input.length % 4
  if (remainder === 0) {
    return input
  }
  if (remainder === 2) {
    return `${input}==`
  }
  if (remainder === 3) {
    return `${input}=`
  }
  throw new Error('Invalid base64 string')
}

function base64UrlDecode(segment: string) {
  const normalized = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padded = padBase64(normalized)

  const bytes: number[] = []
  let buffer = 0
  let bits = 0

  for (const character of padded) {
    if (character === '=') {
      break
    }

    const index = BASE64_ALPHABET.indexOf(character)
    if (index === -1) {
      throw new Error('Invalid character in base64 string')
    }

    buffer = (buffer << 6) | index
    bits += 6

    if (bits >= 8) {
      bits -= 8
      const code = (buffer >> bits) & 0xff
      bytes.push(code)
    }
  }

  if (typeof TextDecoder !== 'undefined') {
    const decoder = new TextDecoder()
    return decoder.decode(new Uint8Array(bytes))
  }

  let result = ''
  for (const byte of bytes) {
    result += String.fromCharCode(byte)
  }
  try {
    return decodeURIComponent(
      result
        .split('')
        .map((character) => `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    )
  } catch {
    return result
  }
}

export function jwtDecode<T = unknown>(token: string, options?: JwtDecodeOptions): T {
  if (typeof token !== 'string') {
    throw new TypeError('Invalid token specified: must be a string')
  }

  const parts = token.split('.')
  if (parts.length < 2) {
    throw new Error('Invalid token specified: missing segments')
  }

  const segment = options?.header ? parts[0] : parts[1]
  if (!segment) {
    throw new Error('Invalid token specified: missing required segment')
  }

  const decoded = base64UrlDecode(segment)

  try {
    return JSON.parse(decoded) as T
  } catch (error) {
    throw new Error('Invalid token specified: failed to parse JSON', {
      cause: error,
    })
  }
}

export default jwtDecode
