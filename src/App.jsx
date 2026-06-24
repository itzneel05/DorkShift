import { useState, useRef, useCallback, useEffect, useMemo } from 'react'

import categoriesData from './data/categories.json'
import platformsData from './data/platforms.json'
import mutationsData from './data/mutations.json'
import frameworksData from './data/frameworks.json'
import templatesData from './data/templates.json'

import { parseDork } from './engine/parser.js'
import { classifyIntent } from './engine/intentClassifier.js'
import { expandVocabulary } from './engine/vocabularyEngine.js'
import { runMutations } from './engine/mutationEngine.js'
import { translateForPlatform } from './engine/platformTranslator.js'
import { formatOutput } from './engine/outputFormatter.js'
import { deduplicate } from './utils/deduplicator.js'
import { encodeState, decodeState } from './utils/shareUrl.js'

import SelectionPane from './components/SelectionPane.jsx'
import RecipePane from './components/RecipePane.jsx'
import OutputPane from './components/OutputPane.jsx'

function App() {
  const [seedInput, setSeedInput] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [activePlatformIds, setActivePlatformIds] = useState([])
  const [enabledMutationIds, setEnabledMutationIds] = useState([])
  const [mutationConfigs, setMutationConfigs] = useState({})
  const [classifierResult, setClassifierResult] = useState(null)
  const [targetType, setTargetType] = useState(null)
  const [targetValue, setTargetValue] = useState('')
  const [results, setResults] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [lastDuration, setLastDuration] = useState(0)
  const [lastStats, setLastStats] = useState({ dedupCount: 0, wasCapped: false })
  const [viewportWide, setViewportWide] = useState(window.innerWidth >= 1024)
  const [autoRunEnabled, setAutoRunEnabled] = useState(true)

  const classifyTimer = useRef(null)
  const autoRunTimer = useRef(null)
  const isOutputFocused = useRef(false)
  const appRef = useRef(null)

  const allPlatformIds = platformsData.map(p => p.id)
  const allMutationIds = mutationsData.map(m => m.id)
  const defaultMutationIds = mutationsData.filter(m => m.enabled_by_default).map(m => m.id)

  useEffect(() => {
    setActivePlatformIds(allPlatformIds)
    setEnabledMutationIds(defaultMutationIds)

    const defaultConfigs = {}
    for (const mut of mutationsData) {
      if (mut.config_schema) {
        defaultConfigs[mut.id] = { ...mut.config_schema }
      }
    }
    setMutationConfigs(defaultConfigs)

    const params = new URLSearchParams(window.location.search)
    const saved = params.get('s')
    if (saved) {
      const state = decodeState(saved)
      if (state) {
        if (state.seedInput) setSeedInput(state.seedInput)
        if (state.category) setSelectedCategoryId(state.category)
        if (state.platforms) setActivePlatformIds(state.platforms)
        if (state.mutations) setEnabledMutationIds(state.mutations)
        if (state.targetType) setTargetType(state.targetType)
        if (state.targetValue) setTargetValue(state.targetValue)
      }
    }

    const handleResize = () => setViewportWide(window.innerWidth >= 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const selectedCategory = categoriesData.find(c => c.id === selectedCategoryId) || null

  const targetState = targetType && targetValue.trim()
    ? { type: targetType, value: targetValue.trim(), valid: true, label: targetType.toUpperCase() }
    : null

  const debouncedClassify = useCallback((input) => {
    if (classifyTimer.current) {
      clearTimeout(classifyTimer.current)
    }
    classifyTimer.current = setTimeout(() => {
      if (!input || !input.trim()) {
        setClassifierResult(null)
        return
      }

      const parsed = parseDork(input)
      const result = classifyIntent(parsed, categoriesData)
      setClassifierResult(result.confidence > 0 ? result : null)
    }, 300)
  }, [])

  const handleSeedInput = useCallback((value) => {
    setSeedInput(value)
    debouncedClassify(value)
  }, [debouncedClassify])

  const handleTargetTypeChange = useCallback((type) => {
    setTargetType(prev => prev === type ? null : type)
  }, [])

  const handleTargetValueChange = useCallback((value) => {
    setTargetValue(value)
  }, [])

  const handleCategorySelect = useCallback((categoryId) => {
    setSelectedCategoryId(categoryId)
    const cat = categoriesData.find(c => c.id === categoryId)
    if (cat) {
      const parsed = parseDork(cat.name)
      const result = classifyIntent(parsed, categoriesData)
      setClassifierResult(result.confidence > 0 ? result : null)
    }
  }, [])

  const handlePlatformToggle = useCallback((platformId) => {
    setActivePlatformIds(prev => {
      if (prev.includes(platformId)) {
        return prev.filter(id => id !== platformId)
      }
      return [...prev, platformId]
    })
  }, [])

  const handleMutationToggle = useCallback((mutationId) => {
    setEnabledMutationIds(prev => {
      if (prev.includes(mutationId)) {
        return prev.filter(id => id !== mutationId)
      }
      return [...prev, mutationId]
    })
  }, [])

  const handleMutationConfigChange = useCallback((mutationId, config) => {
    setMutationConfigs(prev => ({
      ...prev,
      [mutationId]: { ...prev[mutationId], ...config },
    }))
  }, [])

  const handleTemplateSelect = useCallback((template) => {
    if (!template) {
      setSelectedTemplate(null)
      return
    }
    if (!template.config) return
    setSelectedTemplate(template)
    const cfg = template.config
    if (cfg.category) setSelectedCategoryId(cfg.category)
    if (cfg.platforms) setActivePlatformIds(cfg.platforms)
    if (cfg.mutations) {
      setEnabledMutationIds(cfg.mutations)
    }
    if (cfg.category) {
      const cat = categoriesData.find(c => c.id === cfg.category)
      if (cat) {
        const parsed = parseDork(cat.name)
        const result = classifyIntent(parsed, categoriesData)
        setClassifierResult(result.confidence > 0 ? result : null)
      }
    }
  }, [])

  const runPipeline = useCallback(() => {
    if (!selectedCategory) return
    if (activePlatformIds.length === 0) return
    if (isRunning) return

    setIsRunning(true)
    const startTime = performance.now()

    try {
      const variants = expandVocabulary(selectedCategory, { max_variants: 50 })

      const maxOutput = 25
      const mutatedDorks = runMutations(variants, selectedCategory, {
        mutations: enabledMutationIds,
        mutationConfigs,
        frameworkData: frameworksData,
        maxOutput,
      })

      const deduped = deduplicate(mutatedDorks, 'lowercase')
      const dedupCount = mutatedDorks.length - deduped.length

      const platformResults = {}
      for (const pid of activePlatformIds) {
        const translated = translateForPlatform(deduped, pid, selectedCategory, platformsData, targetState)
        if (translated.length > 0) {
          platformResults[pid] = translated
        }
      }

      const duration = Math.round(performance.now() - startTime)

      const wasCapped = Object.values(platformResults).some((dorks) => dorks.length >= maxOutput)
      const formatted = formatOutput(platformResults, selectedCategory, mutationConfigs, duration)
      setResults(formatted)
      setLastDuration(duration)
      setLastStats({ dedupCount, wasCapped })

      const shareState = {
        seedInput,
        category: selectedCategoryId,
        platforms: activePlatformIds,
        mutations: enabledMutationIds,
        targetType,
        targetValue,
      }
      const encoded = encodeState(shareState)
      if (encoded) {
        const url = new URL(window.location)
        url.searchParams.set('s', encoded)
        window.history.replaceState({}, '', url)
      }
    } catch (err) {
      console.error('Pipeline error:', err)
    } finally {
      setIsRunning(false)
    }
  }, [selectedCategory, activePlatformIds, enabledMutationIds, mutationConfigs, targetState, seedInput])

  const handleRun = useCallback(() => {
    if (autoRunTimer.current) clearTimeout(autoRunTimer.current)
    runPipeline()
  }, [runPipeline])

  useEffect(() => {
    if (!autoRunEnabled) return
    if (autoRunTimer.current) clearTimeout(autoRunTimer.current)
    autoRunTimer.current = setTimeout(() => {
      if (!isOutputFocused.current) {
        runPipeline()
      }
    }, 250)
    return () => {
      if (autoRunTimer.current) clearTimeout(autoRunTimer.current)
    }
  }, [seedInput, selectedCategoryId, activePlatformIds, enabledMutationIds, mutationConfigs, targetType, targetValue, autoRunEnabled, runPipeline])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleRun()
      }
      if (e.key === 'Escape') {
        setSelectedCategoryId(null)
        setClassifierResult(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleRun])

  const handleOutputFocusChange = useCallback((focused) => {
    isOutputFocused.current = focused
  }, [])

  if (!viewportWide) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg text-text font-sans text-sm px-8 text-center">
        Desktop browser required — resize to &gt;1024px
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen" ref={appRef}>
      <div className="flex flex-1 min-h-0">
        <div className="flex-[22] border-r border-border overflow-auto">
          <SelectionPane
            seedInput={seedInput}
            onSeedInput={handleSeedInput}
            categories={categoriesData}
            selectedCategoryId={selectedCategoryId}
            onCategorySelect={handleCategorySelect}
            platforms={platformsData}
            activePlatformIds={activePlatformIds}
            onPlatformToggle={handlePlatformToggle}
            classifierResult={classifierResult}
            targetType={targetType}
            targetValue={targetValue}
            onTargetTypeChange={handleTargetTypeChange}
            onTargetValueChange={handleTargetValueChange}
            enabledMutationIds={enabledMutationIds}
          />
        </div>

        <div className="flex-[24] border-r border-border overflow-auto">
          <RecipePane
            mutations={mutationsData}
            enabledMutationIds={enabledMutationIds}
            onMutationToggle={handleMutationToggle}
            mutationConfigs={mutationConfigs}
            onMutationConfigChange={handleMutationConfigChange}
            templates={templatesData}
            onTemplateSelect={handleTemplateSelect}
            selectedTemplate={selectedTemplate}
          />
        </div>

        <div className="flex-[54] overflow-auto">
          <OutputPane
            results={results}
            isRunning={isRunning}
            onRun={handleRun}
            platforms={platformsData}
            selectedCategory={selectedCategory}
            duration={lastDuration}
            stats={lastStats}
            autoRunEnabled={autoRunEnabled}
            onAutoRunToggle={() => setAutoRunEnabled(p => !p)}
            onOutputFocusChange={handleOutputFocusChange}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 px-3 py-1 text-[10px] font-mono border-t border-border bg-surface text-muted shrink-0">
        <span>category: {selectedCategory?.id || 'none'}</span>
        <span className="text-border">|</span>
        <span>platforms: {activePlatformIds.length}/{platformsData.length}</span>
        <span className="text-border">|</span>
        <span>strategies: {enabledMutationIds.length}/{mutationsData.length}</span>
        <span className="text-border">|</span>
        <span>output: {results ? `${results.totalCount} dorks (${lastDuration}ms)` : '--'}</span>
      </div>
    </div>
  )
}

export default App
