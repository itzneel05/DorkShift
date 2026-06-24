import { useState, useMemo } from 'react'
import { saveAs } from 'file-saver'
import { scoreDork } from '../utils/scorer.js'
import RunButton from './RunButton.jsx'
import DorkRow from './DorkRow.jsx'

function OutputPane({ results, isRunning, onRun, platforms, selectedCategory, duration, stats, isStale }) {
  const [activeTab, setActiveTab] = useState(null)
  const [sortBy, setSortBy] = useState('platform')

  const platformNames = {}
  for (const p of platforms) {
    platformNames[p.id] = p.name
  }

  const platformIds = results ? Object.keys(results.byPlatform) : []
  const currentTab = activeTab && platformIds.includes(activeTab) ? activeTab : platformIds[0] || null

  const sortedDorks = useMemo(() => {
    if (!results || !currentTab || !results.byPlatform[currentTab]) return []
    const dorks = [...results.byPlatform[currentTab].dorks]
    if (sortBy === 'alphabetical') {
      dorks.sort((a, b) => (a.dork || '').localeCompare(b.dork || ''))
    } else if (sortBy === 'relevance') {
      dorks.sort((a, b) => (scoreDork(b.dork, selectedCategory) - scoreDork(a.dork, selectedCategory)))
    }
    return dorks
  }, [results, currentTab, sortBy, selectedCategory])

  const handleCopyAll = async (platformId) => {
    if (!results || !results.byPlatform[platformId]) return
    const text = results.byPlatform[platformId].dorks.map(d => d.dork).join('\n')
    try {
      await navigator.clipboard.writeText(text)
    } catch {}
  }

  const handleExportTxt = () => {
    if (!results || !results.raw) return
    const blob = new Blob([results.raw], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, `dorkshift-${selectedCategory?.id || 'output'}-${Date.now()}.txt`)
  }

  return (
    <div className="p-2 h-full flex flex-col gap-2">
      <RunButton
        onClick={onRun}
        isRunning={isRunning}
        disabled={!selectedCategory}
      />

      {results && (
        <div className="flex items-center gap-2 text-[10px] text-muted font-sans">
          <span>{results.totalCount} dorks across {platformIds.length} platforms | Generated in {duration}ms</span>
          <span className="flex-1" />
          {results.totalCount > 0 && (
            <>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-transparent text-muted text-[10px] border border-border outline-none px-1 py-0.5"
              >
                <option value="platform">Sort: platform</option>
                <option value="relevance">Sort: relevance</option>
                <option value="alphabetical">Sort: A-Z</option>
              </select>
              <span
                className="text-muted cursor-pointer hover:text-text"
                onClick={() => onRun()}
                title="Clear results"
              >
                Clear
              </span>
            </>
          )}
        </div>
      )}

      {stats && (stats.dedupCount > 0 || stats.wasCapped) && results && (
        <div className="text-[10px] text-muted font-sans italic">
          {stats.dedupCount > 0 && `Deduplication removed ${stats.dedupCount} duplicate dorks`}
          {stats.dedupCount > 0 && stats.wasCapped && ' | '}
          {stats.wasCapped && 'Output capped at 25 dorks per platform'}
        </div>
      )}

      {isStale && results && (
        <div className="text-[10px] text-warning font-sans">
          Results stale — re-run to update
        </div>
      )}

      {!results && !isRunning && (
        <div className="flex-1 flex items-center justify-center text-xs text-muted font-sans">
          {selectedCategory
            ? 'Select platforms and press RUN'
            : 'Select a category to begin'
          }
        </div>
      )}

      {results && platformIds.length > 0 && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex border-b border-border shrink-0 overflow-x-auto">
            {platformIds.map(pid => (
              <div
                key={pid}
                onClick={() => setActiveTab(pid)}
                className={`px-2.5 py-1 text-[11px] cursor-pointer font-sans whitespace-nowrap select-none ${
                  pid === currentTab
                    ? 'text-text border-b-2 border-accent'
                    : 'text-muted border-b-2 border-transparent'
                }`}
              >
                {platformNames[pid] || pid} ({results.byPlatform[pid].count})
              </div>
            ))}
          </div>

          {currentTab && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex gap-1 px-2 py-1 border-b border-surface shrink-0">
                <button
                  onClick={() => handleCopyAll(currentTab)}
                  title="Copy all dorks in this tab"
                  className="bg-transparent border border-border text-muted cursor-pointer px-1.5 py-0.5 text-[11px] font-sans"
                >
                  COPY ALL
                </button>
                <button
                  onClick={handleExportTxt}
                  title="Export as .txt file"
                  className="bg-transparent border border-border text-muted cursor-pointer px-1.5 py-0.5 text-[11px] font-sans"
                >
                  EXPORT
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {results.byPlatform[currentTab].count === 0 ? (
                  <div className="flex items-center justify-center h-full text-xs text-muted font-sans text-center px-4">
                    <div>
                      No dorks generated for this platform.<br />
                      Try enabling more mutation strategies.
                    </div>
                  </div>
                ) : (
                  sortedDorks.map((item, idx) => {
                    const specificity = scoreDork(item.dork, selectedCategory)
                    const opacityClass = specificity >= 0.7 ? '' : specificity >= 0.4 ? 'opacity-70' : 'opacity-50'
                    return (
                      <div key={idx} className={opacityClass}>
                        <DorkRow dork={item.dork} rawDork={item.rawDork} launchUrl={item.launchUrl} operatorType={item.operatorType} />
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OutputPane
