import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Calendar, AlignLeft } from 'lucide-react';
import type { Task } from '../store/boardSlice';
import { TaskModal } from './TaskModal';

interface TaskCardProps {
  task: Task;
  columnId: string;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, content: string) => void;
  updateTaskDetails: (taskId: string, updates: Partial<Task>) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, deleteTask, updateTaskDetails }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="task-card dragging"
      >
        <div style={{ opacity: 0 }}>{task.content}</div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="task-card"
        {...attributes}
        {...listeners}
        onClick={() => setIsModalOpen(true)}
      >
        <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginBottom: '8px' }}>
            {task.content}
        </div>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {task.priority && (
                <span className={`badge badge-${task.priority}`}>
                    {task.priority}
                </span>
            )}
            {task.dueDate && (
                <span className="date-badge">
                    <Calendar size={12} />
                    {new Date(task.dueDate).toLocaleDateString()}
                </span>
            )}
            {task.description && (
                <span className="date-badge" title="Has description">
                    <AlignLeft size={12} />
                </span>
            )}
        </div>

        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            display: 'flex',
            gap: '4px',
          }}
        >
          <button
            onClick={(e) => {
                e.stopPropagation();
                deleteTask(task.id);
            }}
            className="icon-btn delete-btn"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <TaskModal
        task={task}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(taskId, updates) => updateTaskDetails(taskId, updates)}
      />
    </>
  );
};
