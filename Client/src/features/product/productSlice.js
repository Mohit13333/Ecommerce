import { createSlice } from '@reduxjs/toolkit';
import {
  fetchProductsByFilters,
  fetchBrands,
  fetchCategories,
  fetchProductById,
  createProduct,
  updateProduct,
} from './productAPI';

const initialState = {
  products: [],
  brands: [],
  categories: [],
  status: 'idle',
  totalItems: 0,
  selectedProduct: null,
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    setLoading: (state) => {
      state.status = 'loading';
    },
    setProducts: (state, action) => {
      state.status = 'idle';
      state.products = action.payload.products;
      state.totalItems = action.payload.totalItems;
    },
    setBrands: (state, action) => {
      state.status = 'idle';
      state.brands = action.payload;
    },
    setCategories: (state, action) => {
      state.status = 'idle';
      state.categories = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.status = 'idle';
      state.selectedProduct = action.payload;
    },
    addProduct: (state, action) => {
      state.status = 'idle';
      state.products.push(action.payload);
    },
    updateExistingProduct: (state, action) => {
      state.status = 'idle';
      const index = state.products.findIndex(
        (product) => product.id === action.payload.id
      );
      if (index !== -1) {
        state.products[index] = action.payload;
        state.selectedProduct = action.payload;
      }
    },
  },
});

// Async actions defined as regular functions that return promises
export const fetchProducts = (filter, sort, pagination, admin) => {
  return async (dispatch) => {
    dispatch(productSlice.actions.setLoading());
    try {
      const response = await fetchProductsByFilters(filter, sort, pagination, admin);
      console.log('API response:', response); // Check the response structure
      dispatch(productSlice.actions.setProducts({
        products: response.products, // Adjust based on your API response structure
        totalItems: response.totalItems
      }));
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };
};

export const fetchProductBrands = () => {
  return async (dispatch) => {
    dispatch(productSlice.actions.setLoading());
    try {
      const response = await fetchBrands();
      dispatch(productSlice.actions.setBrands(response.data));
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    }
  };
};

export const fetchProductCategories = () => {
  return async (dispatch) => {
    dispatch(productSlice.actions.setLoading());
    try {
      const response = await fetchCategories();
      dispatch(productSlice.actions.setCategories(response.data));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };
};

export const fetchProductByIdAction = (id) => {
  return async (dispatch) => {
    dispatch(productSlice.actions.setLoading());
    try {
      const response = await fetchProductById(id);
      console.log(response)
      dispatch(productSlice.actions.setSelectedProduct(response));
    } catch (error) {
      console.error('Failed to fetch product:', error);
    }
  };
};

export const createProductAction = (product) => {
  return async (dispatch) => {
    dispatch(productSlice.actions.setLoading());
    try {
      const response = await createProduct(product);
      dispatch(productSlice.actions.addProduct(response.data));
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };
};

export const updateProductAction = (update) => {
  return async (dispatch) => {
    dispatch(productSlice.actions.setLoading());
    try {
      const response = await updateProduct(update);
      dispatch(productSlice.actions.updateExistingProduct(response.data));
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };
};

export const { clearSelectedProduct } = productSlice.actions;

// Selectors
export const selectAllProducts = (state) => state.product.products;
export const selectBrands = (state) => state.product.brands;
export const selectCategories = (state) => state.product.categories;
export const selectProductById = (state) => state.product.selectedProduct;
export const selectProductListStatus = (state) => state.product.status;
export const selectTotalItems = (state) => state.product.totalItems;

export default productSlice.reducer;
