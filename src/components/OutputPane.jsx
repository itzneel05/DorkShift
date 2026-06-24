import { useState, useMemo, useRef } from 'react'
import { saveAs } from 'file-saver'
import { scoreDork } from '../utils/scorer.js'
import DorkRow from './DorkRow.jsx'

function OutputPane({ results, isRunning, onRun, platforms, selectedCategory, duration, stats, autoRunEnabled, onAutoRunToggle, onOutputFocusChange }) {
  const [activeTab, setActiveTab] = useState(null)
  const [sortBy, setSortBy] = useState('platform')
  const paneRef = useRef(null)

  const platformNames = {}
  for (const p of platforms) {
    platformNames[p.id] = p.name
  }

  const platformIds = results
    ? platforms.filter(p => results.byPlatform[p.id]).map(p => p.id)
    : []
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
    if (!results) return
    const lines = []
    for (const pid of platformIds) {
      const dorks = results.byPlatform[pid]?.dorks || []
      if (dorks.length === 0) continue
      lines.push(`=== ${platformNames[pid] || pid} (${dorks.length}) ===`)
      for (const d of dorks) {
        lines.push(d.launchUrl || d.dork)
      }
      lines.push('')
    }
    const text = lines.join('\n').trim() || 'No results'
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    saveAs(blob, `dorkshift-${selectedCategory?.id || 'output'}-${Date.now()}.txt`)
  }

  return (
    <div
      className="p-2 h-full flex flex-col gap-2"
      ref={paneRef}
      onMouseEnter={() => onOutputFocusChange(true)}
      onMouseLeave={() => onOutputFocusChange(false)}
    >
      <div className="flex items-center gap-2 text-[10px] font-sans">
        <span
          onClick={onAutoRunToggle}
          className={`cursor-pointer select-none px-1.5 py-0.5 border ${
            autoRunEnabled
              ? 'bg-accent/20 text-accent border-accent'
              : 'text-muted border-border'
          }`}
          title={autoRunEnabled ? 'Auto: generation runs on changes' : 'Manual: click to generate'}
        >
          {autoRunEnabled ? 'Auto \u27F3' : 'Manual \u25B6'}
        </span>
        {!autoRunEnabled && (
          <span
            onClick={onRun}
            className={`cursor-pointer select-none px-1.5 py-0.5 border border-accent text-accent ${
              isRunning ? 'opacity-50' : ''
            }`}
          >
            {isRunning ? '...' : 'Run'}
          </span>
        )}
        {results && (
          <span className="text-muted">
            {results.totalCount} dorks &middot; {platformIds.length} platforms &middot; {duration}ms
          </span>
        )}
        <span className="flex-1" />
        {results && results.totalCount > 0 && (
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
              title="Re-run"
            >
              Clear
            </span>
          </>
        )}
      </div>

      {stats && (stats.dedupCount > 0 || stats.wasCapped) && results && (
        <div className="text-[10px] text-muted font-sans italic">
          {stats.dedupCount > 0 && `Deduplication removed ${stats.dedupCount} duplicate dorks`}
          {stats.dedupCount > 0 && stats.wasCapped && ' | '}
          {stats.wasCapped && 'Output capped at 25 dorks per platform'}
        </div>
      )}

      {!results && !isRunning && (
        <div className="flex-1 flex items-center justify-center text-xs text-muted font-sans">
          {!selectedCategory
            ? 'Select a category to begin'
            : 'Select platforms to generate dorks'
          }
        </div>
      )}

      {results && platformIds.length > 0 && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex border-t border-border shrink-0 overflow-x-auto">
            {platformIds.map(pid => (
              <div
                key={pid}
                onClick={() => setActiveTab(pid)}
                className={`px-2.5 py-1 text-[11px] cursor-pointer font-mono whitespace-nowrap select-none border-t-2 ${
                  pid === currentTab
                    ? 'text-text border-accent'
                    : 'text-muted border-transparent'
                }`}
              >
                [{platformNames[pid] || pid}&middot;{results.byPlatform[pid].count}]
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
