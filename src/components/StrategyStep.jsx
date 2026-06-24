import { useState } from 'react'

function StrategyStep({ mutation, isEnabled, onToggle, config, onConfigChange }) {
  const [expanded, setExpanded] = useState(false)
  const hasConfig = mutation.config_schema && Object.keys(mutation.config_schema).length > 0

  return (
    <div className="border-b border-[#2a2a2a] px-2 py-1.5">
      <div className="flex items-center gap-1.5">
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={() => onToggle(mutation.id)}
          style={{ accentColor: '#00cc66' }}
        />
        <div className="flex-1">
          <div className={`text-xs font-sans ${isEnabled ? 'text-text' : 'text-[#666]'}`}>
            {mutation.name}
          </div>
          <div className="text-[10px] text-[#666] leading-tight font-sans">
            {mutation.description}
          </div>
        </div>
        {hasConfig && (
          <span
            onClick={() => setExpanded(!expanded)}
            className={`cursor-pointer text-sm text-muted select-none inline-block transition-transform duration-100 ${
              expanded ? 'rotate-90' : ''
            }`}
          >
            &#9654;
          </span>
        )}
      </div>

      {expanded && hasConfig && (
        <div className="mt-1 pl-6 text-[11px] font-sans">
          {mutation.id === 'synonym_expansion' && (
            <div className="flex items-center gap-1">
              <span className="text-muted">Max variants:</span>
              <input
                type="number"
                value={config?.max_variants ?? 50}
                onChange={e => onConfigChange(mutation.id, { max_variants: parseInt(e.target.value) || 50 })}
                min={1}
                max={200}
                className="w-[60px] px-1 py-0.5 text-[11px] font-mono bg-surface text-text border border-border outline-none"
              />
            </div>
          )}
          {mutation.id === 'file_extension' && (
            <div className="text-muted">
              Extensions: {(config?.extensions || []).join(', ')}
            </div>
          )}
          {mutation.id === 'framework_specific' && (
            <div className="text-muted">
              Frameworks: {(config?.frameworks || []).join(', ')}
            </div>
          )}
          {mutation.id === 'separator_mutation' && (
            <div className="text-muted">
              Separators: {(config?.separators || []).join(', ')}
            </div>
          )}
          {mutation.id === 'case_mutation' && (
            <div className="text-muted">
              No additional config
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default StrategyStep
