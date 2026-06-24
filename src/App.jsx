import { useState, useRef, useCallback, useEffect } from 'react'

import categoriesData from './data/categories.json'
import platformsData from './data/platforms.json'
import mutationsData from './data/mutations.json'
import frameworksData from './data/frameworks.json'
import templatesData from './data/templates.json'

import { parseDork, parseTarget } from './engine/parser.js'
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
  const [targetState, setTargetState] = useState(null)
  const [results, setResults] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [lastDuration, setLastDuration] = useState(0)

  const classifyTimer = useRef(null)

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
  }, [])

  const selectedCategory = categoriesData.find(c => c.id === selectedCategoryId) || null

  const debouncedClassify = useCallback((input) => {
    if (classifyTimer.current) {
      clearTimeout(classifyTimer.current)
    }
    classifyTimer.current = setTimeout(() => {
      if (!input || !input.trim()) {
        setClassifierResult(null)
        setTargetState(null)
        return
      }

      const target = parseTarget(input)
      setTargetState(target && target.type ? { type: target.type, value: target.value, valid: target.valid, label: target.label } : null)

      const seedForParse = target && target.type ? target.seedInput || target.value : input
      const parsed = parseDork(seedForParse)
      const result = classifyIntent(parsed, categoriesData)
      setClassifierResult(result.confidence > 0 ? result : null)
    }, 300)
  }, [])

  const handleSeedInput = useCallback((value) => {
    setSeedInput(value)
    debouncedClassify(value)
  }, [debouncedClassify])

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
    if (!template || !template.config) return
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

  const handleRun = useCallback(() => {
    if (!selectedCategory) return
    if (activePlatformIds.length === 0) return

    setIsRunning(true)

    setTimeout(() => {
      try {
        const startTime = performance.now()

        const variants = expandVocabulary(selectedCategory, { max_variants: 50 })

        const mutatedDorks = runMutations(variants, selectedCategory, {
          mutations: enabledMutationIds,
          mutationConfigs,
          frameworkData: frameworksData,
          maxOutput: 25,
        })

        const deduped = deduplicate(mutatedDorks, 'lowercase')

        const platformResults = {}
        for (const pid of activePlatformIds) {
          const translated = translateForPlatform(deduped, pid, selectedCategory, platformsData)
          if (translated.length > 0) {
            platformResults[pid] = translated
          }
        }

        const endTime = performance.now()
        const duration = Math.round(endTime - startTime)

        const formatted = formatOutput(platformResults, selectedCategory, mutationConfigs, duration)
        setResults(formatted)
        setLastDuration(duration)
      } catch (err) {
        console.error('RUN error:', err)
      } finally {
        setIsRunning(false)
      }
    }, 50)
  }, [selectedCategory, activePlatformIds, enabledMutationIds, mutationConfigs])

  return (
    <div className="flex h-screen">
      <div className="flex-1 border-r border-border overflow-auto">
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
          targetState={targetState}
        />
      </div>

      <div className="flex-1 border-r border-border overflow-auto">
        <RecipePane
          mutations={mutationsData}
          enabledMutationIds={enabledMutationIds}
          onMutationToggle={handleMutationToggle}
          mutationConfigs={mutationConfigs}
          onMutationConfigChange={handleMutationConfigChange}
          templates={templatesData}
          onTemplateSelect={handleTemplateSelect}
        />
      </div>

      <div className="flex-1 overflow-auto">
        <OutputPane
          results={results}
          isRunning={isRunning}
          onRun={handleRun}
          platforms={platformsData}
          selectedCategory={selectedCategory}
          duration={lastDuration}
        />
      </div>
    </div>
  )
}

export default App
