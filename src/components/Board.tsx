import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { RootState } from '../store/store';
import { 
    moveTask, 
    addTask, 
    deleteTask, 
    updateTask, 
    updateTaskDetails,
    deleteColumn,
    updateColumnTitle
} from '../store/boardSlice';
import { Column } from './Column';
import { TaskCard } from './TaskCard';
import { createPortal } from 'react-dom';

export const Board: React.FC = () => {
  const dispatch = useDispatch();
  const { columns, tasks } = useSelector((state: RootState) => state.board);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5,
        }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the columns
    const activeColumnId = columns.find((col) => col.taskIds.includes(activeId))?.id;
    const overColumnId =
      columns.find((col) => col.taskIds.includes(overId))?.id ||
      (columns.find((col) => col.id === overId)?.id);

    if (!activeColumnId || !overColumnId || activeColumnId === overColumnId) return;

    // We only handle cross-column drag over here for visual feedback if needed,
    // but the actual state change happens in dragEnd usually for simple lists.
    // However, for smoother experience, we might want to update state on drag over.
    // For now, let's stick to dragEnd for simplicity and robustness, or implement
    // optimistic updates if needed.
    // Actually, dnd-kit examples often update on dragOver for inter-container sorting.
    
    // Let's implement optimistic update on dragOver for smoother feel
    const activeTask = tasks[activeId];
    if (activeTask) {
        // Calculate new index
        const overColumn = columns.find(c => c.id === overColumnId);
        const overIndex = overColumn?.taskIds.indexOf(overId);
        
        // Dispatch move action
        dispatch(moveTask({
            activeId,
            overId,
            activeColumnId,
            overColumnId,
            newIndex: overIndex !== undefined && overIndex >= 0 ? overIndex : undefined
        }));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumnId = columns.find((col) => col.taskIds.includes(activeId))?.id;
    const overColumnId =
      columns.find((col) => col.taskIds.includes(overId))?.id ||
      (columns.find((col) => col.id === overId)?.id);

    if (!activeColumnId || !overColumnId) return;

    if (activeColumnId !== overColumnId || activeId !== overId) {
        const overColumn = columns.find(c => c.id === overColumnId);
        const overIndex = overColumn?.taskIds.indexOf(overId);
        
        dispatch(moveTask({
            activeId,
            overId,
            activeColumnId,
            overColumnId,
            newIndex: overIndex !== undefined && overIndex >= 0 ? overIndex : undefined
        }));
    }
  };

  const activeTask = activeId ? tasks[activeId] : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="board-container">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            tasks={column.taskIds.map((id) => tasks[id]).filter(Boolean)}
            addTask={(colId, content) => dispatch(addTask({ columnId: colId, content }))}
            deleteTask={(taskId) => dispatch(deleteTask({ taskId, columnId: column.id }))}
            updateTask={(taskId, content) => dispatch(updateTask({ taskId, content }))}
            updateTaskDetails={(taskId, updates) => dispatch(updateTaskDetails({ taskId, updates }))}
            deleteColumn={(colId) => dispatch(deleteColumn(colId))}
            updateColumnTitle={(colId, title) => dispatch(updateColumnTitle({ columnId: colId, title }))}
          />
        ))}
      </div>

      {createPortal(
        <DragOverlay>
          {activeTask ? (
            <TaskCard
                task={activeTask}
                columnId="" // Not needed for overlay
                deleteTask={() => {}}
                updateTask={() => {}}
                updateTaskDetails={() => {}}
            />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};
