const PLATFORM_PATTERNS = [
  { pattern: /\bsite:\S+/i, id: 'google' },
  { pattern: /\binurl:\S+/i, id: 'google' },
  { pattern: /\bintitle:\S+/i, id: 'google' },
  { pattern: /\bfiletype:\S+/i, id: 'google' },
  { pattern: /\bintext:\S+/i, id: 'google' },
  { pattern: /\brepo:\S+/i, id: 'github' },
  { pattern: /\buser:\S+/i, id: 'github' },
  { pattern: /\blanguage:\S+/i, id: 'github' },
  { pattern: /\bpath:\S+/i, id: 'github' },
  { pattern: /\bextension:\S+/i, id: 'github' },
  { pattern: /\bport:\d+/i, id: 'shodan' },
  { pattern: /\bcountry:\S+/i, id: 'shodan' },
  { pattern: /\bcity:\S+/i, id: 'shodan' },
  { pattern: /\borg:\S+/i, id: 'shodan' },
  { pattern: /\bproduct:\S+/i, id: 'shodan' },
  { pattern: /\bhostname:\S+/i, id: 'shodan' },
  { pattern: /\bvuln:\S+/i, id: 'shodan' },
  { pattern: /\bservices\.\S+:/i, id: 'censys' },
  { pattern: /\blocation\.\S+:/i, id: 'censys' },
  { pattern: /\blabels:\S+/i, id: 'censys' },
  { pattern: /\bfrom:\S+/i, id: 'x_twitter' },
  { pattern: /\bto:\S+/i, id: 'x_twitter' },
  { pattern: /\bhas:\S+/i, id: 'x_twitter' },
  { pattern: /\bdomain:\S+/i, id: 'urlscan' },
  { pattern: /\bip:\S+/i, id: 'urlscan' },
  { pattern: /\basn:\S+/i, id: 'urlscan' },
  { pattern: /\bserver:\S+/i, id: 'urlscan' },
  { pattern: /\bentity:\S+/i, id: 'virustotal' },
  { pattern: /\btag:\S+/i, id: 'virustotal' },
  { pattern: /\bp\:\+/i, id: 'virustotal' },
  { pattern: /\btitle=\"[^\"]*\"/i, id: 'fofa' },
  { pattern: /\tbody=\"[^\"]*\"/i, id: 'fofa' },
  { pattern: /\bprotocol=\"[^\"]*\"/i, id: 'fofa' },
]

export function parseDork(rawInput) {
  if (!rawInput || !rawInput.trim()) {
    return { tokens: [], platform: null, type: 'empty', raw: rawInput || '' }
  }

  const trimmed = rawInput.trim()

  if (trimmed.startsWith('-----BEGIN') && trimmed.includes('PRIVATE KEY')) {
    return {
      tokens: [{ value: trimmed, type: 'pem_key' }],
      platform: null,
      type: 'cryptographic_key',
      raw: trimmed,
    }
  }

  const jwtPattern = /^eyJ[a-zA-Z0-9_\-]+\.eyJ[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-]+$/
  if (jwtPattern.test(trimmed)) {
    return {
      tokens: [{ value: trimmed, type: 'jwt' }],
      platform: null,
      type: 'credential',
      raw: trimmed,
    }
  }

  let platform = null
  for (const pp of PLATFORM_PATTERNS) {
    if (pp.pattern.test(trimmed)) {
      platform = pp.id
      break
    }
  }

  const tokens = []
  const quoteRegex = /"([^"]*)"|(\S+)/g
  let match
  while ((match = quoteRegex.exec(trimmed)) !== null) {
    const value = match[1] || match[2]
    let type = 'keyword'
    if (/^[A-Z][A-Z0-9_]+$/.test(value) && value.includes('_')) {
      type = 'env_var'
    } else if (/^https?:\/\//.test(value)) {
      type = 'url'
    } else if (/^\d+$/.test(value)) {
      type = 'number'
    } else if (/^[A-Za-z0-9+/]{20,}=*$/.test(value) && value.length < 200) {
      type = 'base64'
    } else if (value.includes(':') && !value.startsWith('"') && !value.startsWith('--')) {
      type = 'operator'
    } else if (/^['\"]/.test(value)) {
      type = 'quoted'
    }
    tokens.push({ value, type })
  }

  let type = 'unknown'
  if (tokens.some(t => t.type === 'env_var')) {
    type = 'credential'
  } else if (tokens.some(t => t.type === 'jwt')) {
    type = 'credential'
  } else if (tokens.some(t => t.type === 'pem_key')) {
    type = 'credential'
  } else if (tokens.some(t => t.type === 'url')) {
    type = 'url'
  }

  return { tokens, platform, type, raw: trimmed }
}
