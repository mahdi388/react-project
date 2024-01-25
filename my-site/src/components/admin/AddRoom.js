import "../../styles/admin/add_room.scss"
import {useAddRoomMutation} from '../../redux/services/roomsApi'
import {useNavigate} from 'react-router-dom'
import { useState } from "react"

function AddRoom() {
    const [addRoom,{isLoading:isAddingRoom}]=useAddRoomMutation()
    const navigate=useNavigate()
    const [images,setImages]=useState([''])
    const submitHandler=async (event)=>{
        event.preventDefault()
        let imgs=images.filter(i=>i.length>0)
        if(imgs.length==0){
            alert('You have not selected a photo.')
            return
        }
        let room={
            images:imgs,
            capacity:Number(event.target['capacity'].value),
            price:Number(event.target['price'].value),
            info:event.target['info'].value,
            likers:[]
        }
        addRoom(room).then(()=>{
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
    return <main className="add-room">
        <aside>
            <h2>Add Room</h2>
            <form onSubmit={submitHandler}>
                <input type="number" id='capacity' placeholder='Enter capacity' required={true} min='1'/>
                <input type="number" id='price' placeholder='Enter price' required={true} min='1'/>
                <input type="text" id='info' placeholder='Enter info'/>
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
                <input type="submit" value="add" disabled={isAddingRoom}/>
            </form>
        </aside>
    </main>;
}

export default AddRoom;