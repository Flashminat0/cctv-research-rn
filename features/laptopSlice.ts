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
        setImageBase64: (state, action) => {
            state.imageBase64 = action.payload;
        },
        setBoundUserEmail: (state, action) => {
            state.boundUserEmail = action.payload;
        },
        setIsLaptop: (state, action) => {
            state.isLaptop = action.payload;
        },
        setTimestamp: (state, action) => {
            state.timestamp = action.payload;
        },
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

export const {setImageBase64, clearLaptop, setBoundUserEmail, setLaptop, setIsLaptop} = laptopSlice.actions;

export default laptopSlice.reducer;