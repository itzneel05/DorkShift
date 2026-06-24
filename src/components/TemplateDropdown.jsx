import { useState } from 'react'

function TemplateDropdown({ templates, onTemplateSelect, selectedTemplate }) {
  const [preview, setPreview] = useState(null)

  return (
    <div className="mb-2">
      <select
        onChange={e => {
          const tpl = templates.find(t => t.id === e.target.value)
          if (tpl) onTemplateSelect(tpl)
          e.target.value = ''
        }}
        defaultValue=""
        className="w-full px-1.5 py-1 text-xs font-sans bg-surface text-text border border-border outline-none box-border"
      >
        <option value="" disabled>Load a template...</option>
        {templates.map(t => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>

      <div
        className="mt-1"
        onMouseEnter={() => setPreview(true)}
        onMouseLeave={() => setPreview(false)}
      >
        {preview && (
          <div className="text-[10px] text-muted font-sans leading-relaxed p-1 border border-border bg-surface">
            {templates.slice(0, 3).map(t => (
              <div key={t.id} className="truncate" title={`${t.name}: ${t.description}`}>
                {t.name} &mdash; {t.description}
              </div>
            ))}
            {templates.length > 3 && (
              <div className="text-muted italic">+{templates.length - 3} more</div>
            )}
          </div>
        )}
      </div>

      {selectedTemplate && (
        <div className="mt-1 text-[10px] text-muted font-sans">
          Active: {selectedTemplate.name}
          <span
            className="ml-1 text-accent cursor-pointer"
            onClick={() => onTemplateSelect(null)}
          >
            (reset to manual)
          </span>
        </div>
      )}
    </div>
  )
}

export default TemplateDropdown
