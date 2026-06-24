function stripOuterQuotes(str) {
  if (str.length >= 2 && str.startsWith('"') && str.endsWith('"')) {
    return str.slice(1, -1)
  }
  return str
}

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

function applyOperatorPrefix(operator, value) {
  if (operator.endsWith('=')) {
    return operator + '"' + value + '"'
  }
  return operator + value
}

export function applyTargetOperator(dorkString, targetState, platformData, allPlatforms) {
  if (!targetState || !targetState.type || !targetState.value) {
    return { displayDork: dorkString, rawDork: dorkString, operatorType: 'none' }
  }

  const type = targetState.type
  const targetValue = targetState.value

  const nativeOp = platformData.target_types[type]
  if (nativeOp) {
    const displayDork = applyOperatorPrefix(nativeOp, targetValue) + ' ' + dorkString
    return { displayDork, rawDork: dorkString, operatorType: 'native' }
  }

  if (platformData.relay) {
    const relayPlatform = allPlatforms.find(p => p.id === platformData.relay)
    if (relayPlatform) {
      const relayOp = relayPlatform.target_types[type]
      if (relayOp) {
        const displayDork = applyOperatorPrefix(relayOp, targetValue) + ' ' + dorkString
        return { displayDork, rawDork: dorkString, operatorType: 'relay' }
      }
    }
  }

  return { displayDork: dorkString, rawDork: dorkString, operatorType: 'bare' }
}

export function translateForPlatform(dorkStrings, platformId, category, platforms, targetState) {
  if (!dorkStrings || dorkStrings.length === 0) return []

  const platformData = platforms.find(p => p.id === platformId)
  if (!platformData) return []

  const results = []

  for (const dork of dorkStrings) {
    const injected = applyTargetOperator(dork, targetState, platformData, platforms)

    const shouldStrip = platformId === 'fofa'
    const displayDork = shouldStrip ? stripOuterQuotes(injected.displayDork) : injected.displayDork
    const rawDork = shouldStrip ? stripOuterQuotes(injected.rawDork) : injected.rawDork

    const launchUrl = buildSearchUrl(platformId, displayDork, platformData)
    results.push({
      dork: displayDork,
      rawDork,
      launchUrl,
      operatorType: injected.operatorType,
    })
  }

  if (platformId === 'fofa') {
    const seen = new Set()
    return results.filter(r => {
      const key = r.dork.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  return results
}
