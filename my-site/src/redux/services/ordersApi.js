import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const ordersApi=createApi({
    reducerPath:'orders',
    baseQuery: fetchBaseQuery({baseUrl:'http://192.168.1.10:3030'}),
    endpoints:builder=>({
        getOrders:builder.query({
            query:()=>'orders',
            providesTags:['orders']
        }),
        addOrder:builder.mutation({
            query:newOrder=>({
                url:'orders',
                method:'POST',
                body:newOrder
            }),
            invalidatesTags:['orders']
        }),
        updateOrder:builder.mutation({
            query:({id,user,food,qty,is_finaly})=>({
                url:'orders/'+id,
                method:'PUT',
                body:JSON.stringify({user,food,qty,is_finaly}),
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            invalidatesTags:['orders']
        }),
        deleteOrder:builder.mutation({
            query:id=>({
                url:'orders/'+id,
                method:'DELETE',
            }),
            invalidatesTags:['orders']
        })
    })
})

export const {useGetOrdersQuery,useAddOrderMutation,useUpdateOrderMutation,useDeleteOrderMutation}=ordersApi
export default ordersApi