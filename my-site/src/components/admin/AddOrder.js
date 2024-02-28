import '../../styles/admin/add_room.scss'
import {useGetFoodsQuery} from '../../redux/services/foodsApi'
import {useGetOrdersQuery,useAddOrderMutation} from '../../redux/services/ordersApi'
import {useGetUsersQuery} from '../../redux/services/usersApi'
import { useMemo, useState } from 'react'
import {useNavigate} from 'react-router-dom'

function AddOrder() {
    const {data:users,isLoading:usersLoading}=useGetUsersQuery()
    const {data:foods,isLoading:foodsLoading}=useGetFoodsQuery()
    const {data:orders,isLoading:ordersLoading}=useGetOrdersQuery()
    const [add]=useAddOrderMutation()
    const navigate=useNavigate()
    if(foodsLoading || ordersLoading || usersLoading ){
        return <main style={{minHeight:'calc(100vh - 53px)',display:'flex',justifyContent:'center',alignItems:'center'}}>
            <h1>
                Loading...
            </h1>
        </main>
    }
    const submitHandler=event=>{
        event.preventDefault()
        let userId=users.find(user=>user.username==event.target['user'].value).id
        let foodId=foods.find(food=>`${food.name} - ${food.price}$`==event.target['food'].value).id
        add({
            user: userId,
            food: foodId,
            qty: Number(event.target['qty'].value),
            is_finaly: false
        }).then(()=>{
            alert('Success')
            navigate('/admin')
        })
    }
    return <main className="add-room">
        {console.log(foods.map(food=>`${food.name} - ${food.price}\$`).join('|'))}
        <aside>
            <h2>Add Order</h2>
            <form onSubmit={submitHandler}>
                <input type="text" id="user" list='users' placeholder='Select user' pattern={users.map(user=>user.username).join('|')} required autoComplete='off'/>
                <input type="text" id="food" list='foods' placeholder='Select food' pattern={foods.map(food=>`${food.name} - ${food.price}\\$`).join('|')} required autoComplete='off'/>
                <input type="number" id='qty' placeholder='Enter qty' required min='1'/>
                <input type="submit" value="add"/>
            </form>
        </aside>
        <datalist id="users">
            {users.map(user=><option key={user.id} value={user.username}/>)}
        </datalist>
        <datalist id="foods">
            {foods.map(food=><option key={food.id} value={`${food.name} - ${food.price}$`}/>)}
        </datalist>
    </main>;
}

export default AddOrder;