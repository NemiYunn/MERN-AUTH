//install redux to clientside (npm i @reduxjs/toolkit react-redux)
import {combineReducers, configureStore} from '@reduxjs/toolkit';
import userReducer from './user/userSlice'
//import persistReducer func
import {persistReducer, persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

//to combine all reducers we creted on userSlice
const rootReducer = combineReducers({user : userReducer});

// define persistConfig
const persistConfig = {
    key : 'root',
    version: 1 ,
    storage, //should import
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

//install redux-persist inorder to store user details even after a refresh instead of using local storage
//install redux-persist to clientside (npm i redux-persist)
export const store = configureStore({
    reducer: persistedReducer, //removed {user: userReducer}
    middleware: (getDefaultMiddleware) =>
     getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export const persistor = persistStore(store);