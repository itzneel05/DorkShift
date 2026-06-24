function getOperatorMarker(platformData, targetType) {
  if (!targetType) return null

  const nativeOp = platformData.target_types[targetType]
  if (nativeOp) return null

  if (platformData.relay) return { symbol: '\u21BB', color: 'text-warning', title: 'Google relay' }

  return { symbol: '\u2014', color: 'text-muted', title: 'No native operator' }
}

function PlatformList({ platforms, activePlatformIds, onPlatformToggle, targetState }) {
  const targetType = targetState && targetState.type ? targetState.type : null

  return (
    <div>
      <div className="text-[11px] mb-1 text-muted font-sans">
        PLATFORMS ({platforms.length})
      </div>
      <div className="max-h-[180px] overflow-y-auto">
        {platforms.map(p => {
          const isActive = activePlatformIds.includes(p.id)
          const marker = getOperatorMarker(p, targetType)
          return (
            <label
              key={p.id}
              className={`flex items-center gap-1.5 px-1.5 py-0.5 cursor-pointer text-xs font-sans border-b border-[#2a2a2a] select-none ${
                isActive ? 'text-text' : 'text-muted'
              }`}
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
              {p.name}
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default PlatformList
