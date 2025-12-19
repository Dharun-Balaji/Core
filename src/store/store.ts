import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './boardSlice';

export const store = configureStore({
    reducer: {
        board: boardReducer,
    },
});

store.subscribe(() => {
    localStorage.setItem('core-state', JSON.stringify(store.getState().board));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
