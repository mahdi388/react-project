import {useGetRoomQuery,useLikeRoomMutation} from "../redux/services/roomsApi"
import {useNavigate,useParams} from 'react-router-dom'
import '../styles/room.scss'
import { useState } from "react"
import {useGetReservationsByRoomQuery,useAddReservationMutation} from "../redux/services/reservationsApi"

function Room({user,pdate,pnights}) {
    const params=useParams()
    const {data:room,isSuccess,isError}=useGetRoomQuery(params.id)
    const {data:reservations}=useGetReservationsByRoomQuery(params.id)
    const [like]=useLikeRoomMutation()
    const [reserve]=useAddReservationMutation()
    const navigate=useNavigate()
    const [showImages,setShowImages]=useState(false)
    const [imageNumber,setImageNumber]=useState(0)
    const [date,setDate]=useState(pdate)
    const [nights,setNights]=useState(pnights)
    const likeHandler=()=>{
        try {
            if(room.likers.includes(user.id)){
                like({
                    id:room.id,
                    likers:room.likers.filter(id=>id!=user.id)
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
    if(isError){
        navigate('/not-found')
    }
    const changeDate=event=>{
        setDate(new Date(event.target.value))
    }
    const changeNights=event=>{
        setNights(event.target.value)
    }
    const reserveHandler=()=>{
        if(user!=null) {
            if(isNaN(date)){
                document.getElementById('date').setCustomValidity('Please enter date.')
                document.getElementById('date').reportValidity()
            }else{
                var bookedDates=[]
                for (let i of reservations) {
                    let date=new Date(i.date)
                    for (let j = 0; j <= i.nights; j++) {
                        bookedDates.push(new Date(date.getFullYear(),date.getMonth(),date.getDate()+j))
                    }
                }
                var bookingDates=[]
                for (let i = 0; i <= Number(nights); i++) {
                    bookingDates.push(new Date(date.getFullYear(),date.getMonth(),date.getDate()+i))
                }
                var bookingAndBookedDates=bookingDates.filter(date=>bookedDates.map(bookedDate=>bookedDate.getTime()).includes(date.getTime()))
                if(bookingAndBookedDates.length>0){
                    alert("This room is reserved on these dates:\n"+bookingAndBookedDates.map(date=>`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`).join('\n'))
                }else{
                    reserve({
                        "user": user.id,
                        "room": Number(params.id),
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
    }
    const dateValue=()=>{
        try{
            return date.toISOString().slice(0,10)
        }
        catch{
            return ''
        }
    }
    return <main id="room">
        {isSuccess && <>
            <div className='room'>
                <div>
                    <div>
                        <img src={`/images/rooms/${room.images[0]}`} onClick={()=>setShowImages(true)}/>
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
                                <i className={user && room.likers.includes(user.id) ? 'fa fa-heart' : 'fa fa-heart-o' } style={{cursor:"pointer"}} onClick={likeHandler}></i>
                                <span>{room.likers.length}</span>
                            </div>
                        </div>
                    </div>
                    <div className='reservation'>
                        <div>
                            <label htmlFor="date">Date: </label>
                            <input type="date" id="date" value={dateValue()} min={new Date().toISOString().slice(0,10)} onChange={changeDate}/>
                        </div>
                        <div>
                            <label htmlFor="nights">Nights: </label>
                            <input type="number" id="nights" min="1" value={nights} onChange={changeNights}/>
                        </div>
                        <button onClick={reserveHandler}>Reserve</button>
                    </div>
                </div>
                <p>{room.info}</p>
            </div>
            <aside className="images" style={showImages ? {visibility:'visible'} : {visibility:'hidden'}}>
                <i className="fa fa-close" onClick={()=>setShowImages(false)}></i>
                <div className="current-image">
                    <img src={`/images/rooms/${room.images[imageNumber]}`}/>
                </div>
                <div className="image-list">
                    {room.images.map(img=><img key={room.images.indexOf(img)} src={`/images/rooms/${img}`} onClick={()=>setImageNumber(room.images.indexOf(img))}/>)}
                </div>
            </aside>
        </>}
    </main>
}

export default Room;