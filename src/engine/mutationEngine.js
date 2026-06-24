function applyCaseMutations(keyword) {
  const variants = new Set()
  variants.add(keyword)
  variants.add(keyword.toLowerCase())
  variants.add(keyword.toUpperCase())
  variants.add(keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase())

  const parts = keyword.split(/[_\-.:/]/)
  if (parts.length > 1) {
    let pascal = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join('')
    let camel = parts[0].toLowerCase() + parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join('')
    variants.add(pascal)
    variants.add(camel)
  }

  return [...variants]
}

function applySeparatorMutations(keyword, separators) {
  const variants = new Set()
  const hasSep = [...'_\\-.\\:\\/'].some(s => keyword.includes(s))

  if (!hasSep) return [keyword]

  for (const sep of ['_', '-', '.', '', ':', '/']) {
    const parts = keyword.split(new RegExp(`[_\\-.:/]`)).filter(Boolean)
    if (parts.length > 1) {
      variants.add(parts.join(sep))
    }
  }

  return [...variants]
}

function applyFrameworkPatterns(keyword, frameworkData, frameworks) {
  const results = []
  if (!frameworkData || !frameworks) return results

  for (const fwId of frameworks) {
    const fw = frameworkData[fwId]
    if (!fw) continue
    for (const pattern of fw.patterns) {
      results.push(pattern.replace('{value}', keyword))
    }
  }
  return results
}

function applyFileExtensions(keyword, extensions) {
  const results = []
  for (const ext of extensions) {
    const cleanExt = ext.startsWith('.') ? ext.slice(1) : ext
    results.push(`${keyword} ext:${cleanExt}`)
    results.push(`${keyword} filetype:${cleanExt}`)
    results.push(`"${keyword}" ${ext}`)
  }
  return results
}

function applyQuoteWrapping(keyword) {
  const results = new Set()
  if (keyword.includes(' ') || keyword.includes('_') || keyword.includes('-')) {
    results.add(`"${keyword}"`)
  }
  results.add(keyword)
  return [...results]
}

export function runMutations(variants, category, config) {
  if (!variants || variants.length === 0) return []

  const { mutations = [], mutationConfigs = {}, maxOutput = 25, frameworkData } = config || {}

  const enabled = new Set(mutations)
  const results = new Set()

  for (const variant of variants) {
    for (const qv of applyQuoteWrapping(variant)) {
      results.add(qv)
    }

    if (enabled.has('case_mutation')) {
      for (const cv of applyCaseMutations(variant)) {
        results.add(cv)
        if (cv.includes('_') || cv.includes('-') || cv.match(/[a-z][A-Z]/)) {
          results.add(`"${cv}"`)
        }
      }
    }

    if (enabled.has('separator_mutation') && (variant.includes('_') || variant.includes('-') || variant.includes('.'))) {
      const seps = mutationConfigs?.separator_mutation?.separators || ['_', '-', '.', '', ':', '/']
      for (const sv of applySeparatorMutations(variant, seps)) {
        if (sv !== variant) {
          results.add(sv)
          results.add(`"${sv}"`)
        }
      }
    }

    if (enabled.has('framework_specific')) {
      const frameworks = mutationConfigs?.framework_specific?.frameworks || []
      if (frameworkData && frameworks.length > 0) {
        for (const fwDork of applyFrameworkPatterns(variant, frameworkData, frameworks)) {
          results.add(fwDork)
        }
      }
    }

    if (enabled.has('file_extension')) {
      const exts = mutationConfigs?.file_extension?.extensions || ['.env', '.config', '.json']
      for (const extDork of applyFileExtensions(variant, exts)) {
        results.add(extDork)
      }
    }
  }

  const arr = [...results]
  if (arr.length > maxOutput) {
    return arr.slice(0, maxOutput)
  }
  return arr
}
