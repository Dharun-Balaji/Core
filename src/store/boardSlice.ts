import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
    id: string;
    content: string;
    description?: string;
    priority?: Priority;
    dueDate?: string;
}

export interface Column {
    id: string;
    title: string;
    taskIds: string[];
}

interface BoardState {
    columns: Column[];
    tasks: Record<string, Task>;
}

const loadState = (): BoardState => {
    try {
        const serializedState = localStorage.getItem('kanban-state');
        if (serializedState === null) {
            return {
                columns: [
                    { id: 'col-1', title: 'To Do', taskIds: ['task-1', 'task-2'] },
                    { id: 'col-2', title: 'In Progress', taskIds: ['task-3'] },
                    { id: 'col-3', title: 'Done', taskIds: [] },
                ],
                tasks: {
                    'task-1': { id: 'task-1', content: 'Research competitors', priority: 'high', description: 'Analyze top 3 competitors features.' },
                    'task-2': { id: 'task-2', content: 'Design system draft', priority: 'medium', dueDate: new Date().toISOString() },
                    'task-3': { id: 'task-3', content: 'Setup project repo', priority: 'low' },
                },
            };
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return { columns: [], tasks: {} };
    }
};

const initialState: BoardState = loadState();

const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        addTask: (state, action: PayloadAction<{ columnId: string; content: string }>) => {
            const { columnId, content } = action.payload;
            const newTaskId = uuidv4();
            state.tasks[newTaskId] = { id: newTaskId, content, priority: 'medium' };
            const column = state.columns.find((c) => c.id === columnId);
            if (column) {
                column.taskIds.push(newTaskId);
            }
        },
        moveTask: (
            state,
            action: PayloadAction<{
                activeId: string;
                overId: string;
                activeColumnId: string;
                overColumnId: string;
                newIndex?: number;
            }>
        ) => {
            const { activeId, activeColumnId, overColumnId, newIndex } = action.payload;

            // Find source and destination columns
            const sourceColumn = state.columns.find((c) => c.id === activeColumnId);
            const destColumn = state.columns.find((c) => c.id === overColumnId);

            if (!sourceColumn || !destColumn) return;

            // Remove from source
            sourceColumn.taskIds = sourceColumn.taskIds.filter((id) => id !== activeId);

            // Add to destination
            if (newIndex !== undefined) {
                destColumn.taskIds.splice(newIndex, 0, activeId);
            } else {
                destColumn.taskIds.push(activeId);
            }
        },
        moveColumn: (state, action: PayloadAction<{ activeId: string; overId: string }>) => {
            const { activeId, overId } = action.payload;
            const activeIndex = state.columns.findIndex((c) => c.id === activeId);
            const overIndex = state.columns.findIndex((c) => c.id === overId);

            if (activeIndex !== -1 && overIndex !== -1) {
                const [removed] = state.columns.splice(activeIndex, 1);
                state.columns.splice(overIndex, 0, removed);
            }
        },
        addColumn: (state, action: PayloadAction<string>) => {
            const newColumn: Column = {
                id: uuidv4(),
                title: action.payload,
                taskIds: [],
            };
            state.columns.push(newColumn);
        },
        deleteColumn: (state, action: PayloadAction<string>) => {
            const columnId = action.payload;
            const columnIndex = state.columns.findIndex(c => c.id === columnId);
            if (columnIndex !== -1) {
                const column = state.columns[columnIndex];
                // Remove tasks in this column
                column.taskIds.forEach(taskId => {
                    delete state.tasks[taskId];
                });
                // Remove column
                state.columns.splice(columnIndex, 1);
            }
        },
        updateColumnTitle: (state, action: PayloadAction<{ columnId: string; title: string }>) => {
            const { columnId, title } = action.payload;
            const column = state.columns.find(c => c.id === columnId);
            if (column) {
                column.title = title;
            }
        },
        deleteTask: (state, action: PayloadAction<{ taskId: string; columnId: string }>) => {
            const { taskId, columnId } = action.payload;
            const column = state.columns.find((c) => c.id === columnId);
            if (column) {
                column.taskIds = column.taskIds.filter((id) => id !== taskId);
            }
            delete state.tasks[taskId];
        },
        updateTask: (state, action: PayloadAction<{ taskId: string; content: string }>) => {
            const { taskId, content } = action.payload;
            if (state.tasks[taskId]) {
                state.tasks[taskId].content = content;
            }
        },
        updateTaskDetails: (state, action: PayloadAction<{ taskId: string; updates: Partial<Task> }>) => {
            const { taskId, updates } = action.payload;
            if (state.tasks[taskId]) {
                state.tasks[taskId] = { ...state.tasks[taskId], ...updates };
            }
        }
    },
});

export const {
    addTask,
    moveTask,
    moveColumn,
    addColumn,
    deleteColumn,
    updateColumnTitle,
    deleteTask,
    updateTask,
    updateTaskDetails
} = boardSlice.actions;
export default boardSlice.reducer;
