import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const foodsApi=createApi({
    reducerPath:'foods',
    baseQuery: fetchBaseQuery({baseUrl:'http://192.168.1.10:3030'}),
    endpoints:builder=>({
        getFoods:builder.query({
            query:()=>'foods',
            providesTags:['foods']
        }),
        getFood:builder.query({
            query:(id)=>'foods/'+id,
            providesTags:['foods']
        }),
        addFood:builder.mutation({
            query:newFood=>({
                url:'foods',
                method:'POST',
                body:newFood
            }),
            invalidatesTags:['foods']
        }),
        updateFood:builder.mutation({
            query:({id,name,images,type,price,info})=>({
                url:'foods/'+id,
                method:'PUT',
                body:JSON.stringify({name,images,type,price,info}),
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            invalidatesTags:['foods']
        }),
        deleteFood:builder.mutation({
            query:id=>({
                url:'foods/'+id,
                method:'DELETE',
            }),
            invalidatesTags:['foods']
        })
    })
})

export const {useGetFoodsQuery,useGetFoodQuery,useAddFoodMutation,useUpdateFoodMutation,useDeleteFoodMutation}=foodsApi
export default foodsApi