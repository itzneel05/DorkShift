export function scoreDork(dork, category) {
  if (!dork || !category || !category.keywords) return 0

  const lowerDork = dork.toLowerCase()
  let matchCount = 0

  for (const keyword of category.keywords) {
    if (lowerDork.includes(keyword.toLowerCase())) {
      matchCount++
    }
  }

  if (matchCount === 0) return 0

  const density = matchCount / category.keywords.length
  const lengthPenalty = Math.min(dork.length / 200, 1) * 0.3
  let score = density * (1 - lengthPenalty)

  if (dork.includes('"')) score += 0.05
  if (category.severity === 'critical') score += 0.1
  if (category.severity === 'high') score += 0.05

  return Math.min(Math.round(score * 100) / 100, 1)
}
