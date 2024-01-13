import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const paymentsApi=createApi({
    reducerPath:'payments',
    baseQuery: fetchBaseQuery({baseUrl:'http://192.168.1.10:3030'}),
    endpoints:builder=>({
        getPayments:builder.query({
            query:()=>'payments',
            providesTags:['payments']
        }),
        addPayment:builder.mutation({
            query:newPayment=>({
                url:'payments',
                method:'POST',
                body:newPayment
            }),
            invalidatesTags:['payments']
        })
    })
})

export const {useGetPaymentsQuery,useAddPaymentMutation}=paymentsApi
export default paymentsApi