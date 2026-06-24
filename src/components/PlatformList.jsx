function PlatformList({ platforms, activePlatformIds, onPlatformToggle }) {
  return (
    <div>
      <div className="text-[11px] mb-1 text-muted font-sans">
        PLATFORMS ({platforms.length})
      </div>
      <div className="max-h-[180px] overflow-y-auto">
        {platforms.map(p => {
          const isActive = activePlatformIds.includes(p.id)
          return (
            <label
              key={p.id}
              className={`flex items-center gap-1.5 px-1.5 py-0.5 cursor-pointer text-xs font-sans border-b border-[#2a2a2a] select-none ${
                isActive ? 'text-text' : 'text-[#555]'
              }`}
            >
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => onPlatformToggle(p.id)}
                style={{ accentColor: '#00cc66' }}
              />
              {p.name}
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default PlatformList
