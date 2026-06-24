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
}) {
  return (
    <div className="p-2 h-full flex flex-col gap-1">
      <TemplateDropdown
        templates={templates}
        onTemplateSelect={onTemplateSelect}
      />

      <div className="text-[11px] text-muted font-sans">
        MUTATION STRATEGIES
      </div>

      <div className="flex-1 overflow-y-auto">
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
  )
}

export default RecipePane
