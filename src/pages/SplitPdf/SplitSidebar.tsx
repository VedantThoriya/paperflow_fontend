import { Plus, Trash, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface SplitRange {
  id: string;
  from: number;
  to: number;
}

export interface SplitOptions {
  mode: "custom" | "fixed";
  ranges: SplitRange[];
  fixedRange: number;
  mergeOutput: boolean;
}

interface SplitSidebarProps {
  options: SplitOptions;
  setOptions: (options: SplitOptions) => (prop: any) => void;
  // Note: usage setOptions(prev => ...) implies functional update support.
  // The interface in SplitPdf.tsx was SetStateAction<SplitOptions>.
  // I'll define it broadly or match exact needed signature.
  // setOptions: React.Dispatch<React.SetStateAction<SplitOptions>>;
  // But importing React types might be verbose.
  // Let's use `(options: SplitOptions | ((prev: SplitOptions) => SplitOptions)) => void;`
  // Actually, standard setState handling:
}

// Updating Props interface to match likely SetState usage
// Or just keep it compatible with what was working.
// Previously: setOptions: (options: SplitOptions) => void;
// But I want to use functional updates in my fix.
// I will check SplitPdf.tsx usage. Step 611 shows `const [options, setOptions] = useState...`
// So it is React.Dispatch<React.SetStateAction<SplitOptions>>.

// CSS for hiding spinners
const spinnerStyle = `
  input[type=number]::-webkit-inner-spin-button, 
  input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
    margin: 0; 
  }
  input[type=number] {
    -moz-appearance: textfield;
  }
`;

// Sortable Item Component
const SortableRangeItem = ({
  range,
  index,
  updateRange,
  removeRange,
  totalPages,
  isDraggable,
  setHoveredRangeId,
}: {
  range: SplitRange;
  index: number;
  updateRange: (index: number, field: "from" | "to", value: number) => void;
  removeRange: (index: number) => void;
  totalPages: number;
  isDraggable: boolean;
  setHoveredRangeId: (id: string | null) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: range.id, disabled: !isDraggable });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    position: "relative" as const,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onMouseEnter={() => setHoveredRangeId(range.id)}
      onMouseLeave={() => setHoveredRangeId(null)}
      className={`flex flex-col gap-3 bg-white px-2 py-4 rounded transition-colors border border-transparent ${
        isDragging ? "shadow-lg z-10 border-red-500" : "hover:bg-[#f8fafe]"
      }`}
    >
      {/* Header Row: Grip + Range Tag */}
      <div className="flex justify-between items-center mb-0">
        {" "}
        {/* Adjusted margin */}
        <div className="flex items-center gap-2">
          {" "}
          {/* Checked gap */}
          {/* Drag Handle */}
          <span
            {...attributes}
            {...listeners}
            className={`outline-none flex items-center justify-center w-5 ${
              isDraggable
                ? "cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-700"
                : "cursor-default text-gray-500"
            }`}
          >
            <GripVertical size={16} />
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[#383E45]">Range</span>{" "}
            {/* Updated font size/weight */}
            <span className="bg-[#EBEBEB] text-[#383E45] font-semibold rounded px-1.5 py-0.5 text-xs">
              {index + 1}
            </span>
          </div>
        </div>
        {/* Delete Button (Hidden for index 0) */}
        {index > 0 && (
          <button
            onClick={() => removeRange(index)}
            className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-red-500 transition-colors"
            title="Delete range"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <Trash size={16} />
          </button>
        )}
      </div>

      {/* Inputs Row */}
      <div className="flex items-center gap-4 pl-0 mt-3 relative">
        {" "}
        {/* removed pl-8 to match alignment if needed, or keep pl-0 relative to something? Image 2 shows Inputs below Range 1. Range 1 and inputs seem left aligned? No, inputs are indented? */}
        {/* Actually looking at Image 2: "Range 1" is above. Inputs are below. Inputs seem to align with "Range 1"? or indented? */}
        {/* Image 2: "Range 1" is left aligned. Inputs are left aligned with it. */}
        {/* My code had `pl-8` (32px). `Range` header was `px-2`. */}
        {/* If I remove `pl-8`, the inputs will align with the header. */}
        {/* Let's try `pl-0` or `pl-1` to align with the text. */}
        {/* From Input */}
        <div className="flex-1 border border-gray-400 rounded flex items-center overflow-hidden h-[42px] hover:border-gray-500 transition-colors bg-white">
          <span className="px-3 text-[#333] text-sm bg-white h-full flex items-center border-r border-gray-300 select-none font-normal">
            from
          </span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={range.from}
            onChange={(e) =>
              updateRange(index, "from", parseInt(e.target.value) || 1)
            }
            onPointerDown={(e) => e.stopPropagation()}
            className="w-full h-full px-2 outline-none text-center font-normal text-[#333] bg-white text-base"
          />
          <div className="flex flex-col border-l border-gray-300 h-full w-6">
            <button
              className="flex-1 flex items-center justify-center hover:bg-gray-100 text-[10px] text-gray-600"
              onClick={() =>
                updateRange(index, "from", Math.min(range.from + 1, totalPages))
              }
            >
              ▲
            </button>
            <div className="h-[1px] bg-gray-300 w-full"></div>
            <button
              className="flex-1 flex items-center justify-center hover:bg-gray-100 text-[10px] text-gray-600"
              onClick={() =>
                updateRange(index, "from", Math.max(range.from - 1, 1))
              }
            >
              ▼
            </button>
          </div>
        </div>
        {/* To Input */}
        <div className="flex-1 border border-gray-400 rounded flex items-center overflow-hidden h-[42px] hover:border-gray-500 transition-colors bg-white">
          <span className="px-3 text-[#333] text-sm bg-white h-full flex items-center border-r border-gray-300 select-none font-normal">
            to
          </span>
          <input
            type="number"
            min={range.from}
            max={totalPages}
            value={range.to}
            onChange={(e) =>
              updateRange(index, "to", parseInt(e.target.value) || range.from)
            }
            onPointerDown={(e) => e.stopPropagation()}
            className="w-full h-full px-2 outline-none text-center font-normal text-[#333] bg-white text-base"
          />
          <div className="flex flex-col border-l border-gray-300 h-full w-6">
            <button
              className="flex-1 flex items-center justify-center hover:bg-gray-100 text-[10px] text-gray-600"
              onClick={() =>
                updateRange(index, "to", Math.min(range.to + 1, totalPages))
              }
            >
              ▲
            </button>
            <div className="h-[1px] bg-gray-300 w-full"></div>
            <button
              className="flex-1 flex items-center justify-center hover:bg-gray-100 text-[10px] text-gray-600"
              onClick={() =>
                updateRange(index, "to", Math.max(range.to - 1, 1))
              }
            >
              ▼
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SplitSidebar = ({
  options,
  setOptions,
  totalPages,
  setHoveredRangeId,
}: {
  options: SplitOptions;
  setOptions: (
    value: SplitOptions | ((prev: SplitOptions) => SplitOptions)
  ) => void;
  totalPages: number;
  setHoveredRangeId: (id: string | null) => void;
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleModeChange = (mode: "custom" | "fixed") => {
    setOptions((prev) => ({ ...prev, mode }));
  };

  const addRange = () => {
    // Access latest state implicitly by setOptions functional update if we wanted,
    // but here we rely on 'options' prop being up to date.
    const lastRange = options.ranges[options.ranges.length - 1];
    const newFrom = lastRange ? Math.min(lastRange.to + 1, totalPages) : 1;
    const newTo = totalPages;

    setOptions((prev) => ({
      ...prev,
      ranges: [
        ...prev.ranges,
        { id: crypto.randomUUID(), from: newFrom, to: newTo },
      ],
    }));
  };

  const updateRange = (index: number, field: "from" | "to", value: number) => {
    // Clamp value between 1 and totalPages first
    const clampedValue = Math.max(1, Math.min(value, totalPages));

    setOptions((prev) => {
      const newRanges = [...prev.ranges];
      const currentRange = { ...newRanges[index] };

      if (field === "from") {
        currentRange.from = clampedValue;
        // Validation: If Start > End, push End to match Start
        if (currentRange.to < clampedValue) {
          currentRange.to = clampedValue;
        }
      } else {
        // Validation: End cannot be less than Start
        const finalTo = Math.max(clampedValue, currentRange.from);
        currentRange.to = finalTo;
      }

      newRanges[index] = currentRange;
      return { ...prev, ranges: newRanges };
    });
  };

  const removeRange = (index: number) => {
    setOptions((prev) => ({
      ...prev,
      ranges: prev.ranges.filter((_, i) => i !== index),
    }));
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setOptions((prev) => {
        const oldIndex = prev.ranges.findIndex((r) => r.id === active.id);
        const newIndex = prev.ranges.findIndex((r) => r.id === over.id);
        return {
          ...prev,
          ranges: arrayMove(prev.ranges, oldIndex, newIndex),
        };
      });
    }
    setActiveId(null);
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <style>{spinnerStyle}</style>

      {/* Range Mode Toggle */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3">Range mode:</h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleModeChange("custom")}
            className={`flex-1 py-3 px-4 rounded border font-medium text-sm transition-all ${
              options.mode === "custom"
                ? "bg-red-50 text-red-500 border-red-500"
                : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
            }`}
          >
            Custom ranges
          </button>
          <button
            onClick={() => handleModeChange("fixed")}
            className={`flex-1 py-3 px-4 rounded border font-medium text-sm transition-all ${
              options.mode === "fixed"
                ? "bg-red-50 text-red-500 border-red-500"
                : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
            }`}
          >
            Fixed ranges
          </button>
        </div>
      </div>

      {/* Inputs Section */}
      <div className="flex-1 overflow-y-auto py-2 no-scrollbar px-1">
        {options.mode === "custom" ? (
          <div className="flex flex-col gap-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={options.ranges.map((r) => r.id)}
                strategy={verticalListSortingStrategy}
              >
                {options.ranges.map((range, index) => (
                  <SortableRangeItem
                    key={range.id}
                    range={range}
                    index={index}
                    updateRange={updateRange}
                    removeRange={removeRange}
                    totalPages={totalPages}
                    isDraggable={options.ranges.length > 1}
                    setHoveredRangeId={setHoveredRangeId}
                  />
                ))}
              </SortableContext>
              <DragOverlay>
                {activeId ? (
                  <div className="bg-white p-3 rounded border border-red-500 shadow-xl opacity-90 w-[300px]">
                    <div className="flex items-center gap-2">
                      <GripVertical size={20} className="text-gray-400" />
                      <span className="bg-[#EBEBEB] text-[#383E45] font-semibold rounded px-2 py-0.5 text-sm">
                        {options.ranges.findIndex((r) => r.id === activeId) + 1}
                      </span>
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>

            <button
              onClick={addRange}
              className="mt-2 w-max flex items-center gap-2 text-red-500 font-bold text-sm border border-red-500 rounded px-4 py-2 hover:bg-red-50 transition-colors mx-auto"
            >
              <Plus size={16} />
              Add Range
            </button>

            <div className="mt-4 flex items-center gap-3">
              <input
                type="checkbox"
                id="mergeOutput"
                checked={options.mergeOutput}
                onChange={(e) =>
                  setOptions((prev) => ({
                    ...prev,
                    mergeOutput: e.target.checked,
                  }))
                }
                className="w-5 h-5 text-red-500 rounded border-gray-300 focus:ring-red-500"
              />
              <label
                htmlFor="mergeOutput"
                className="text-gray-600 text-sm select-none"
              >
                Merge all ranges in one PDF file.
              </label>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 justify-between">
              <label className="text-sm font-bold text-gray-700">
                Split into page ranges of:
              </label>
              <div className="flex items-center border border-gray-300 rounded bg-white w-24">
                <input
                  type="number"
                  min={1}
                  value={options.fixedRange}
                  onChange={(e) =>
                    setOptions((prev) => ({
                      ...prev,
                      fixedRange: Math.max(1, parseInt(e.target.value) || 1),
                    }))
                  }
                  className="w-full py-2 px-3 outline-none text-center font-medium text-gray-700 bg-white"
                />
                <div className="flex flex-col border-l border-gray-300">
                  <button
                    className="px-1 text-gray-500 hover:bg-gray-100 text-[10px]"
                    onClick={() =>
                      setOptions((prev) => ({
                        ...prev,
                        fixedRange: prev.fixedRange + 1,
                      }))
                    }
                  >
                    ▲
                  </button>
                  <button
                    className="px-1 text-gray-500 hover:bg-gray-100 text-[10px]"
                    onClick={() =>
                      setOptions((prev) => ({
                        ...prev,
                        fixedRange: Math.max(1, prev.fixedRange - 1),
                      }))
                    }
                  >
                    ▼
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded p-4 text-sm text-gray-700">
              <p>
                This PDF will be split into files of{" "}
                <b>{options.fixedRange} pages</b>.
                <br />
                <b>{Math.ceil(totalPages / options.fixedRange)} PDFs</b> will be
                created.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
