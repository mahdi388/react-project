import {configureStore} from '@reduxjs/toolkit'
import usersApi from './services/usersApi'
import roomsApi from './services/roomsApi'
import reservationsApi from './services/reservationsApi'
import paymentsApi from './services/paymentsApi'

export default configureStore({
    reducer:{
        [usersApi.reducerPath]:usersApi.reducer,
        [roomsApi.reducerPath]:roomsApi.reducer,
        [reservationsApi.reducerPath]:reservationsApi.reducer,
        [paymentsApi.reducerPath]:paymentsApi.reducer
    },
    middleware:getDefaultMiddleware=>{
        return getDefaultMiddleware()
        .concat(usersApi.middleware)
        .concat(roomsApi.middleware)
        .concat(reservationsApi.middleware)
        .concat(paymentsApi.middleware)
    }
})