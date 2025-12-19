import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, MoreHorizontal, Trash2, Edit2 } from 'lucide-react';
import type { Column as ColumnType, Task } from '../store/boardSlice';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  addTask: (columnId: string, content: string) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, content: string) => void;
  updateTaskDetails: (taskId: string, updates: Partial<Task>) => void;
  deleteColumn: (columnId: string) => void;
  updateColumnTitle: (columnId: string, title: string) => void;
}

export const Column: React.FC<ColumnProps> = ({ 
    column, 
    tasks, 
    addTask, 
    deleteTask, 
    updateTask, 
    updateTaskDetails,
    deleteColumn,
    updateColumnTitle
}) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const [newTaskContent, setNewTaskContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleAddTask = () => {
    if (newTaskContent.trim()) {
      addTask(column.id, newTaskContent);
      setNewTaskContent('');
      setIsAdding(false);
    }
  };

  const handleRename = () => {
      const newTitle = prompt('Enter new column title:', column.title);
      if (newTitle) {
          updateColumnTitle(column.id, newTitle);
      }
      setShowMenu(false);
  };

  const handleDelete = () => {
      if (confirm('Are you sure you want to delete this column and all its tasks?')) {
          deleteColumn(column.id);
      }
      setShowMenu(false);
  };

  return (
    <div className="column">
      <div className="column-header" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor:
                column.title === 'To Do'
                  ? 'var(--danger)'
                  : column.title === 'In Progress'
                  ? 'var(--accent-color)'
                  : 'var(--success)',
            }}
          />
          {column.title}
          <span
            style={{
              marginLeft: '8px',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              backgroundColor: 'var(--bg-card)',
              padding: '2px 8px',
              borderRadius: '12px',
            }}
          >
            {tasks.length}
          </span>
        </div>
        <button 
            className="icon-btn" 
            onClick={() => setShowMenu(!showMenu)}
        >
          <MoreHorizontal size={16} />
        </button>

        {showMenu && (
            <div style={{
                position: 'absolute',
                top: '100%',
                right: '1rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                padding: '0.5rem',
                zIndex: 10,
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                minWidth: '120px'
            }}>
                <button 
                    onClick={handleRename}
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        color: 'var(--text-primary)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        textAlign: 'left'
                    }}
                    className="hover:bg-white/5"
                >
                    <Edit2 size={14} /> Rename
                </button>
                <button 
                    onClick={handleDelete}
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        color: 'var(--danger)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        textAlign: 'left'
                    }}
                    className="hover:bg-white/5"
                >
                    <Trash2 size={14} /> Delete
                </button>
            </div>
        )}
      </div>

      <div ref={setNodeRef} className="column-content">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columnId={column.id}
              deleteTask={deleteTask}
              updateTask={updateTask}
              updateTaskDetails={updateTaskDetails}
            />
          ))}
        </SortableContext>
      </div>

      {isAdding ? (
        <div style={{ padding: '0 1rem 1rem' }}>
          <textarea
            autoFocus
            placeholder="Enter task content..."
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddTask();
              }
            }}
            onBlur={() => {
                if (!newTaskContent.trim()) setIsAdding(false);
            }}
            style={{ width: '100%', resize: 'none', minHeight: '60px', marginBottom: '8px' }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleAddTask}
              style={{
                backgroundColor: 'var(--accent-color)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.875rem',
              }}
            >
              Add Card
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="icon-btn"
              style={{ fontSize: '0.875rem', padding: '6px 12px' }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button className="add-task-btn" onClick={() => setIsAdding(true)}>
          <Plus size={16} />
          Add Card
        </button>
      )}
    </div>
  );
};
