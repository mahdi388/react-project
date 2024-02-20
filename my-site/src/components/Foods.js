import '../styles/foods.scss'
import {useGetFoodsQuery} from '../redux/services/foodsApi'
import { useMemo, useState } from 'react'
import {Link} from 'react-router-dom'

function Foods() {
    const {data:foods,isLoading}=useGetFoodsQuery()
    const [searchedFoods,setSearchedFoods]=useState([])
    const [types,setTypes]=useState([])
    const [search,setSearch]=useState('')
    const [filters,setFilters]=useState([])
    useMemo(()=>{
        if(foods){
            setSearchedFoods(foods)
            var tempTypes=[]
            for (let food of foods) {
                if(!tempTypes.includes(food.type)){
                    tempTypes.push(food.type)
                }
            }
            setTypes(tempTypes)
        }
    },[foods])
    useMemo(()=>{
        if(foods){
            if(search=='' && filters.length==0){
                setSearchedFoods(foods)
            }else if(search!='' && filters.length==0){
                let temp=[]
                for (let food of foods) {
                    if(food.name.toLowerCase().includes(search.toLowerCase())){
                        temp.push(food)
                    }
                }
                setSearchedFoods(temp)
            }else if(search=='' && filters.length!=0){
                let temp=[]
                for (let food of foods) {
                    for (let filter of filters) {
                        if(food.type==filter){
                            temp.push(food)
                            break
                        }
                    }
                }
                setSearchedFoods(temp)
            }else{
                let temp=[]
                for (let food of foods) {
                    for (let filter of filters) {
                        if(food.type==filter && food.name.toLowerCase().includes(search.toLowerCase())){
                            temp.push(food)
                            break
                        }
                    }
                }
                setSearchedFoods(temp)
            }
        }
    },[search,filters])
    const filterHandler=type=>{
        if(filters.includes(type)){
            setFilters(filters.filter(filter=>filter!=type))
        }else{
            setFilters(filters.concat(type))
        }
    }
    if(isLoading){
        return <main style={{minHeight:'calc(100vh - 53px)',display:'flex',justifyContent:'center',alignItems:'center'}}>
            <h1>
                Loading...
            </h1>
        </main>
    }
    return <main className="foods">
        <aside className="foods">
            {searchedFoods.length==0 && <h1>Food not found</h1>}
            {searchedFoods.map(food=><div key={food.id}>
                <Link to={'/foods/'+food.id}>
                    <img src={'/images/foods/'+food.images[0]} alt={food.name} />
                </Link>
                <div>
                    <h3>{food.name}</h3>
                    <div>
                        <span>#{food.type}</span>
                        <span>{food.price}$</span>
                    </div>
                </div>
            </div>)}
        </aside>
        <aside className="search">
            <input type="text" placeholder='search' value={search} onChange={(event)=>setSearch(event.target.value)}/>
            <aside className="filter">
                {types.map(type=><button key={type} id={type} onClick={()=>filterHandler(type)} style={filters.includes(type) ? {background:'#ccc'}:{}}>{type}</button>)}
            </aside>
        </aside>
    </main>;
}

export default Foods;