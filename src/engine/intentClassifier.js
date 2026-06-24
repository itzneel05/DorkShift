export function classifyIntent(parsedToken, categories) {
  if (!parsedToken || !parsedToken.tokens || parsedToken.tokens.length === 0) {
    return { category: null, confidence: 0, matchedKeywords: [] }
  }

  const inputText = parsedToken.raw.toLowerCase()
  const results = []

  for (const cat of categories) {
    const matchedKeywords = []
    for (const keyword of cat.keywords) {
      if (inputText.includes(keyword.toLowerCase())) {
        matchedKeywords.push(keyword)
      }
    }

    if (matchedKeywords.length > 0) {
      const matchRatio = matchedKeywords.length / cat.keywords.length
      const tokenCount = parsedToken.tokens.length
      const densityBoost = Math.min(tokenCount / 8, 1) * 0.15
      const confidence = Math.min(Math.round((matchRatio + densityBoost) * 100) / 100, 1)

      results.push({ category: cat, confidence, matchedKeywords })
    }
  }

  if (results.length === 0) {
    return { category: null, confidence: 0, matchedKeywords: [] }
  }

  results.sort((a, b) => b.confidence - a.confidence)
  return results[0]
}
