import TemplateDropdown from './TemplateDropdown.jsx'
import StrategyStep from './StrategyStep.jsx'

function RecipePane({
  mutations,
  enabledMutationIds,
  onMutationToggle,
  mutationConfigs,
  onMutationConfigChange,
  templates,
  onTemplateSelect,
  selectedTemplate,
}) {
  const activeCount = enabledMutationIds.length
  const totalCount = mutations.length
  const maxVariants = mutationConfigs['synonym_expansion']?.max_variants || 50

  return (
    <div className="p-2 h-full flex flex-col gap-1">
      <div className="text-[11px] mb-1 text-muted font-sans">
        TEMPLATES
      </div>
      <TemplateDropdown
        templates={templates}
        onTemplateSelect={onTemplateSelect}
        selectedTemplate={selectedTemplate}
      />

      <div className="mt-1 border-t border-border pt-1">
        <div className="text-[11px] mb-1 text-muted font-sans">
          MUTATION STRATEGIES
        </div>

        <div className="flex-1 overflow-y-auto max-h-[calc(100%-2rem)]">
          {mutations.map(mut => (
            <StrategyStep
              key={mut.id}
              mutation={mut}
              isEnabled={enabledMutationIds.includes(mut.id)}
              onToggle={onMutationToggle}
              config={mutationConfigs[mut.id]}
              onConfigChange={onMutationConfigChange}
            />
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-1 text-[10px] text-muted font-sans text-right">
        {activeCount} of {totalCount} strategies active | ~{maxVariants} variants max
      </div>
    </div>
  )
}

export default RecipePane
