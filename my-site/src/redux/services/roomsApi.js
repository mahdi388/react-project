import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const roomsApi=createApi({
    reducerPath:'rooms',
    baseQuery: fetchBaseQuery({baseUrl:'http://192.168.1.10:3030'}),
    endpoints:builder=>({
        getRooms:builder.query({
            query:()=>'rooms',
            providesTags:['rooms']
        }),
        getRoom:builder.query({
            query:(id)=>'rooms/'+id,
            providesTags:['rooms']
        }),
        addRoom:builder.mutation({
            query:newRoom=>({
                url:'rooms',
                method:'POST',
                body:newRoom
            }),
            invalidatesTags:['rooms']
        }),
        updateRoom:builder.mutation({
            query:({id,images,capacity,price,info,likers})=>({
                url:'rooms/'+id,
                method:'PUT',
                body:JSON.stringify({images,capacity,price,info,likers}),
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            invalidatesTags:['rooms']
        }),
        likeRoom:builder.mutation({
            query:({id,likers})=>({
                url:'rooms/'+id,
                method:'PATCH',
                body:JSON.stringify({likers}),
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            invalidatesTags:['rooms']
        }),
        deleteRoom:builder.mutation({
            query:id=>({
                url:'rooms/'+id,
                method:'DELETE',
            }),
            invalidatesTags:['rooms']
        })
    })
})

export const {useGetRoomsQuery,useGetRoomQuery,useAddRoomMutation,useUpdateRoomMutation,useLikeRoomMutation,useDeleteRoomMutation}=roomsApi
export default roomsApi