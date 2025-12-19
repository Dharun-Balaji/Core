import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, AlignLeft, Flag } from 'lucide-react';
import type { Task, Priority } from '../store/boardSlice';

interface TaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskId: string, updates: Partial<Task>) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, isOpen, onClose, onSave }) => {
  const [content, setContent] = useState(task.content);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState<Priority>(task.priority || 'medium');
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');

  useEffect(() => {
    if (isOpen) {
      setContent(task.content);
      setDescription(task.description || '');
      setPriority(task.priority || 'medium');
      setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
    }
  }, [isOpen, task]);

  const handleSave = () => {
    onSave(task.id, {
      content,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="modal-title-input"
            placeholder="Task Title"
          />
          <button onClick={onClose} className="icon-btn">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">
              <AlignLeft size={16} /> Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a more detailed description..."
              rows={5}
              className="modal-textarea"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                <Flag size={16} /> Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="modal-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar size={16} /> Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="modal-date"
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={handleSave} className="save-btn">
            Save Changes
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
