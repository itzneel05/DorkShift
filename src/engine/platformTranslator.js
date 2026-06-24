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
    const launchUrl = buildSearchUrl(platformId, injected.displayDork, platformData)
    results.push({
      dork: injected.displayDork,
      rawDork: injected.rawDork,
      launchUrl,
      operatorType: injected.operatorType,
    })
  }

  return results
}
