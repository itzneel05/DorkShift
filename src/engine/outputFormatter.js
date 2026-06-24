export function formatOutput(platformResults, category, config, duration) {
  if (!platformResults || Object.keys(platformResults).length === 0) {
    return { byPlatform: {}, totalCount: 0, raw: '', duration: duration || 0 }
  }

  const byPlatform = {}
  let totalCount = 0

  for (const [platformId, dorks] of Object.entries(platformResults)) {
    byPlatform[platformId] = {
      dorks,
      count: dorks.length,
    }
    totalCount += dorks.length
  }

  const lines = []
  for (const [platformId, data] of Object.entries(byPlatform)) {
    lines.push(`=== ${platformId.toUpperCase()} (${data.count}) ===`)
    for (const dork of data.dorks) {
      lines.push(dork.dork)
    }
    lines.push('')
  }

  return {
    byPlatform,
    totalCount,
    raw: lines.join('\n').trim(),
    duration: duration || 0,
  }
}
