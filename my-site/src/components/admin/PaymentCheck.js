import { useState } from 'react'
import {useGetReservationsQuery} from '../../redux/services/reservationsApi'
import {useGetRoomsQuery} from '../../redux/services/roomsApi'
import {useGetOrdersQuery} from '../../redux/services/ordersApi'
import {useGetFoodsQuery} from '../../redux/services/foodsApi'
import axios from 'axios'
import "../../styles/admin/payment_check.scss"
import {dateToString} from '../../App'

function PaymentCheck() {
    const {data:reservations,isLoading:isReservatonsLoading}=useGetReservationsQuery()
    const {data:rooms,isLoading:isRoomsLoading}=useGetRoomsQuery()
    const {data:orders,isLoading:isOrdersLoading}=useGetOrdersQuery()
    const {data:foods,isLoading:isFoodsLoading}=useGetFoodsQuery()
    const paymentCode=new URLSearchParams(window.location.search).get('payment_code')
    const [payment,setPayment]=useState()
    if(paymentCode==null){
        return <main style={{minHeight:'calc(100vh - 53px)',display:'flex',justifyContent:'center',alignItems:'center'}}>
            <h1>
                You did not enter payment code.
            </h1>
        </main>
    }
    if(!payment){
        axios.get('/payments?payment_code='+paymentCode)
        .then(res=>{
            if(res.data.length==0){
                setPayment('Payment code is not correct.')
            }else{
                setPayment(res.data[0])
            }
        })
    }
    if((typeof payment)=='string'){
        return <main style={{minHeight:'calc(100vh - 53px)',display:'flex',justifyContent:'center',alignItems:'center'}}>
            <h1>
                {payment}
            </h1>
        </main>
    }
    if(payment==undefined || isReservatonsLoading || isRoomsLoading || isOrdersLoading || isFoodsLoading){
        return <main style={{minHeight:'calc(100vh - 53px)',display:'flex',justifyContent:'center',alignItems:'center'}}>
            <h1>
                Loading...
            </h1>
        </main>
    }
    return <main className='payment-check'>
        <div className="ticket__header">
            <div className="info">
                <div>
                    <div className="bold">Name: </div>
                    <div>{payment.name}</div>
                </div>
                <div>
                    <div className="bold">Family: </div>
                    <div>{payment.family}</div>
                </div>
                <div>
                    <div className="bold">Payment Type: </div>
                    <div>{payment.payment_type}</div>
                </div>
            </div>
        </div>
        {reservations.filter(reservation=>payment.reservations.includes(reservation.id)).map(
            reservation=>{
                let room=rooms.find(i=>reservation.room==i.id)
                let date=new Date(reservation.date)
                let endDate=new Date(date.getFullYear(),date.getMonth(),date.getDate()+reservation.nights)
                return <div className="room" key={reservation.id}>
                    <div>
                        <div>
                            <img src={`/images/rooms/${room.images[0]}`}/>
                            <div className="more-info">
                                <div>
                                    <div className="bold">Date :</div>
                                    <div>{dateToString(date)}</div>
                                </div>
                                <div>
                                    <div className="bold">Nights :</div>
                                    <div>{reservation.nights}</div>
                                </div>
                                <div>
                                    <div className="bold">End date :</div>
                                    <div>{dateToString(new Date(endDate))}</div>
                                </div>
                            </div>
                            <div className="more-info">
                                <div>
                                    <div className="bold">Capacity :</div>
                                    <div>{room.capacity}</div>
                                </div>
                                <div>
                                    <div className="bold">Price :</div>
                                    <div>{room.price}$</div>
                                </div>
                                <div>
                                    <div className="bold">Total :</div>
                                    <div>{room.price*reservation.nights}$</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        )}
        {orders.filter(order=>payment.orders.includes(order.id)).map(
            order=>{
                let food=foods.find(food=>order.food==food.id)
                return <div className="room" key={order.id}>
                    <div>
                        <div>
                            <img src={`/images/foods/${food.images[0]}`}/>
                            <div className="more-info">
                                <div>
                                    <div className="bold">Qty :</div>
                                    <div>{order.qty}</div>
                                </div>
                                <div>
                                    <div className="bold">Price :</div>
                                    <div>{food.price}$</div>
                                </div>
                                <div>
                                    <div className="bold">Total :</div>
                                    <div>{food.price*order.qty}$</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        )}
    </main>
}

export default PaymentCheck;