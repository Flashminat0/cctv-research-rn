import {configureStore} from "@reduxjs/toolkit";

import laptopReducer from "./laptopSlice";
import trackerSlice from "./trackerSlice";

const store = configureStore({
    reducer: {
        laptop: laptopReducer,
        tracker: trackerSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
