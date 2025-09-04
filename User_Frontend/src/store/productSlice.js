import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API } from "../http";

const API_URL = import.meta.env.API_URL || 'http://localhost:3000';
const STATUSES = Object.freeze({
      SUCCESS: "success",
      ERROR: "error",
      LOADING: "loading"
})

const productSlice = createSlice({
  name: "product",
  initialState: {
      data: [],
      state: STATUSES.SUCCESS,
      selectedProduct: {}
  },
  reducers: {
      setProducts: (state, action) => {
          state.data = action.payload;
      },
      setStatus: (state, action) => {
          state.status = action.payload;
      },
      setSelectedProduct: (state, action) => {
          state.selectedProduct = action.payload;
      },
    },
    extraReducers : (builder) => {
        builder
        .addCase(fetchProducts.pending, (state)=>{
            state.status = STATUSES.LOADING
        })
        .addCase(fetchProducts.fulfilled,(state, action)=>{
            state.data = action.payload;
            state.status = STATUSES.SUCCESS;
        })
        .addCase(fetchProducts.rejected, (state)=>{
            state.status = STATUSES.ERROR;
        })
    },
});

export const { setProducts, setStatus, setSelectedProduct } = productSlice.actions
export default productSlice.reducer

 // *Fetch products methods 1:

// export const fetchProducts = createAsyncThunk("products/fetch", async() => {
//     try {
//         const response = await axios.get(`${API_URL}/admin/products`);
//         const data = response.data.data
//         return data
//     } catch (error) {
//       console.log("Failed to fetch products:", error);
//     }
// });

// **OR

export const fetchProducts = createAsyncThunk("products/fetch", async() => {
    try {
        const response = await API.get('/admin/products')
        const data = response.data.data
        return data
    } catch (error) {
      console.log("Failed to fetch products:", error);
    }
});


 // *Fetch products methods 2:

// export function fetchProducts(){
//       return async function fetchProductThunk(dispatch) {
//         dispatch(setStatus(STATUSES.LOADING));
//         try {
//             const response = await axios.get(`${API_URL}/admin/products`);
//             dispatch(setProducts(response.data.data));
//             dispatch(setStatus(STATUSES.SUCCESS));
//         } catch (error) {
//             console.log("Failed to fetch products:", error);
//             dispatch(setStatus(STATUSES.ERROR));
//         }
//       }
// }


// Fetch Single product
export function fetchSingleProduct(productId){
      return async function fetchSingleProductThunk(dispatch) {
        dispatch(setStatus(STATUSES.LOADING));
        try {
            const response = await API.get(`/admin/products/${productId}`);
            dispatch(setSelectedProduct(response.data.data));
            dispatch(setStatus(STATUSES.SUCCESS));
        } catch (error) {
            console.log("Failed to fetch product:", error);
            dispatch(setStatus(STATUSES.ERROR));
        }
      }
}




