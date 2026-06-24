import { useState } from 'react'

function CategoryList({ categories, selectedCategoryId, onCategorySelect, classifierResult }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = searchQuery.trim()
    ? categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories

  const classifierActive = classifierResult && classifierResult.confidence >= 0.4
  const classifiedId = classifierActive ? classifierResult.category?.id : null

  return (
    <div>
      <div className="text-[11px] mb-1 text-muted font-sans">
        CATEGORIES ({categories.length})
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Filter categories..."
        className="w-full px-1.5 py-1 text-xs font-sans bg-surface text-text border border-border outline-none mb-1 box-border"
      />
      <div className="max-h-[260px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="px-1.5 py-2 text-xs text-muted italic font-sans text-center">
            No categories match your filter
          </div>
        ) : filtered.map(cat => (
          <div
            key={cat.id}
            onClick={() => onCategorySelect(cat.id)}
            className={`px-1.5 py-1 cursor-pointer text-xs font-sans border-b border-[#2a2a2a] ${
              cat.id === selectedCategoryId
                ? 'bg-success/15 text-success'
                : 'bg-transparent text-text'
            } ${classifierActive && cat.id !== classifiedId ? 'opacity-40' : ''}`}
          >
            {cat.name}
            <span
              className={`float-right text-[10px] ${
                cat.severity === 'critical' ? 'text-danger' :
                cat.severity === 'high' ? 'text-warning' :
                'text-muted'
              }`}
            >
              {cat.severity}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryList
