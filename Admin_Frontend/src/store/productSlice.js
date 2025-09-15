import { createSlice } from "@reduxjs/toolkit";
import { STATUSES } from "../global/statuses";
import { APIAuthenticated } from "../http/index";
import { fetchOrders } from "./orderSlice";

const ProductSlice = createSlice({
  name: "product",
  initialState: {
    status: STATUSES.SUCCESS,
    selectedProduct: {},
    products: [],
    orders: [], // to store orders of a specific product
  },
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    deleteProductById: (state, action) => {
      const index = state.products.findIndex(
        (product) => product._id === action.payload.productId
      );
      if (index !== -1) {
        state.products.splice(index, 1);
          }
        },
    updateProductStatusById: (state, action) => {
      const { productId, productStatus } = action.payload;
      const index = state.products.findIndex((product) => product._id === productId);
      if (index !== -1) {
        state.products[index].productStatus = productStatus;
      }
    },
    updateProductStockQtyById: (state, action) => {
      const { productId, productStockQty } = action.payload;
      const index = state.products.findIndex((product) => product._id === productId);
      if (index !== -1) {
        state.products[index].productStockQty = productStockQty;
      }
    },
    addNewProduct: (state, action) => {
      state.products.push(action.payload); 
    },
    setOrdersOfProduct: (state, action) => {
      state.orders = action.payload;
    },
},
})

export const { setStatus, setProducts, setSelectedProduct, deleteProductById, updateProductStatusById, updateProductStockQtyById, addNewProduct, setOrdersOfProduct } = ProductSlice.actions;
export default ProductSlice.reducer;

export function addProduct(formData) {
  return async function addProductThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.post("/admin/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(addNewProduct(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));
      // Optionally, you can fetch the updated list of products here
      dispatch(fetchProducts());
      // after product is added redirect to products page
      if (response.status === 201) {
        window.location.href = "/admin/products"; // Redirect after adding product
      }
      return response;
    } catch (error) {
      console.log("Failed to add product:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

export function fetchProducts() {
  return async function fetchProductsThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.get("/admin/products");
      dispatch(setProducts(response.data.data.reverse()));
      dispatch(setStatus(STATUSES.SUCCESS));
    } catch (error) {
      console.log("Failed to fetch products:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

export function fetchSingleProduct(productId) {
  return async function fetchSingleProductThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.get(`/admin/products/${productId}`);
      dispatch(setSelectedProduct(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));
    } catch (error) {
      console.log("Failed to fetch products:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

export function editProduct(formData) {
  return async function editProductThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.patch(`/admin/products/${formData.get("id")}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(setProducts(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));
      // Optionally, you can fetch the updated list of products here
      dispatch(fetchProducts());
      // Refetch the single product to ensure state is updated
      dispatch(fetchSingleProduct(formData.get("id")));
      return response;
    } catch (error) {
      console.log("Failed to edit product:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
      throw error;
    }
  };
}

// export const editProduct = createAsyncThunk("product/editProduct", async (formData, { dispatch }) => {
//   dispatch(setStatus(STATUSES.LOADING));
//   try {
//     const response = await APIAuthenticated.patch(`/admin/products/${formData.get("id")}`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     dispatch(setProducts(response.data.data));
//     dispatch(setStatus(STATUSES.SUCCESS));
//     dispatch(fetchProducts());
//     return response.data;
//   } catch (error) {
//     console.log("Failed to edit product:", error.response?.data);
//     dispatch(setStatus(STATUSES.ERROR));
//     throw error;
//   }
// });

export function deleteProduct(productId) {
  return async function deleteProductThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.delete(
        `/admin/products/${productId}`
      );
      dispatch(deleteProductById({ productId }));
      dispatch(setStatus(STATUSES.SUCCESS));
      // make: If delete is triggred from single product page then redirect to products page
      if (response.status === 200 && window.location.pathname === `/admin/products/${productId}`) {
        window.location.href = "/admin/products";
      }
      dispatch(fetchProducts()); // Refetch to ensure state is updated
    } catch (error) {
      console.log("Failed to delete product:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}

export function updateProductStatus(productId, productStatus) {
  return async function updateProductStatusThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.patch(
        `/admin/products/productstatus/${productId}`,
        {
          productStatus, // Send nested field
        }
      );
      dispatch(
        updateProductStatusById({
          productId,
          data: response.data.data.productStatus
        })
      );
      dispatch(fetchSingleProduct(productId)); // Refetch to ensure state is updated
      dispatch(setStatus(STATUSES.SUCCESS));
      // if (response.status === 200) {
      //   window.location.href = `/orderdetails/${orderId}`; // Redirect after update
      // }
    } catch (error) {
      console.log("Failed to update payment status:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}


export function updateProductStockQty(productId, productStockQty) {
  return async function updateProductStockQtyThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.patch(
        `/admin/products/productstockqty/${productId}`,
        {
          productStockQty, // Send nested field
        }
      );
      dispatch(
        updateProductStockQtyById({
          productId,
          data: response.data.data.productStockQty
        })
      );
      dispatch(fetchSingleProduct(productId)); // Refetch to ensure state is updated
      dispatch(setStatus(STATUSES.SUCCESS));
      // if (response.status === 200) {
      //   window.location.href = `/orderdetails/${orderId}`; // Redirect after update
      // }
    } catch (error) {
      console.log("Failed to update payment status:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}


export function fetchOrdersOfProduct(productId) {
  return async function fetchOrdersOfProductThunk(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await APIAuthenticated.get(`/admin/productOrders/${productId}`);
      console.log("Orders of this Product:", response.data); // Debug response
      dispatch(setOrdersOfProduct(response.data.data));
      dispatch(setStatus(STATUSES.SUCCESS));
      dispatch(fetchOrders());
    } catch (error) {
      console.log("Failed to fetch orders of this product:", error.response?.data);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
}