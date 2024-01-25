import '../../styles/rooms.scss'
import {useGetRoomsQuery,useDeleteRoomMutation} from "../../redux/services/roomsApi"
import {Link} from 'react-router-dom'

function Rooms() {
    const {data:rooms,isLoading}=useGetRoomsQuery()
    const [remove]=useDeleteRoomMutation()
    if(isLoading){
        return <main style={{minHeight:'calc(100vh - 53px)',display:'flex',justifyContent:'center',alignItems:'center'}}>
            <h1>
                Loading...
            </h1>
        </main>
    }
    return <main className="rooms">
        <div className="searched-rooms">
            {rooms.map(room=><div key={room.id} className='room'>
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
                        </div>
                    </div>
                    <div className='reservation'>
                        <button><Link to={'/admin/edit-room/'+room.id}>Update</Link></button>
                        <button onClick={()=>remove(room.id)}>Delete</button>
                    </div>
                </div>
                <p>{room.info}</p>
            </div>)}
        </div>
    </main>;
}

export default Rooms;