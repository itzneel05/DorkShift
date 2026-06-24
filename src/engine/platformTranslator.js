function buildSearchUrl(platform, dorkString, platformData) {
  const template = platformData.url_template
  if (!template) return ''

  const encoded = encodeURIComponent(dorkString)
  let url = template.replace('{dork}', encoded)

  if (platform === 'fofa') {
    url = template.replace('{dork}', btoa(dorkString))
  }

  return url
}

function formatPlatformQuery(dorkString, platformId, syntaxGuide) {
  if (platformId === 'google' && !dorkString.match(/^(site|inurl|intitle|filetype|intext):/i)) {
    return dorkString
  }
  return dorkString
}

export function translateForPlatform(dorkStrings, platformId, category, platforms) {
  if (!dorkStrings || dorkStrings.length === 0) return []

  const platformData = platforms.find(p => p.id === platformId)
  if (!platformData) return []

  const results = []

  for (const dork of dorkStrings) {
    const query = formatPlatformQuery(dork, platformId, platformData.syntax_guide)
    const launchUrl = buildSearchUrl(platformId, query, platformData)
    results.push({ dork: query, launchUrl })
  }

  return results
}
