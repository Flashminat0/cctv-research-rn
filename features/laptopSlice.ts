import {createSlice} from "@reduxjs/toolkit";

export const laptopSlice = createSlice({
    name: "laptop",
    initialState: {
        isLaptop: false,
        imageBase64: "",
        boundUserEmail: "",
        timestamp: 0
    },
    reducers: {
        setLaptop: (state, action) => {
            state.isLaptop = action.payload.isLaptop;
            state.imageBase64 = action.payload.imageBase64;
            state.boundUserEmail = action.payload.boundUserEmail;
            state.timestamp = action.payload.timestamp;
        },
        clearLaptop: (state) => {
            state.isLaptop = false;
            state.imageBase64 = "";
            state.boundUserEmail = "";
            state.timestamp = 0;
        }
    }
})

export const {
    clearLaptop,
    setLaptop
} = laptopSlice.actions;

export default laptopSlice.reducer;