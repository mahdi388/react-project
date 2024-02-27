import '../../styles/admin/foods.scss'
import {useGetFoodsQuery,useDeleteFoodMutation} from "../../redux/services/foodsApi"
import {Link} from 'react-router-dom'

function Foods() {
    const {data:foods,isLoading}=useGetFoodsQuery()
    const [remove]=useDeleteFoodMutation()
    if(isLoading){
        return <main style={{minHeight:'calc(100vh - 53px)',display:'flex',justifyContent:'center',alignItems:'center'}}>
            <h1>
                Loading...
            </h1>
        </main>
    }
    return <main className="foods">
        <div>
            {foods.map(food=><div key={food.id} className='food'>
                <h2>{food.name}:</h2>
                <div>
                    <div>
                        <img src={`/images/foods/${food.images[0]}`}/>
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
                        <button><Link to={'/admin/edit-food/'+food.id}>Update</Link></button>
                        <button onClick={()=>remove(food.id)}>Delete</button>
                    </div>
                </div>
                <p>{food.info}</p>
            </div>)}
        </div>
    </main>;
}

export default Foods;