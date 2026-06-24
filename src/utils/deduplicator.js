export function deduplicate(dorkList, strategy) {
  if (!dorkList || dorkList.length === 0) return []

  const seen = new Set()
  const result = []

  for (const item of dorkList) {
    const dork = typeof item === 'string' ? item : item.dork
    const launchUrl = typeof item === 'string' ? '' : item.launchUrl || ''

    let key
    switch (strategy) {
      case 'exact':
        key = dork
        break
      case 'lowercase':
        key = dork.toLowerCase()
        break
      case 'normalized':
        key = dork.toLowerCase().replace(/["']/g, '').replace(/\s+/g, ' ').trim()
        break
      default:
        key = dork.toLowerCase()
    }

    if (!seen.has(key)) {
      seen.add(key)
      result.push(typeof item === 'string' ? dork : { dork, launchUrl })
    }
  }

  return result
}
