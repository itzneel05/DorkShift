import { useState } from 'react'

const OP_COLORS = {
  native: 'text-accent',
  relay: 'text-warning',
  bare: 'text-muted',
  none: 'text-muted',
}

function DorkRow({ dork, rawDork, launchUrl, operatorType }) {
  const [copied, setCopied] = useState(false)

  const copyText = rawDork || dork
  const opColor = OP_COLORS[operatorType] || 'text-muted'

  let operatorPart = ''
  let bodyPart = dork
  if ((operatorType === 'native' || operatorType === 'relay') && rawDork && dork.endsWith(rawDork)) {
    const splitAt = dork.length - rawDork.length
    operatorPart = dork.slice(0, splitAt)
    bodyPart = dork.slice(splitAt)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  const handleLaunch = () => {
    if (launchUrl) window.open(launchUrl, '_blank', 'noopener')
  }

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 border-b border-[#1a1a1a] text-xs">
      <span className="flex-1 font-mono text-xs leading-snug overflow-hidden" title={dork}>
        <span className={opColor}>{operatorPart}</span>
        <span className="text-text">{bodyPart}</span>
      </span>
      <button
        onClick={handleCopy}
        title="Copy"
        className={`bg-transparent border border-border cursor-pointer px-1.5 py-0.5 text-[11px] font-sans shrink-0 ${
          copied ? 'text-success' : 'text-muted'
        }`}
      >
        {copied ? 'OK' : 'COPY'}
      </button>
      <button
        onClick={handleLaunch}
        title="Open search URL"
        className={`bg-transparent border border-border px-1.5 py-0.5 text-[11px] font-sans shrink-0 ${
          launchUrl ? 'text-muted cursor-pointer' : 'cursor-not-allowed'
        }`}
        disabled={!launchUrl}
      >
        &#8599;
      </button>
    </div>
  )
}

export default DorkRow
