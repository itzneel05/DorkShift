import CategoryList from './CategoryList.jsx'
import PlatformList from './PlatformList.jsx'

const TARGET_TYPES = [
  { id: 'd', label: 'DOMAIN' },
  { id: 'o', label: 'ORG' },
  { id: 'r', label: 'REPO' },
  { id: 'h', label: 'HOST' },
]

function SelectionPane({
  seedInput,
  onSeedInput,
  categories,
  selectedCategoryId,
  onCategorySelect,
  platforms,
  activePlatformIds,
  onPlatformToggle,
  classifierResult,
  targetType,
  targetValue,
  onTargetTypeChange,
  onTargetValueChange,
  enabledMutationIds,
}) {
  const bannerStyle = !classifierResult ? '' :
    classifierResult.confidence >= 0.4
      ? 'bg-success/20 text-success border border-success'
      : 'bg-warning/20 text-warning border border-warning'

  const hasTarget = targetType !== null && targetValue.trim().length > 0
  const tagLabel = hasTarget ? TARGET_TYPES.find(t => t.id === targetType)?.label || targetType.toUpperCase() : 'KEYWORD'

  const selectedCategory = categories.find(c => c.id === selectedCategoryId) || null
  const estVariants = selectedCategory ? Math.min(50, (selectedCategory.keywords?.length || 5) * 2) : 0
  const estActiveMutations = enabledMutationIds?.length || 0
  const estTotal = selectedCategory && activePlatformIds.length > 0 && estActiveMutations > 0
    ? Math.min(estVariants * estActiveMutations * activePlatformIds.length, 500)
    : 0

  return (
    <div className="p-2 h-full flex flex-col gap-2">
      <div>
        <label className="block text-[11px] mb-1 text-muted font-sans">
          TARGET
        </label>
        <div className="flex gap-1 mb-1">
          {TARGET_TYPES.map(t => (
            <span
              key={t.id}
              onClick={() => onTargetTypeChange(t.id)}
              className={`px-1.5 py-0.5 text-[10px] font-sans cursor-pointer select-none border ${
                targetType === t.id
                  ? 'bg-accent/20 text-accent border-accent'
                  : 'bg-surface text-muted border-border'
              }`}
            >
              {t.label}
            </span>
          ))}
          {targetType && (
            <span
              onClick={() => onTargetTypeChange(targetType)}
              className="px-1.5 py-0.5 text-[10px] font-sans cursor-pointer select-none border bg-surface text-muted border-border"
            >
              CLEAR
            </span>
          )}
        </div>
        {targetType && (
          <input
            type="text"
            value={targetValue}
            onChange={e => onTargetValueChange(e.target.value)}
            placeholder={targetType === 'd' ? 'example.com' : targetType === 'o' ? 'acme-corp' : targetType === 'r' ? 'user/repo' : '10.0.0.0/8'}
            className="w-full px-2 py-1 text-xs font-mono bg-surface text-text border border-border outline-none box-border"
          />
        )}
      </div>

      <div>
        <label className="block text-[11px] mb-1 text-muted font-sans">
          SEED DORK
        </label>
        <div className="relative">
          <input
            type="text"
            value={seedInput}
            onChange={e => onSeedInput(e.target.value)}
            placeholder="Paste a dork, keyword, or secret..."
            className="w-full px-2 py-1.5 pr-20 font-mono text-sm bg-surface text-text border border-border outline-none box-border"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-sans uppercase tracking-wider pointer-events-none text-muted">
            {tagLabel}
          </span>
        </div>
      </div>

      <div className="min-h-[2rem] flex items-center">
        {classifierResult && classifierResult.confidence > 0 ? (
          <div className={`w-full px-2 py-1 text-xs font-sans ${bannerStyle}`}>
            {classifierResult.confidence >= 0.4
              ? `Detected: ${classifierResult.category?.name || 'Unknown'} (${Math.round(classifierResult.confidence * 100)}%)`
              : `Weak match: ${classifierResult.category?.name || 'Unknown'} (${Math.round(classifierResult.confidence * 100)}%) — select manually`
            }
          </div>
        ) : (
          <span className="text-[10px] text-muted font-sans italic">Type a dork to auto-classify...</span>
        )}
      </div>

      {estTotal > 0 && (
        <div className="text-[10px] text-muted font-sans text-right">
          ~{estTotal} dorks across {activePlatformIds.length} platforms
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col gap-2">
        <div className="flex-1 min-h-0 overflow-auto">
          <CategoryList
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={onCategorySelect}
            classifierResult={classifierResult}
          />
        </div>

        <div className="shrink-0">
          <PlatformList
            platforms={platforms}
            activePlatformIds={activePlatformIds}
            onPlatformToggle={onPlatformToggle}
            targetState={targetType && targetValue.trim() ? { type: targetType, value: targetValue.trim() } : null}
            selectedCategoryId={selectedCategoryId}
            categories={categories}
          />
        </div>
      </div>
    </div>
  )
}

export default SelectionPane
