import { useState } from 'react'

function CategoryList({ categories, selectedCategoryId, onCategorySelect }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = searchQuery.trim()
    ? categories.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories

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
        {filtered.map(cat => (
          <div
            key={cat.id}
            onClick={() => onCategorySelect(cat.id)}
            className={`px-1.5 py-1 cursor-pointer text-xs font-sans border-b border-[#2a2a2a] ${
              cat.id === selectedCategoryId
                ? 'bg-success/15 text-success'
                : 'bg-transparent text-[#ccc]'
            }`}
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
