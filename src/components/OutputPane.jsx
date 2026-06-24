import { useState } from 'react'
import { saveAs } from 'file-saver'
import RunButton from './RunButton.jsx'
import DorkRow from './DorkRow.jsx'

function OutputPane({ results, isRunning, onRun, platforms, selectedCategory, duration }) {
  const [activeTab, setActiveTab] = useState(null)

  const platformNames = {}
  for (const p of platforms) {
    platformNames[p.id] = p.name
  }

  const platformIds = results ? Object.keys(results.byPlatform) : []
  const currentTab = activeTab && platformIds.includes(activeTab) ? activeTab : platformIds[0] || null

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
        <div className="text-[10px] text-[#666] font-sans">
          {results.totalCount} dorks generated in {duration}ms
        </div>
      )}

      {!results && !isRunning && (
        <div className="flex-1 flex items-center justify-center text-xs text-[#555] font-sans">
          {selectedCategory
            ? 'Select platforms and press RUN'
            : 'Select a category to begin'
          }
        </div>
      )}

      {results && platformIds.length > 0 && (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex border-b border-[#2a2a2a] shrink-0 overflow-x-auto">
            {platformIds.map(pid => (
              <div
                key={pid}
                onClick={() => setActiveTab(pid)}
                className={`px-2.5 py-1 text-[11px] cursor-pointer font-sans whitespace-nowrap select-none ${
                  pid === currentTab
                    ? 'text-text border-b-2 border-accent'
                    : 'text-[#666] border-b-2 border-transparent'
                }`}
              >
                {platformNames[pid] || pid} ({results.byPlatform[pid].count})
              </div>
            ))}
          </div>

          {currentTab && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex gap-1 px-2 py-1 border-b border-[#1a1a1a] shrink-0">
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
                {results.byPlatform[currentTab].dorks.map((item, idx) => (
                  <DorkRow key={idx} dork={item.dork} rawDork={item.rawDork} launchUrl={item.launchUrl} operatorType={item.operatorType} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OutputPane
