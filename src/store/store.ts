import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk'; // Import the redux-thunk package
import menuSlice from './features/menu.slice';
import nowPlayingSlice from './features/nowPlaying.slice';

export const store = configureStore({
  reducer: {
    nowPlaying: nowPlayingSlice,
    menu: menuSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk), // Add thunk middleware
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;