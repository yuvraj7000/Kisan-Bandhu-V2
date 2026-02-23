import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    ln : null,
    records : null,
    markets : null,
}

export const listSlice = createSlice({
    name : "options",
    initialState,
    reducers : {
        setLanguage : (state,action)=>{
            state.ln = action.payload
        },
        setRecords : (state,action)=>{
            state.records = action.payload

            console.log('records:', state.records);
        },
        setMarkets: (state,action)=>{
            state.markets = action.payload

            console.log('Unique_markets :', state.markets);
        },
        
    }
})

export const {setLanguage, setMarkets, setRecords } = listSlice.actions;


export default listSlice.reducer;