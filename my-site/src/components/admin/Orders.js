import "../../styles/reservations.scss"
import {useGetOrdersQuery,useDeleteOrderMutation,useUpdateOrderMutation} from '../../redux/services/ordersApi'
import {useGetFoodsQuery} from '../../redux/services/foodsApi'
import {useGetUsersQuery} from '../../redux/services/usersApi'

function Orders() {
    const {data:allOrders,isLoading:isLoadingOrders}=useGetOrdersQuery()
    const {data:foods,isLoading:isLoadingFoods}=useGetFoodsQuery()
    const {data:users,isLoading:isLoadingUsers}=useGetUsersQuery()
    const [remove]=useDeleteOrderMutation()
    const [update]=useUpdateOrderMutation()
    if(!isLoadingOrders){
        var orders=allOrders.filter(i=>!i.is_finaly).map(i=>{return {...i,date:new Date(i.date)}})
    }
    const changeHandler=({target})=>{
        target.classList.add('hidden')
        document.querySelector(`#food${target.dataset.id} .insert-button`).classList.remove('hidden')
        document.querySelector(`#food${target.dataset.id} .cancel-button`).classList.remove('hidden')
        document.querySelector(`#food${target.dataset.id} input`).classList.remove('hidden')
    }
    const cancelHandler=({target})=>{
        document.querySelector(`#food${target.dataset.id} .change-button`).classList.remove('hidden')
        document.querySelector(`#food${target.dataset.id} .insert-button`).classList.add('hidden')
        document.querySelector(`#food${target.dataset.id} .cancel-button`).classList.add('hidden')
        document.querySelector(`#food${target.dataset.id} input`).classList.add('hidden')
    }
    const changeQty=async ({target})=>{
        let order=orders.find(i=>i.id==target.dataset.id)
        let qty=Number(document.querySelector(`#food${target.dataset.id} input`).value)
        await update({
            ...order,
            qty:qty
        })
        document.querySelector(`#food${target.dataset.id} .change-button`).classList.remove('hidden')
        document.querySelector(`#food${target.dataset.id} .insert-button`).classList.add('hidden')
        document.querySelector(`#food${target.dataset.id} .cancel-button`).classList.add('hidden')
        document.querySelector(`#food${target.dataset.id} input`).classList.add('hidden')
    }
    return <main className="reservations">
        {isLoadingOrders || isLoadingFoods || isLoadingUsers ? 'Loading...' :
            <>
                {orders.length==0 ? <h1>You have not any orders</h1> :
                    <>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{width:'200px'}}>food</th>
                                    <th style={{width:'100px'}}>image</th>
                                    <th style={{width:'100px'}}>user</th>
                                    <th style={{width:'300px'}}>qty</th>
                                    <th style={{width:'70px'}}>price</th>
                                    <th style={{width:'70px'}}>total</th>
                                    <th style={{width:'50px'}}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(i=><tr key={i.id} id={'food'+i.id}>
                                    <td>
                                        <div>
                                            <b>
                                            {foods.find(food=>food.id==i.food).name}
                                            </b>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <img src={`/images/foods/${foods.find(food=>food.id==i.food).images[0]}`}/>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            {users.find(user=>user.id==i.user).username}
                                        </div>
                                    </td>
                                    <td className="qty">
                                        <div>
                                            <div>
                                                <div>{i.qty}</div>
                                                <div>
                                                    <input type="number" className="hidden" defaultValue={i.qty} min="1"/>
                                                </div>
                                            </div>
                                            <div className="buttons">
                                                <button className="change-button" data-id={i.id} onClick={changeHandler}>
                                                    Change
                                                </button>
                                                <button className="insert-button hidden" data-id={i.id} onClick={changeQty}>
                                                    Insert
                                                </button>
                                                <button className="cancel-button hidden" data-id={i.id} onClick={cancelHandler}>
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            {foods.find(food=>food.id==i.food).price}$
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            {i.qty*foods.find(food=>food.id==i.food).price}$
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <i className="fa fa-trash" onClick={()=>remove(i.id)}></i>
                                        </div>
                                    </td>
                                </tr>)}
                            </tbody>
                        </table>
                    </>
                }
            </>
        }
    </main>;
}

export default Orders;