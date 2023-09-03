import {createSlice} from "@reduxjs/toolkit";

export const trackerSlice = createSlice({
    name: "tracker",
    initialState: {
        found: false,
        tracking: false,
        problem: false,
        problemMessage: ""
    },
    reducers: {
        setTracker: (state, action) => {
            state.found = action.payload.found;
            state.tracking = action.payload.tracking;
            state.problem = action.payload.problem;
            state.problemMessage = action.payload.problemMessage;
        },
        clearTracker: (state) => {
            state.found = false;
            state.tracking = false;
            state.problem = false;
            state.problemMessage = "";
        }
    }
})

export const {
    setTracker,
    clearTracker
} = trackerSlice.actions;

export default trackerSlice.reducer;