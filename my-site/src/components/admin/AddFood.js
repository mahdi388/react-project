import "../../styles/admin/add_room.scss"
import {useAddFoodMutation, useGetFoodsQuery} from '../../redux/services/foodsApi'
import {useNavigate} from 'react-router-dom'
import { useMemo, useState } from "react"

function AddFood() {
    const [addFood,{isLoading:isAddingFood}]=useAddFoodMutation()
    const {data:foods}=useGetFoodsQuery()
    const navigate=useNavigate()
    const [images,setImages]=useState([''])
    const [types,setTypes]=useState([])
    useMemo(()=>{
        if (foods) {
            var tempTypes=[]
            for (let food of foods) {
                if(!tempTypes.includes(food.type)){
                    tempTypes.push(food.type)
                }
            }
            setTypes(tempTypes)
        }
    },[foods])
    const submitHandler=async (event)=>{
        event.preventDefault()
        let imgs=images.filter(i=>i.length>0)
        if(imgs.length==0){
            alert('You have not selected a photo.')
            return
        }
        let food={
            name:event.target['name'].value,
            images:imgs,
            type:event.target['type'].value,
            price:Number(event.target['price'].value),
            info:event.target['info'].value
        }
        addFood(food).then(()=>{
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
            <h2>Add Food</h2>
            <form onSubmit={submitHandler}>
                <input type="text" id='name' placeholder='Enter name' required={true} autoComplete="off"/>
                <input type="text" id='type' placeholder='Enter type' required={true} list="types" autoComplete="off"/>
                <input type="number" id='price' placeholder='Enter price' min='1' required={true}/>
                <input type="text" id='info' placeholder='Enter info' autoComplete="off"/>
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
                <input type="submit" value="add" disabled={isAddingFood}/>
            </form>
        </aside>
        <datalist id="types">
            {types.map(type=><option key={type} value={type}/>)}
        </datalist>
    </main>;
}

export default AddFood;