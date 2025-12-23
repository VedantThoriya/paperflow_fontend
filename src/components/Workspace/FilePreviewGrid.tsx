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
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, RotateCw } from "lucide-react";
import { useJobStore } from "@/store/useJobStore";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import lockedFileIcon from "@/assets/locked-file.svg";

interface SortableFileCardProps {
  file: any;
  removeFile: (id: string) => void;
  isFocusMode: boolean;
  isUnlockTool?: boolean;
}

const SortableFileCard = ({
  file,
  removeFile,
  isFocusMode,
  isUnlockTool,
}: SortableFileCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  // Card Content (Extracted for reuse in Overlay if needed, but for now inline)
  const CardContent = (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3 flex flex-col hover:shadow-md transition-shadow relative group ${
        isFocusMode ? "w-[220px] h-[280px]" : "w-[180px] h-[240px]"
      }`}
    >
      {/* Tooltip (Hover) - Only show if not dragging */}
      {!isDragging && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#33333b] text-white text-xs py-1.5 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[5px] after:border-transparent after:border-t-[#33333b] font-bold">
          {isUnlockTool
            ? "Password required"
            : `${(file.file.size / (1024 * 1024)).toFixed(2)} MB - 1 page`}
        </div>
      )}

      <div className="flex-1 bg-gray-50 rounded overflow-hidden relative flex items-center justify-center mb-3">
        {file.previewUrl ? (
          <img
            src={file.previewUrl}
            alt={file.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="animate-pulse w-full h-full bg-gray-100"></div>
        )}

        {/* Action Buttons (Top Right) */}
        {!isDragging && (
          <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-all">
            <button
              className="w-8 h-8 bg-white rounded-full text-[#555] hover:bg-[#e5322d] hover:text-white shadow-md flex items-center justify-center transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Rotation logic would go here
              }}
              onPointerDown={(e) => e.stopPropagation()}
              title="Rotate"
            >
              <RotateCw size={14} strokeWidth={2.5} />
            </button>

            <button
              className="w-8 h-8 bg-white rounded-full text-[#555] hover:bg-[#e5322d] hover:text-white shadow-md flex items-center justify-center transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                removeFile(file.id);
              }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <X size={14} strokeWidth={2.5} />
              {isFocusMode && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#33333b] text-white text-xs py-1.5 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[5px] after:border-transparent after:border-t-[#33333b]">
                  Remove file
                </div>
              )}
            </button>
          </div>
        )}
      </div>
      <p
        className="text-xs font-medium text-gray-700 truncate text-center"
        title={file.name}
      >
        {file.name}
      </p>
    </div>
  );

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {CardContent}
    </div>
  );
};

export const FilePreviewGrid = ({
  enableDnD,
  showAddMore = true,
}: {
  enableDnD?: boolean;
  showAddMore?: boolean;
}) => {
  const { files, removeFile, addFiles, reorderFiles } = useJobStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const location = useLocation();
  const isUnlockTool = location.pathname === "/unlock";

  const isFocusMode = files.length === 1;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts (prevents accidental clicks)
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = files.findIndex((f) => f.id === active.id);
      const newIndex = files.findIndex((f) => f.id === over.id);
      reorderFiles(oldIndex, newIndex);
    }
    setActiveId(null);
  };

  const renderContent = () => {
    if (isFocusMode) {
      // Focus Mode (1 file)
      // If enableDnD is true (e.g. Merge), we make it draggable even if it doesn't move anywhere,
      // just to satisfy "always draggable".
      // But reordering effectively does nothing.
      return (
        <div className="w-full h-full flex items-center justify-center -mt-12">
          {enableDnD ? (
            <SortableContext
              items={files.map((f) => f.id)}
              strategy={rectSortingStrategy}
            >
              <SortableFileCard
                file={files[0]}
                removeFile={removeFile}
                isFocusMode={true}
                isUnlockTool={isUnlockTool}
              />
            </SortableContext>
          ) : (
            // Non-draggable version (using same SortableCard but without wrapper? Or separate?)
            // We can just use SortableCard assuming context handles it or just duplicate simple structure.
            // Simpler to reuse structure but stripped of dnd hooks.
            // For simplicity, I'll inline the non-dnd structure to avoid hook calls outside context error.
            <div className="relative group">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 w-[220px] h-[280px] flex flex-col hover:shadow-md transition-shadow relative">
                {/* Same internals... */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#33333b] text-white text-xs py-1.5 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[5px] after:border-transparent after:border-t-[#33333b] font-bold">
                  {isUnlockTool
                    ? "Password required"
                    : `${(files[0].file.size / (1024 * 1024)).toFixed(
                        2
                      )} MB - 1 page`}
                </div>
                <div className="flex-1 bg-gray-50 rounded overflow-hidden relative flex items-center justify-center mb-3">
                  {isUnlockTool ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4">
                      <img
                        src={lockedFileIcon}
                        alt="Locked"
                        className="w-16 h-16 mb-2 opacity-80"
                      />
                      {/* Optional dots or text if needed */}
                    </div>
                  ) : files[0].previewUrl ? (
                    <img
                      src={files[0].previewUrl}
                      alt={files[0].name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="animate-pulse w-full h-full bg-gray-100"></div>
                  )}
                  <button
                    className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full text-[#555] hover:bg-[#e5322d] hover:text-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
                    onClick={() => removeFile(files[0].id)}
                  >
                    <X size={14} strokeWidth={2.5} />
                  </button>
                </div>
                <p
                  className="text-xs font-medium text-gray-700 truncate text-center"
                  title={files[0].name}
                >
                  {files[0].name}
                </p>
              </div>
            </div>
          )}
        </div>
      );
    } else {
      // Grid Mode (Multiple files)
      const content = files.map((file) => (
        <SortableFileCard
          key={file.id}
          file={file}
          removeFile={removeFile}
          isFocusMode={false}
          isUnlockTool={isUnlockTool}
        />
      ));

      return (
        <div className="flex flex-wrap justify-center gap-6 pb-12">
          {enableDnD ? (
            <SortableContext
              items={files.map((f) => f.id)}
              strategy={rectSortingStrategy}
            >
              {content}
            </SortableContext>
          ) : (
            // Non-Sortable Fallback (we can reuse SortableFileCard but it expects context.
            // Better to have a unified Card component that accepts 'draggable' prop?
            // Or just map to a simple div structure if !enableDnD.
            files.map((file) => (
              <div
                key={file.id}
                className="group relative bg-white rounded-lg shadow-sm border border-gray-200 p-2 w-[180px] h-[240px] hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#33333b] text-white text-xs py-1.5 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-[5px] after:border-transparent after:border-t-[#33333b]">
                  {(file.file.size / (1024 * 1024)).toFixed(2)} MB - 1 page
                </div>
                <div className="flex-1 bg-gray-50 relative flex items-center justify-center overflow-hidden rounded mb-2">
                  {file.previewUrl ? (
                    <img
                      src={file.previewUrl}
                      alt={file.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="animate-pulse w-full h-full bg-gray-100"></div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      className="w-6 h-6 bg-white rounded-full text-[#555] hover:bg-[#e5322d] hover:text-white shadow-md flex items-center justify-center transition-colors"
                      onClick={(e) => e.preventDefault()}
                    >
                      <RotateCw size={12} strokeWidth={2.5} />
                    </button>
                    <button
                      className="w-6 h-6 bg-white rounded-full text-[#555] hover:bg-[#e5322d] hover:text-white shadow-md flex items-center justify-center transition-colors"
                      onClick={() => removeFile(file.id)}
                    >
                      <X size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
                <p className="text-[11px] font-medium text-gray-700 truncate text-center px-1">
                  {file.name}
                </p>
              </div>
            ))
          )}
        </div>
      );
    }
  };

  return (
    <div className="relative w-full h-full min-h-0 pt-12">
      {/* Add Button */}
      {showAddMore && (
        <div className="absolute top-0 -right-10 z-20">
          <label className="flex items-center justify-center w-[42px] h-[42px] bg-[#e5322d] hover:bg-[#d6201b] text-white rounded-full shadow-lg cursor-pointer transition-transform hover:scale-105 relative">
            <input
              type="file"
              multiple
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0)
                  addFiles(Array.from(e.target.files));
                e.target.value = "";
              }}
            />
            <span className="text-4xl font-light pb-2 leading-none">+</span>
            <div className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#f3f3f5]">
              {files.length}
            </div>
          </label>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        // If not enabled, we effectively disable dragging by not providing sensors or context around items?
        // Actually, if !enableDnD, we just render static content. context is only needed for dnd.
      >
        {renderContent()}
        <DragOverlay>
          {activeId ? (
            <div className="bg-white rounded-lg shadow-xl border-2 border-[#e5322d] p-2 w-[180px] h-[240px] flex flex-col opacity-90 cursor-grabbing">
              {/* Minimal overlay content */}
              {(() => {
                const f = files.find((f) => f.id === activeId);
                if (!f) return null;
                return (
                  <>
                    <div className="flex-1 bg-gray-50 flex items-center justify-center">
                      <img
                        src={f.previewUrl || ""}
                        className="w-full h-full object-contain p-2"
                      />
                    </div>
                  </>
                );
              })()}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
