import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const usersApi=createApi({
    reducerPath:'users',
    baseQuery: fetchBaseQuery({baseUrl:'http://192.168.1.10:3030'}),
    endpoints:builder=>({
        getUsers:builder.query({
            query:()=>'users',
            providesTags:['users']
        }),
        addUser:builder.mutation({
            query:newUser=>({
                url:'users',
                method:'POST',
                body:newUser
            }),
            invalidatesTags:['users']
        }),
        updateUser:builder.mutation({
            query:({id,username,password})=>({
                url:'users/'+id,
                method:'PUT',
                body:{username,password}
            }),
            invalidatesTags:['users']
        }),
        deleteUser:builder.mutation({
            query:id=>({
                url:'users/'+id,
                method:'DELETE',
            }),
            invalidatesTags:['users']
        })
    })
})

export const {useGetUsersQuery,useAddUserMutation,useDeleteUserMutation}=usersApi
export default usersApi