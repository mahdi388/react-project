import { useParams } from "react-router-dom"; 
import {useGetFoodQuery} from "../redux/services/foodsApi"
import {useAddOrderMutation} from "../redux/services/ordersApi"
import '../styles/food.scss'
import { useState } from "react";

function Food({user,getOrdersPrice}) {
    const params=useParams()
    const {data:food,isLoading}=useGetFoodQuery(params.id)
    const [add]=useAddOrderMutation()
    const [showImages,setShowImages]=useState(false)
    const [imageNumber,setImageNumber]=useState(0)
    const [qty,setQty]=useState(1)
    const orderHandler=()=>{
        if(qty<1){
            alert('Qty must be bigger then zero.')
        }else if(user==null){
            alert("You aren't login.")
        }else{
            add({
                "user":user.id,
                "food":food.id,
                "qty":qty,
                "is_finaly":false
            }).then(()=>{
                alert('Your food has been successfully ordered. Go to the booking page to finalize.')
                getOrdersPrice()
            })
        }
    }
    if(isLoading){
        return <main style={{display:"flex",justifyContent:"center",alignItems:"center",fontSize:'20px'}}>
            <h1>Loading...</h1>
        </main>
    }
    return <main id="food">
        <div className='food'>
            <h1>{food.name}</h1>
            <div className="info">
                <div>
                    <img src={`/images/foods/${food.images[0]}`} onClick={()=>setShowImages(true)}/>
                    <div className="more-info">
                        <div>
                            <i className='fa fa-hashtag'></i>
                            <span>{food.type}</span>
                        </div>
                        <div>
                            <i className='fa fa-dollar'></i>
                            <span>{food.price}$</span>
                        </div>
                    </div>
                </div>
                <div className='reservation'>
                    <div>
                        <label htmlFor="qty">Qty: </label>
                        <input type="number" id="qty" min="1" value={qty} onChange={event=>setQty(Number(event.target.value))}/>
                    </div>
                    <button onClick={orderHandler}>Reserve</button>
                </div>
            </div>
            <p>{food.info}</p>
        </div>
        <aside className="images" style={showImages ? {visibility:'visible'} : {visibility:'hidden'}}>
            <i className="fa fa-close" onClick={()=>setShowImages(false)}></i>
            <div className="current-image">
                <img src={`/images/foods/${food.images[imageNumber]}`}/>
            </div>
            <div className="image-list">
                {food.images.map(img=><img key={food.images.indexOf(img)} src={`/images/foods/${img}`} onClick={()=>setImageNumber(food.images.indexOf(img))}/>)}
            </div>
        </aside>
    </main>;
}

export default Food;