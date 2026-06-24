import CategoryList from './CategoryList.jsx'
import PlatformList from './PlatformList.jsx'

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
}) {
  const bannerStyle = !classifierResult ? '' :
    classifierResult.confidence >= 0.4
      ? 'bg-success/20 text-success border border-success'
      : 'bg-warning/20 text-warning border border-warning'

  return (
    <div className="p-2 h-full flex flex-col gap-2">
      <div>
        <label className="block text-[11px] mb-1 text-muted font-sans">
          SEED DORK
        </label>
        <input
          type="text"
          value={seedInput}
          onChange={e => onSeedInput(e.target.value)}
          placeholder="Paste a dork, keyword, or secret..."
          className="w-full px-2 py-1.5 font-mono text-sm bg-surface text-text border border-border outline-none box-border"
        />
      </div>

      {classifierResult && classifierResult.confidence > 0 && (
        <div className={`px-2 py-1 text-xs font-sans ${bannerStyle}`}>
          {classifierResult.confidence >= 0.4
            ? `Detected: ${classifierResult.category?.name || 'Unknown'} (${Math.round(classifierResult.confidence * 100)}%)`
            : `Weak match: ${classifierResult.category?.name || 'Unknown'} (${Math.round(classifierResult.confidence * 100)}%) — select manually`
          }
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col gap-2">
        <div className="flex-1 min-h-0 overflow-auto">
          <CategoryList
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={onCategorySelect}
          />
        </div>

        <div className="shrink-0">
          <PlatformList
            platforms={platforms}
            activePlatformIds={activePlatformIds}
            onPlatformToggle={onPlatformToggle}
          />
        </div>
      </div>
    </div>
  )
}

export default SelectionPane
