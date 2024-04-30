import { apiSlice } from './apiSlice';
import { SAVED_ITEMS_URL } from '../constants';

export const savedItemsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      getSavedItems: builder.query({
        query: () => `${SAVED_ITEMS_URL}`,
        providesTags: ['SavedItems'],
      }),
      saveForLater: builder.mutation({
        query: (productId) => ({
          url: `${SAVED_ITEMS_URL}`,
          method: 'POST',
          body: { product: productId }
        }),
        invalidatesTags: ['SavedItems'],
      }),
      deleteSavedItem: builder.mutation({
        query: (itemId) => ({
          url: `${SAVED_ITEMS_URL}/${itemId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['SavedItems'],
      }),
    }),
  });
  
  export const {
    useGetSavedItemsQuery,
    useSaveForLaterMutation,
    useDeleteSavedItemMutation,
  } = savedItemsApiSlice;
  