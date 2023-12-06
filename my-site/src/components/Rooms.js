import '../styles/rooms.scss'
import {useGetRoomsQuery,useLikeRoomMutation} from "../redux/services/roomsApi"
import { useState,useMemo } from 'react'
import {useNavigate,Link,Routes,Route} from 'react-router-dom'
import Room from "./Room";
import {useGetReservationsQuery,useAddReservationMutation} from "../redux/services/reservationsApi"

function Rooms({user}) {
    const {data:rooms,isSuccess}=useGetRoomsQuery()
    const {data:reservations}=useGetReservationsQuery()
    const [like]=useLikeRoomMutation()
    const [searchedRooms,setSearchedRooms]=useState([])
    const [reserve]=useAddReservationMutation()
    const navigate=useNavigate()
    const [date,setDate]=useState(new Date(''))
    const [nights,setNights]=useState(1)
    const matchLikes=(rooms)=>{
        try{
            return rooms.map(x=>{
                let room={...x}
                room['liked']=room.likers.includes(user.id)
                return room
            })
        }catch{
            return rooms
        }
    }
    useMemo(()=>{
        if(isSuccess){
            setSearchedRooms(matchLikes(rooms))
        }
    },[rooms])
    const likeHandler=room=>{
        try {
            if(room.liked){
                like({
                    id:room.id,
                    likers:room.likers.filter(id=>id!==user.id)
                })
            }else{
                like({
                    id:room.id,
                    likers:room.likers.concat(user.id)
                })
            }
        } catch {
            if(window.confirm('To like the room you must be log in.\nDo you want to log in?')){
                navigate('/login')
            }
        }
    }
    const reserveHandler=(roomId)=>{
        if(user!=null) {
            if(isNaN(date)){
                document.getElementById('date').setCustomValidity('Please enter date.')
                document.getElementById('date').reportValidity()
            }else{
                var bookedDates=[]
                for (let i of reservations) {
                    if(i.room==roomId){
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
                    reserve({
                        "user": user.id,
                        "room": roomId,
                        "date": `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
                        "nights": nights,
                        "is_finaly": false,
                    })
                    alert("Your room has been successfully booked. Go to the reservation page to finalize.")
                }
            }
        } else {
            if(window.confirm('To reserve this room you must be log in.\nDo you want to log in?')){
                navigate('/login')
            }
        }
        // try {
        //     if(date===''){
        //         document.getElementById('date').setCustomValidity('Please enter date.')
        //         document.getElementById('date').reportValidity()
        //     }else{
        //         reserve({
        //             "user": user.id,
        //             "room": roomId,
        //             "date": date,
        //             "nights": Number(nights),
        //             "is_finaly": false,
        //         })
        //         alert("Your room has been successfully booked. Go to the reservation page to finalize.")
        //     }
        // } catch {
        //     if(window.confirm('To reserve this room you must be log in.\nDo you want to log in?')){
        //         navigate('/login')
        //     }
        // }
    }
    const dateValue=()=>{
        try{
            return date.toISOString().slice(0,10)
        }
        catch{
            return ''
        }
    }
    const html=<main className="rooms">
        <div className="search">
            <div>
                <label htmlFor="date">Date : </label>
                <input type="date" min={new Date().toJSON().slice(0, 10)} id='date' value={dateValue()} onChange={event=>setDate(new Date(event.target.value))}/>
            </div>
            <div>
                <label htmlFor="nights">Nights : </label>
                <input type="number" min='1' id='nights' value={nights} onChange={event=>setNights(event.target.value)}/>
            </div>
        </div>
        <div className="searched-rooms">
            {searchedRooms.map(room=><div key={room.id} className='room'>
                <div>
                    <div>
                        <Link to={String(room.id)}><img src={`/images/rooms/${room.images[0]}`} alt={`room${room.id}`}/></Link>
                        <div className="more-info">
                            <div>
                                <i className='fa fa-dollar'></i>
                                <span>{room.price}$</span>
                            </div>
                            <div>
                                <i className='fa fa-users'></i>
                                <span>{room.capacity}</span>
                            </div>
                            <div>
                                <i className={room.liked ? 'fa fa-heart' : 'fa fa-heart-o' } style={{cursor:"pointer"}} onClick={()=>likeHandler(room)}></i>
                                <span>{room.likers.length}</span>
                            </div>
                        </div>
                    </div>
                    <div className='reservation'>
                        <button onClick={()=>reserveHandler(room.id)}>Reserve</button>
                    </div>
                </div>
                <p>{room.info}</p>
            </div>)}
        </div>
    </main>
    return <Routes>
        <Route path='' element={html}></Route>
        <Route path=':id' element={<Room user={user} pdate={date} pnights={nights}/>}></Route>
    </Routes>
}

export default Rooms;