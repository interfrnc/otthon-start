import type { Scenario } from '../types/mortgage';

interface ScenarioTabsProps {
  scenarios: Scenario[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export function ScenarioTabs({
  scenarios,
  activeId,
  onSelect,
  onAdd,
  onRemove,
  onRename,
}: ScenarioTabsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-6">
      {scenarios.map((s) => (
        <div
          key={s.id}
          className={`group flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border-2 transition-all ${
            s.id === activeId
              ? 'border-current shadow-md'
              : 'border-transparent bg-white hover:border-gray-200'
          }`}
          style={{ color: s.color }}
          onClick={() => onSelect(s.id)}
        >
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: s.color }}
          />
          <input
            className="bg-transparent font-medium text-sm w-24 outline-none text-gray-800"
            value={s.name}
            onChange={(e) => onRename(s.id, e.target.value)}
            onFocus={() => onSelect(s.id)}
          />
          {scenarios.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(s.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity text-xs ml-1"
              title="Remove"
            >
              ✕
            </button>
          )}
        </div>
      ))}
      {scenarios.length < 5 && (
        <button
          onClick={onAdd}
          className="px-4 py-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors text-sm"
        >
          + New option
        </button>
      )}
    </div>
  );
}
