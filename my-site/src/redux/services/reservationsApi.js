import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const reservationsApi=createApi({
    reducerPath:'reservations',
    baseQuery: fetchBaseQuery({baseUrl:'http://192.168.1.10:3030'}),
    endpoints:builder=>({
        getReservations:builder.query({
            query:()=>'reservations',
            providesTags:['reservations']
        }),
        getReservationsByRoom:builder.query({
            query:(roomId)=>'reservations?room='+roomId,
            providesTags:['reservations']
        }),
        addReservation:builder.mutation({
            query:newReservation=>({
                url:'reservations',
                method:'POST',
                body:newReservation
            }),
            invalidatesTags:['reservations']
        }),
        updateReservation:builder.mutation({
            query:({id,user,room,date,nights,is_finaly})=>({
                url:'reservations/'+id,
                method:'PUT',
                body:JSON.stringify({user,room,date,nights,is_finaly}),
                headers: {
                    'Content-Type': 'application/json'
                }
            }),
            invalidatesTags:['reservations']
        }),
        deleteReservation:builder.mutation({
            query:id=>({
                url:'reservations/'+id,
                method:'DELETE',
            }),
            invalidatesTags:['reservations']
        })
    })
})

export const {useGetReservationsQuery,useGetReservationsByRoomQuery,useAddReservationMutation,useUpdateReservationMutation,useDeleteReservationMutation}=reservationsApi
export default reservationsApi