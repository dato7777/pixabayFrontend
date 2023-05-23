import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCategories, updateSelectedCategory} from './CategoryAPI';

// state-data (initial data)
const initialState = {
    mainInfo: [], //state for storing main results, returned from backend API
    category: '', //category state
    sorting: '', //sorting state
    pageNumber: 1, //page number state
};
//.....................................................
// simple async method(component can call it)
// async (Stage#1)

// This is the start of the first process, where first call to CategoryAPI is made 

//....Asynchronous call to API through CategoryAPI to fetch images based on Category and page number............
export const getCategoriesAsync = createAsyncThunk(
    'categories/getCategories',
    async (_, { getState }) => {
        const { category, pageNumber ,sorting} = getState().categories;
        const response = await getCategories(category.category, pageNumber,sorting);
        return response.data;
    }
);
//......................................................
//...Asynchronous call to API through CategoryAPI to update results based on Selected Category and sorting............
export const updateSelectedCategoryAsync = createAsyncThunk(
    'categories/updateSelectedCategory',
    async ({category,sorting}) => {
        const response = await updateSelectedCategory(category,sorting);
        setPageNumber(0)
        return response.data;
    }
); //....................................................
//...Asynchronous call to API through CategoryAPI to update sorting value and return images based on it
export const imageSortAsync = createAsyncThunk(
    'categories/imageSort',
    async (_, { getState }) => {
        const { category, pageNumber, sorting } = getState().categories;
        const response = await getCategories(category.category, pageNumber, sorting);
        return response.data;
    }
);
//.......................................................
// Main Slicer
export const CategoriesSlice = createSlice({
    name: 'categories',
    initialState,
    // here come simple reducers for synchronous actions, like setting page number and sorting value
    reducers: {
        setPageNumber: (state, action) => {
            state.pageNumber = action.payload;
        },
        setSorting: (state, action) => {
            state.sorting = action.payload;
        }
    },
    //.............
    // After receiving results from the CategoryAPI- callback happens here
    // async (stage#3)
    extraReducers: (builder) => {
        builder
        //updating front after getting results(after async call is fulfilled) from the API
            .addCase(getCategoriesAsync.fulfilled, (state, action) => {
                // retrieving the needed info...
                state.mainInfo = action.payload.data
            }
            )
            .addCase(updateSelectedCategoryAsync.fulfilled, (state, action) => {
                // retrieving the needed info...
                state.category = action.meta.arg;
                
            }
            )
           
    },
});
// export of sync methods only-none
export const { setSorting, setPageNumber, setImageSortByIDStatus } = CategoriesSlice.actions;
// export of any part of the state, we have only one-mainInfo
export const selectmainInfo = (state) => state.categories.mainInfo;//exporting main results state
export const selectPageNumber = (state) => state.categories.pageNumber; //...page number state
export const selectSorting = (state) => state.categories.sorting;//..sorting state
export const selectCateg = (state) => state.categories.category;//..category state

// exporting reducer to the application
export default CategoriesSlice.reducer;