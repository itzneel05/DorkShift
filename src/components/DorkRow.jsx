import { useState } from 'react'

function DorkRow({ dork, launchUrl }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(dork)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  const handleLaunch = () => {
    if (launchUrl) window.open(launchUrl, '_blank', 'noopener')
  }

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 border-b border-[#1a1a1a] text-xs">
      <span
        className="flex-1 font-mono text-xs text-[#ddd] truncate"
        title={dork}
      >
        {dork}
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
