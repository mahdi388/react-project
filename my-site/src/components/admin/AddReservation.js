import '../../styles/admin/add_reservation.scss'
import {useGetRoomsQuery} from '../../redux/services/roomsApi'
import {useGetReservationsQuery,useAddReservationMutation} from '../../redux/services/reservationsApi'
import {useGetUsersQuery} from '../../redux/services/usersApi'
import { useMemo, useState } from 'react'
import {dateToString} from '../../App'
import {useNavigate} from 'react-router-dom'

function AddReservation() {
    const {data:users,isLoading:usersLoading}=useGetUsersQuery()
    const {data:rooms,isLoading:roomsLoading}=useGetRoomsQuery()
    const {data:reservations,isLoading:reservationsLoading}=useGetReservationsQuery()
    const [add]=useAddReservationMutation()
    const [user,setUser]=useState(null)
    const [date,setDate]=useState(new Date(''))
    const [nights,setNights]=useState(1)
    const [selectedRoom,setSelectedRoom]=useState(null)
    const [searchedRooms,setSearchedRooms]=useState(rooms)
    const [roomsWithBookedDates,setRoomsWithBookedDates]=useState([])
    const navigate=useNavigate()
    useMemo(()=>{
        if(rooms&&reservations){
            let temp=[]
            for (let i = 0; i < rooms.length; i++) {
                let room = rooms[i]
                var bookedDates=[]
                for (let reservation of reservations) {
                    if(reservation.room==room.id){
                        let date=new Date(reservation.date)
                        for (let j = 0; j <= reservation.nights; j++) {
                            bookedDates.push(new Date(date.getFullYear(),date.getMonth(),date.getDate()+j))
                        }
                    }
                }
                temp.push({...room,bookedDates:bookedDates})
            }
            setSearchedRooms(temp)
            setRoomsWithBookedDates(temp)
        }
    },[rooms,reservations])
    useMemo(()=>{
        if(isNaN(date)){
            setSearchedRooms(rooms)
        }else{
            var bookingDates=[]
            for (let i = 0; i <= nights; i++) {
                bookingDates.push(new Date(date.getFullYear(),date.getMonth(),date.getDate()+i))
            }
            let temp=[]
            for (let room of roomsWithBookedDates) {
                let bookingAndBookedDates=bookingDates.filter(date=>room.bookedDates.map(bookedDate=>bookedDate.getTime()).includes(date.getTime()))
                if(bookingAndBookedDates.length==0){
                    temp.push(room)
                }
            }
            setSearchedRooms(temp)
            if(selectedRoom){
                if(!temp.includes(selectedRoom)){
                    setSelectedRoom(null)
                }
            }
        }
    },[date,nights])
    if(roomsLoading || reservationsLoading || usersLoading || !searchedRooms){
        return <main style={{minHeight:'calc(100vh - 53px)',display:'flex',justifyContent:'center',alignItems:'center'}}>
            <h1>
                Loading...
            </h1>
        </main>
    }
    const changeUser=({target})=>{
        let user=users.find(user=>user.username==target.value)
        if(user){
            setUser(user.id)
        }else{
            setUser(null) 
        }
    }
    const dateValue=()=>{
        try{
            return dateToString(date)
        }catch{
            return ''
        }
    }
    const submitHandler=event=>{
        event.preventDefault()
        if(!selectedRoom){
            alert('Please select a room.')
            return
        }
        add({
            user: user,
            room: selectedRoom.id,
            date: dateToString(date),
            nights: Number(nights),
            is_finaly: false
        }).then(()=>{
            alert('Success')
            navigate('/admin')
        })
    }
    return <main className='add-reservation'>
        <aside className="rooms">
        {searchedRooms.map(room=><div key={room.id} className={selectedRoom==room ? 'room selected' : 'room'}>
                <div>
                    <div>
                        <img src={`/images/rooms/${room.images[0]}`} alt={`room${room.id}`}/>
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
                                <i className='fa fa-heart-o' style={{cursor:"pointer"}}></i>
                                <span>{room.likers.length}</span>
                            </div>
                        </div>
                    </div>
                    <div className='reservation'>
                        {selectedRoom==room ? 
                        <button onClick={()=>setSelectedRoom(null)}>unselect</button> 
                        : 
                        <button onClick={()=>setSelectedRoom(room)}>select</button>}
                    </div>
                </div>
                <p>{room.info}</p>
            </div>)}
        </aside>
        <aside className="more-data">
            <div>
                <form onSubmit={submitHandler}>
                    <input type="text" id="user" list='users' placeholder='Select user' pattern={users.map(user=>user.username).join('|')} required onChange={changeUser}/>
                    <datalist id="users">
                        {users.map(user=><option key={user.id} value={user.username}/>)}
                    </datalist>
                    <input type="date" id='date' min={dateToString(new Date())} value={dateValue()} onChange={event=>setDate(new Date(event.target.value))} required/>
                    <input type="number" min='1' id='nights' value={nights} onChange={event=>setNights(event.target.value)}/>
                    <input type="submit" value="add"/>
                </form>
            </div>
        </aside>
    </main>;
}

export default AddReservation;