import {configureStore} from "@reduxjs/toolkit";

import laptopReducer from "./laptopSlice";

const store = configureStore({
    reducer: {
        laptop: laptopReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
