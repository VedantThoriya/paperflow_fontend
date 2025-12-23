import { type SplitOptions } from "./SplitSidebar";
import { useJobStore } from "@/store/useJobStore";
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
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface SplitMainContentProps {
  options: SplitOptions;
  totalPages: number;
  hoveredRangeId: string | null;
  setOptions: (
    value: SplitOptions | ((prev: SplitOptions) => SplitOptions)
  ) => void;
}

const SortableRangeCard = ({
  range,
  file,
  hoveredRangeId,
  isDraggable,
}: {
  range: any;
  file: any;
  hoveredRangeId: string | null;
  isDraggable: boolean;
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
    opacity: isDragging ? 0.5 : 1,
  };

  const isHovered = hoveredRangeId === range.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex flex-col items-center gap-4 ${
        isDraggable ? "cursor-grab active:cursor-grabbing" : "cursor-default"
      }`}
    >
      <span className="text-[#555] font-normal text-lg">{range.label}</span>
      <div
        className={`relative border border-dashed rounded-lg p-6 transition-colors group min-w-[200px] min-h-[250px] flex items-center justify-center ${
          isHovered
            ? "border-gray-400 bg-gray-50"
            : "border-gray-400 bg-transparent hover:bg-gray-50"
        } ${isDragging ? "border-red-500 bg-red-50" : ""}`}
      >
        <div className="flex items-center gap-3">
          {/* First Page of Range */}
          <div className="bg-white rounded shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 w-36 h-48 flex flex-col items-center p-3 relative hover:shadow-lg transition-shadow">
            <div className="flex-1 w-full bg-white flex items-center justify-center overflow-hidden mb-4">
              {file?.previewUrl ? (
                <img
                  src={file.previewUrl}
                  alt="Page Preview"
                  className="w-full h-full object-contain opacity-90"
                />
              ) : (
                <div className="w-12 h-16 bg-gray-100 border border-gray-200"></div>
              )}
            </div>
            <div className="text-sm font-medium text-gray-700">
              {range.from}
            </div>
          </div>

          {/* If range > 1 page, show ellipses + Last Page */}
          {range.to > range.from && (
            <>
              <span className="text-gray-800 font-bold text-2xl tracking-widest pb-6">
                ...
              </span>
              <div className="bg-white rounded shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 w-36 h-48 flex flex-col items-center p-3 relative hover:shadow-lg transition-shadow">
                <div className="flex-1 w-full bg-white flex items-center justify-center overflow-hidden mb-4">
                  {file?.previewUrl ? (
                    <img
                      src={file.previewUrl}
                      alt="Page Preview"
                      className="w-full h-full object-contain opacity-90"
                    />
                  ) : (
                    <div className="w-12 h-16 bg-gray-100 border border-gray-200"></div>
                  )}
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {range.to}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const SplitMainContent = ({
  options,
  hoveredRangeId,
  setOptions,
  totalPages,
}: SplitMainContentProps) => {
  const { files } = useJobStore();
  const file = files[0];
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getRanges = () => {
    if (options.mode === "custom") {
      return options.ranges.map((r, i) => ({
        id: r.id,
        label: `Range ${i + 1}`,
        from: r.from,
        to: r.to,
        isDraggable: true,
      }));
    } else {
      const ranges = [];
      const count = Math.ceil(totalPages / options.fixedRange);
      for (let i = 0; i < count; i++) {
        const from = i * options.fixedRange + 1;
        const to = Math.min((i + 1) * options.fixedRange, totalPages);
        ranges.push({
          id: `fixed-${i}`,
          label: `Range ${i + 1}`,
          from,
          to,
          isDraggable: false,
        });
      }
      return ranges;
    }
  };

  const ranges = getRanges();
  const isDraggable = options.mode === "custom" && options.ranges.length > 1;

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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-wrap items-start justify-center gap-12 p-8">
        <SortableContext
          items={ranges.map((r) => r.id)}
          strategy={rectSortingStrategy}
        >
          {ranges.map((range) => (
            <SortableRangeCard
              key={range.id}
              range={range}
              file={file}
              hoveredRangeId={hoveredRangeId}
              isDraggable={isDraggable && range.isDraggable}
            />
          ))}
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <div className="opacity-90 scale-105">
              {/* Simplified Overlay Card */}
              <div className="border border-red-500 bg-red-50 rounded-lg p-4 flex items-center justify-center min-w-[200px]">
                <span className="font-bold text-red-500">
                  Range {ranges.findIndex((r) => r.id === activeId) + 1}
                </span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};
