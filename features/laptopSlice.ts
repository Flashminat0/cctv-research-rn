import {createSlice} from "@reduxjs/toolkit";

export const laptopSlice = createSlice({
    name: "laptop",
    initialState: {
        isLaptop: false,
        imageBase64: "",
        boundUserEmail: "",
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
        setLaptop: (state, action) => {
            state.isLaptop = action.payload.isLaptop;
            state.imageBase64 = action.payload.imageBase64;
            state.boundUserEmail = action.payload.boundUserEmail;
        }
    }
})

export const {setImageBase64, setBoundUserEmail, setLaptop , setIsLaptop} = laptopSlice.actions;

export default laptopSlice.reducer;