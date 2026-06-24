function TemplateDropdown({ templates, onTemplateSelect }) {
  return (
    <div className="mb-2">
      <div className="text-[11px] mb-1 text-muted font-sans">
        TEMPLATE GALLERY
      </div>
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
    </div>
  )
}

export default TemplateDropdown
