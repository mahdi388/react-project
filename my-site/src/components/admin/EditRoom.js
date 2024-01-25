import "../../styles/admin/add_room.scss"
import {useUpdateRoomMutation,useGetRoomQuery} from '../../redux/services/roomsApi'
import {useNavigate,useParams} from 'react-router-dom'
import axios from 'axios'
import { useState } from "react"

function EditRoom() {
    const [updateRoom,{isLoading:isUpdatingRoom}]=useUpdateRoomMutation()
    const navigate=useNavigate()
    const [images,setImages]=useState([''])
    const [isSetImages,setIsSetImages]=useState(true)
    const params=useParams()
    const {data:room,isLoading}=useGetRoomQuery(params.id)
    const submitHandler=async (event)=>{
        event.preventDefault()
        let imgs=images.filter(i=>i.length>0)
        if(imgs.length==0){
            alert('You have not selected a photo.')
            return
        }
        let changedRoom={
            id:params.id,
            images:imgs,
            capacity:Number(event.target['capacity'].value),
            price:Number(event.target['price'].value),
            info:event.target['info'].value,
            likers:room.likers
        }
        updateRoom(changedRoom).then(()=>{
            alert('Success')
            navigate('/admin')
        })
    }
    const changeImage=({target})=>{
        setImages(images.map((img,index)=>index!=target.dataset.number ? img:target.value))
    }
    const deleteImage=num=>{
        setImages(images.filter((img,index)=>index!=num))
    }
    if(isLoading){
        return <main style={{minHeight:'calc(100vh - 53px)',display:'flex',justifyContent:'center',alignItems:'center'}}>
            <h1>
                Loading...
            </h1>
        </main>
    }
    const setRoomImages=()=>{
        setImages(room.images)
        setIsSetImages(false)
    }
    return <main className="add-room">
        {(images!=room.images && isSetImages) && setRoomImages()}
        <aside>
            <h2>Edit Room</h2>
            <form onSubmit={submitHandler}>
                <input type="number" id='capacity' placeholder='Enter capacity' required={true} min='1' defaultValue={room.capacity}/>
                <input type="number" id='price' placeholder='Enter price' required={true} min='1' defaultValue={room.price}/>
                <input type="text" id='info' placeholder='Enter info' defaultValue={room.info}/>
                <aside id="images">
                    {images.map((img,index)=>
                        <div className="image" key={index}>
                            <input type="text" name="image" data-number={index} value={img} onChange={changeImage}/>
                            <button type="button">
                                <i className="fa fa-close" data-number={index} onClick={()=>deleteImage(index)}></i>
                            </button>
                        </div>
                    )}
                    <button type="button" id="add-image" onClick={()=>setImages(images.concat(''))}>
                        <i className="fa fa-plus"></i>
                    </button>
                </aside>
                <input type="submit" value="change" disabled={isUpdatingRoom}/>
            </form>
        </aside>
    </main>;
}

export default EditRoom;