import { useState,useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/reserving.scss"
import {useGetReservationsQuery,useUpdateReservationMutation} from '../redux/services/reservationsApi'
import {useGetOrdersQuery,useUpdateOrderMutation} from '../redux/services/ordersApi'
import {useAddPaymentMutation} from '../redux/services/paymentsApi'
import {v4} from 'uuid';
import QRCode from "qrcode";
import axios from "axios"
import {reservationsPriceContext,dateToString} from '../App'

function Reserving({user,getOrdersPrice}) {
    const [name,setName]=useState()
    const [family,setFamily]=useState()
    const [paymentType,setPaymentType]=useState('Internet payment')
    const {data:allReservations,isLoading:reservationsLoading}=useGetReservationsQuery()
    const {data:allOrders,isLoading:ordersLoading}=useGetOrdersQuery()
    const [addPayment]=useAddPaymentMutation()
    const [updateReservation]=useUpdateReservationMutation()
    const [updateOrder]=useUpdateOrderMutation()
    const getReservationsPrice=useContext(reservationsPriceContext)
    const [isPaymented,setIsPaymented]=useState(false)
    const payment=async()=>{
        let paymentCode=v4()
        let payment={
            name:name,
            family:family,
            payment_type:paymentType,
            payment_code:paymentCode,
            reservations:reservations.map(i=>i.id),
            orders:orders.map(i=>i.id)
        }
        addPayment(payment)
        await reservations.map(async reservation=>{
            await updateReservation({...reservation,is_finaly:true})
            return {...reservation,is_finaly:true,date:new Date(reservation.date)}
        })
        await orders.map(async order=>{
            await updateOrder({...order,is_finaly:true})
            return {...order,is_finaly:true}
        })
        setIsPaymented(true)
        getReservationsPrice()
        getOrdersPrice()
        let QRCodeUrl
        QRCode.toDataURL("http://192.168.1.10:3000/admin/payments?payment_code="+paymentCode,{width: 150,margin:0},(error, url) => {
            QRCodeUrl=url
        });
        let element=document.querySelector('.reservation-form')
        element.setAttribute('class','ticket')
        element.innerHTML=`
            <div class="ticket__header">
                <div>
                    <div>
                        <a href="${QRCodeUrl}" download>
                            <img src="${QRCodeUrl}" alt="qrcode">
                        </a>
                        <div class="more-info">
                            <div>
                                <div class="bold">Name: </div>
                                <div>${name}</div>
                            </div>
                            <div>
                                <div class="bold">Family: </div>
                                <div>${family}</div>
                            </div>
                            <div>
                                <div class="bold">Payment Type: </div>
                                <div>${paymentType}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
        for (let reservation of reservations) {
            reservation={...reservation,date:new Date(reservation.date)}
            reservation.endDate=new Date(reservation.date.getFullYear(),reservation.date.getMonth(),reservation.date.getDate()+reservation.nights)
            let room=(await axios.get('rooms/'+reservation.room)).data
            element.innerHTML+=`
                <div class="room">
                    <div>
                        <div>
                            <img src="/images/rooms/${room.images[0]}">
                            <div class="more-info">
                                <div>
                                    <div class="bold">Date :</div>
                                    <div>${dateToString(reservation.date)}</div>
                                </div>
                                <div>
                                    <div class="bold">Nights :</div>
                                    <div>${reservation.nights}</div>
                                </div>
                                <div>
                                    <div class="bold">End date :</div>
                                    <div>${dateToString(reservation.endDate)}</div>
                                </div>
                            </div>
                            <div class="more-info">
                                <div>
                                    <div class="bold">Capacity :</div>
                                    <div>${room.capacity}</div>
                                </div>
                                <div>
                                    <div class="bold">Price :</div>
                                    <div>${room.price}$</div>
                                </div>
                                <div>
                                    <div class="bold">Total :</div>
                                    <div>${room.price*reservation.nights}$</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
        for (let order of orders) {
            let food=(await axios.get('foods/'+order.food)).data
            element.innerHTML+=`
                <div class="food">
                    <div>
                        <div>
                            <img src="/images/foods/${food.images[0]}">
                            <div class="more-info">
                                <div>
                                    <div class="bold">Qty :</div>
                                    <div>${order.qty}</div>
                                </div>
                                <div>
                                    <div class="bold">Price :</div>
                                    <div>${food.price}$</div>
                                </div>
                                <div>
                                    <div class="bold">Total :</div>
                                    <div>${food.price*order.qty}$</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
        alert('Please click on qrcode to download it bring it with you at the hotel.')
    }
    if(!user){
        return <main style={{display:"flex",justifyContent:"center",alignItems:"center",fontSize:'20px'}}>
            <div style={{textAlign:'center'}}>
                <p>You are not&nbsp;<Link to='/login' style={{color:'black'}}>login</Link>.</p>
                <br/>
                <p>If you do not have an account, you can&nbsp;<Link to='/register' style={{color:'black'}}>register</Link>.</p>
            </div>
        </main>
    }else if(reservationsLoading || ordersLoading){
        return <main style={{display:"flex",justifyContent:"center",alignItems:"center",fontSize:'20px'}}>
            <h1>Loading...</h1>
        </main>
    }else{
        var reservations=allReservations.filter(i=>i.user==user.id && i.is_finaly==false)
        var orders=allOrders.filter(i=>i.user==user.id && i.is_finaly==false)
    }
    if(reservations.length==0 && orders.length==0 && !isPaymented){
        return <main style={{display:"flex",justifyContent:"center",alignItems:"center",fontSize:'20px'}}>
            <h1>You have not any reservations and orders</h1>
        </main>
    }else{
        return <main className="reservation-form">
            <form onSubmit={payment}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" value={name} onChange={e=>setName(e.target.value)} required/>
                </div>
                <div>
                    <label htmlFor="family">Family:</label>
                    <input type="text" id="family" value={family} onChange={e=>setFamily(e.target.value)} required/>
                </div>
                <div>
                    <label>Payment Type:</label>
                    <ul>
                        <li>
                            <input type="radio" name="payment-type" value="Internet payment" defaultChecked onChange={e=>setPaymentType(e.target.value)}/>
                            <label>Internet payment</label>
                        </li>
                        <li>
                            <input type="radio" name="payment-type" value="Payment at the hotel" onChange={e=>setPaymentType(e.target.value)}/>
                            <label>Payment at the hotel</label>
                        </li>
                    </ul>
                </div>
                <div style={{textAlign:"center"}}>
                    <button type="submit">Payment</button>
                </div>
            </form>
        </main>
    }
}

export default Reserving;