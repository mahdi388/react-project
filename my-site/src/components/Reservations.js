import "../styles/reservations.scss"
import { Link } from "react-router-dom";
import {useGetReservationsQuery,useDeleteReservationMutation,useUpdateReservationMutation} from '../redux/services/reservationsApi'
import {useGetRoomsQuery} from '../redux/services/roomsApi'
import { useContext } from 'react'
import {reservationsPriceContext,dateToString} from '../App'

function Reservations({user}) {
    var {data:allReservations,isLoading:isLoadingReservations}=useGetReservationsQuery()
    const {data:rooms,isLoading:isLoadingRooms}=useGetRoomsQuery()
    const [remove]=useDeleteReservationMutation()
    const [update]=useUpdateReservationMutation()
    const getReservationsPrice=useContext(reservationsPriceContext)
    if(!user){
        return <main style={{display:"flex",justifyContent:"center",alignItems:"center",fontSize:'20px'}}>
            <div style={{textAlign:'center'}}>
                <p>You are not&nbsp;<Link to='/login' style={{color:'black'}}>login</Link>.</p>
                <br/>
                <p>If you do not have an account, you can&nbsp;<Link to='/register' style={{color:'black'}}>register</Link>.</p>
            </div>
        </main>
    }else{
        if(!isLoadingReservations){
            var reservations=allReservations.filter(i=>i.user==user.id).filter(i=>!i.is_finaly).map(i=>{return {...i,date:new Date(i.date)}})
        }
        const removeHandler=async id=>{
            await remove(id)
            getReservationsPrice()
        }
        const changeHandler=({target},name)=>{
            target.classList.add('hidden')
            document.querySelector(`#room${target.dataset.id} .${name} .insert-button`).classList.remove('hidden')
            document.querySelector(`#room${target.dataset.id} .${name} .cancel-button`).classList.remove('hidden')
            document.querySelector(`#room${target.dataset.id} .${name} input`).classList.remove('hidden')
        }
        const cancelHandler=({target},name)=>{
            document.querySelector(`#room${target.dataset.id} .${name} .change-button`).classList.remove('hidden')
            document.querySelector(`#room${target.dataset.id} .${name} .insert-button`).classList.add('hidden')
            document.querySelector(`#room${target.dataset.id} .${name} .cancel-button`).classList.add('hidden')
            document.querySelector(`#room${target.dataset.id} .${name} input`).classList.add('hidden')
        }
        const changeDate=async ({target})=>{
            let reservation=allReservations.find(reservation=>reservation.id==target.dataset.id)
            let nights=reservation.nights
            let date=new Date(document.querySelector(`#room${target.dataset.id} .date input`).value)
            var bookedDates=[]
            for (let i of allReservations.filter(i=>i.room==reservation.room)) {
                if(i!=reservation){
                    let date=new Date(i.date)
                    for (let j = 0; j <= i.nights; j++) {
                        bookedDates.push(new Date(date.getFullYear(),date.getMonth(),date.getDate()+j))
                    }
                }
            }
            var bookingDates=[]
            for (let i = 0; i <= nights; i++) {
                bookingDates.push(new Date(date.getFullYear(),date.getMonth(),date.getDate()+i))
            }
            var bookingAndBookedDates=bookingDates.filter(date=>bookedDates.map(bookedDate=>bookedDate.getTime()).includes(date.getTime()))
            if(bookingAndBookedDates.length>0){
                alert("This room is reserved on these dates:\n"+bookingAndBookedDates.map(date=>`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`).join('\n'))
            }else{
                await update({
                    ...reservation,
                    date:dateToString(date)
                })
                getReservationsPrice()
                document.querySelector(`#room${target.dataset.id} .date .change-button`).classList.remove('hidden')
                document.querySelector(`#room${target.dataset.id} .date .insert-button`).classList.add('hidden')
                document.querySelector(`#room${target.dataset.id} .date .cancel-button`).classList.add('hidden')
                document.querySelector(`#room${target.dataset.id} .date input`).classList.add('hidden')
            }
        }
        const changeNights=async ({target})=>{
            let reservation=allReservations.find(reservation=>reservation.id==target.dataset.id)
            let nights=Number(document.querySelector(`#room${target.dataset.id} .nights input`).value)
            let date=new Date(reservation.date)
            var bookedDates=[]
            for (let i of allReservations.filter(i=>i.room==reservation.room)) {
                if(i!=reservation){
                    let date=new Date(i.date)
                    for (let j = 0; j <= i.nights; j++) {
                        bookedDates.push(new Date(date.getFullYear(),date.getMonth(),date.getDate()+j))
                    }
                }
            }
            var bookingDates=[]
            for (let i = 0; i <= nights; i++) {
                bookingDates.push(new Date(date.getFullYear(),date.getMonth(),date.getDate()+i))
            }
            var bookingAndBookedDates=bookingDates.filter(date=>bookedDates.map(bookedDate=>bookedDate.getTime()).includes(date.getTime()))
            if(bookingAndBookedDates.length>0){
                alert("This room is reserved on these dates:\n"+bookingAndBookedDates.map(date=>`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`).join('\n'))
            }else{
                await update({
                    ...reservation,
                    nights:nights,
                    date:dateToString(date)
                })
                getReservationsPrice()
                document.querySelector(`#room${target.dataset.id} .nights .change-button`).classList.remove('hidden')
                document.querySelector(`#room${target.dataset.id} .nights .insert-button`).classList.add('hidden')
                document.querySelector(`#room${target.dataset.id} .nights .cancel-button`).classList.add('hidden')
                document.querySelector(`#room${target.dataset.id} .nights input`).classList.add('hidden')
            }
        }
        return <main className="reservations">
            {isLoadingReservations || isLoadingRooms ? 'Loading...' :
                <>
                    {reservations.length==0 ? <h1>You have not any reservations</h1> :
                        <>
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{width:'100px'}}>room</th>
                                        <th style={{width:'400px'}}>date</th>
                                        <th style={{width:'300px'}}>nights</th>
                                        <th>price</th>
                                        <th>total</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservations.map(i=><tr key={i.id} id={'room'+i.id}>
                                        <td>
                                            <div>
                                                <img src={`/images/rooms/${rooms.find(room=>room.id==i.room).images[0]}`}/>
                                            </div>
                                        </td>
                                        <td className="date">
                                            <div>
                                                <div>
                                                    <div>{dateToString(i.date)}</div>
                                                    <input type="date" className="hidden" defaultValue={dateToString(i.date)} min={dateToString(new Date())}/>
                                                </div>
                                                <div className="buttons">
                                                    <button className="change-button" data-id={i.id} onClick={e=>changeHandler(e,'date')}>
                                                        Change
                                                    </button>
                                                    <button className="insert-button hidden" data-id={i.id} onClick={changeDate}>
                                                        Insert
                                                    </button>
                                                    <button className="cancel-button hidden" data-id={i.id} onClick={e=>cancelHandler(e,'date')}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="nights">
                                            <div>
                                                <div>
                                                    <div>{i.nights}</div>
                                                    <div>
                                                        <input type="number" className="hidden" defaultValue={i.nights} min="1"/>
                                                    </div>
                                                </div>
                                                <div className="buttons">
                                                <button className="change-button" data-id={i.id} onClick={e=>changeHandler(e,'nights')}>
                                                        Change
                                                    </button>
                                                    <button className="insert-button hidden" data-id={i.id} onClick={changeNights}>
                                                        Insert
                                                    </button>
                                                    <button className="cancel-button hidden" data-id={i.id} onClick={e=>cancelHandler(e,'nights')}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                {rooms.find(room=>room.id==i.room).price}$
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                {i.nights*rooms.find(room=>room.id==i.room).price}$
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <i className="fa fa-trash" onClick={()=>removeHandler(i.id)}></i>
                                            </div>
                                        </td>
                                    </tr>)}
                                </tbody>
                            </table>
                            <Link to='/reserving'>
                                <button>
                                    Payment
                                </button>
                            </Link>
                        </>
                    }
                </>
            }
        </main>;
    }
}

export default Reservations;