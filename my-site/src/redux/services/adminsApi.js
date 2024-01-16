import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const adminsApi=createApi({
    reducerPath:'admins',
    baseQuery: fetchBaseQuery({baseUrl:'http://192.168.1.10:3030'}),
    endpoints:builder=>({
        getAdmins:builder.query({
            query:()=>'admins',
            providesTags:['admins']
        }),
        addAdmin:builder.mutation({
            query:newAdmin=>({
                url:'admins',
                method:'POST',
                body:newAdmin
            }),
            invalidatesTags:['admins']
        }),
        updateAdmin:builder.mutation({
            query:({id,username,password,manager})=>({
                url:'admins/'+id,
                method:'PUT',
                body:{username,password,manager}
            }),
            invalidatesTags:['admins']
        }),
        deleteAdmin:builder.mutation({
            query:id=>({
                url:'admins/'+id,
                method:'DELETE',
            }),
            invalidatesTags:['admins']
        })
    })
})

export const {useGetAdminsQuery,useAddAdminMutation,useUpdateAdminMutation,useDeleteAdminMutation}=adminsApi
export default adminsApi