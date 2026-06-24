const PLATFORM_DOMAINS = {
  google: ['search', 'web', 'site'],
  github: ['code', 'repo', 'token', 'key', 'credential', 'secret', 'password', 'config', 'backup', 'log'],
  shodan: ['server', 'service', 'port', 'host', 'ip', 'ssl', 'cert', 'elastic', 'jenkins', 'rdp', 'docker'],
  censys: ['ssl', 'cert', 'server', 'service', 'port', 'elastic', 'jenkins', 'rdp', 'docker'],
  x_twitter: ['app', 'web', 'endpoint', 'api', 'panel'],
  linkedin: ['company', 'enterprise'],
  pastebin: ['leak', 'credential', 'key', 'token', 'secret', 'password', 'backup', 'log', 'config', 'dump'],
  virustotal: ['domain', 'ip', 'hash'],
  urlscan: ['domain', 'server', 'web', 'api', 'endpoint', 'panel'],
  fofa: ['server', 'service', 'port', 'ssl', 'cert', 'web', 'panel', 'host'],
  grep_app: ['code', 'credential', 'key', 'token', 'secret', 'password', 'config'],
  publicwww: ['code', 'script', 'analytics'],
}

function formatOperator(op, value) {
  if (op.endsWith('=')) return op + '"' + value + '"'
  return op + value
}

function getOperatorText(platformData, allPlatforms, targetType, targetValue) {
  if (!targetType || !targetValue) return null

  const nativeOp = platformData.target_types[targetType]
  if (nativeOp) return { text: formatOperator(nativeOp, targetValue), color: 'text-accent' }

  if (platformData.relay) {
    const relayPlatform = allPlatforms.find(p => p.id === platformData.relay)
    if (relayPlatform) {
      const relayOp = relayPlatform.target_types[targetType]
      if (relayOp) return { text: formatOperator(relayOp, targetValue), color: 'text-warning' }
    }
    return { text: '(relay — bare)', color: 'text-warning' }
  }

  return { text: '(bare)', color: 'text-muted' }
}

function getOperatorMarker(platformData, targetType) {
  if (!targetType) return null

  const nativeOp = platformData.target_types[targetType]
  if (nativeOp) return null

  if (platformData.relay) return { symbol: '\u21BB', color: 'text-warning', title: 'Google relay' }

  return { symbol: '\u2014', color: 'text-muted', title: 'No native operator' }
}

function computeRelevance(category, platformId) {
  if (!category) return 0.7
  const domainWords = PLATFORM_DOMAINS[platformId] || []
  const catKeywords = (category.keywords || []).map(k => k.toLowerCase())
  if (catKeywords.length === 0) return 0.5
  let matches = 0
  for (const kw of catKeywords) {
    for (const dw of domainWords) {
      if (kw.includes(dw)) { matches++; break }
    }
  }
  const ratio = matches / catKeywords.length
  const score = 0.3 + ratio * 0.7
  return Math.round(Math.min(1, score) * 10) / 10
}

function getOpacity(relevance) {
  if (relevance >= 0.7) return ''
  if (relevance >= 0.3) return 'opacity-60'
  return 'opacity-40'
}

function PlatformList({ platforms, activePlatformIds, onPlatformToggle, targetState, selectedCategoryId, categories }) {
  const targetType = targetState && targetState.type ? targetState.type : null
  const targetValue = targetState && targetState.value ? targetState.value : null
  const selectedCategory = categories?.find(c => c.id === selectedCategoryId) || null

  return (
    <div>
      <div className="text-[11px] mb-1 text-muted font-mono">
        [ PLATFORMS &middot; {platforms.length} ]
      </div>
      <div className="max-h-[180px] overflow-y-auto">
        {platforms.map(p => {
          const isActive = activePlatformIds.includes(p.id)
          const marker = getOperatorMarker(p, targetType)
          const relevance = computeRelevance(selectedCategory, p.id)
          const opacityClass = getOpacity(relevance)
          const opText = getOperatorText(p, platforms, targetType, targetValue)
          return (
            <label
              key={p.id}
              className={`flex items-center gap-1.5 px-1.5 py-0.5 cursor-pointer text-xs font-sans border-b border-[#2a2a2a] select-none ${
                isActive ? 'text-text' : 'text-muted'
              } ${opacityClass}`}
            >
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => onPlatformToggle(p.id)}
                style={{ accentColor: '#00cc66' }}
              />
              {marker && (
                <span className={`${marker.color} text-[10px] w-3 text-center shrink-0`} title={marker.title}>
                  {marker.symbol}
                </span>
              )}
              {!marker && opText && <span className="w-3 shrink-0" />}
              <span className="truncate">{p.name}</span>
              {opText && (
                <span className={`ml-auto text-[10px] font-mono shrink-0 ${opText.color}`}>
                  {opText.text}
                </span>
              )}
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default PlatformList
