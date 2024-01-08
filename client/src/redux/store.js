//install redux to clientside (npm i @reduxjs/toolkit react-redux)
import {configureStore} from '@reduxjs/toolkit';
import userReducer from './user/userSlice'

export const store = configureStore({
    reducer: { user: userReducer},
    middleware: (getDefaultMiddleware) =>
     getDefaultMiddleware({
        serializableCheck: false,
    }),
});