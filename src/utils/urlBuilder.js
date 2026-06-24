const PLATFORM_URLS = {
  google:    'https://www.google.com/search?q={dork}',
  github:    'https://github.com/search?q={dork}&type=code',
  shodan:    'https://www.shodan.io/search?query={dork}',
  censys:    'https://search.censys.io/search?resource=hosts&q={dork}',
  x_twitter: 'https://x.com/search?q={dork}&src=typed_query',
  linkedin:  'https://www.linkedin.com/search/results/content/?keywords={dork}',
  pastebin:  'https://pastebin.com/search?q={dork}',
  virustotal:'https://www.virustotal.com/gui/search/{dork}',
  urlscan:   'https://urlscan.io/search/#{dork}',
  fofa:      'https://en.fofa.info/result?qbase64={dork}',
  grep_app:  'https://grep.app/search?q={dork}',
  publicwww: 'https://publicwww.com/source/{dork}',
}

export function buildLaunchUrl(platformId, dorkString) {
  const template = PLATFORM_URLS[platformId]
  if (!template) return ''

  if (platformId === 'fofa') {
    return encodeURI(template.replace('{dork}', btoa(dorkString)))
  }

  return template.replace('{dork}', encodeURIComponent(dorkString))
}
