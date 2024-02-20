import "./styles/main.scss"
import { useEffect, useState, createContext} from "react";
import ad1 from "./images/ad1.jpg"
import {Routes,Route,Link,Navigate,useNavigate} from 'react-router-dom'
import Register from "./components/Register";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import Rooms from "./components/Rooms";
import Reservations from "./components/Reservations";
import axios from 'axios'
import Reserving from "./components/Reserving";
import Main from "./components/Main";
import Foods from "./components/Foods";

export const reservationsPriceContext=createContext()
export const dateToString=d=>`${d.getFullYear()}-${("0" +(d.getMonth()+1)).slice(-2)}-${("0" + d.getDate()).slice(-2)}`

function App() {
  var [reservationsPrice,setReservationsPrice]=useState(0)
  var navigate=useNavigate()
  let localStorageHandler=()=>{
    const localStorageUser=JSON.parse(localStorage.getItem('user'))
    if(localStorageUser){
      if(localStorageUser=="null"){
        return null
      }
      return localStorageUser
    }
    localStorage.setItem('user',null)
    return null
  }
  const [user,setUser]=useState(localStorageHandler())
  const getReservationsPrice=()=>{
    if(user){
      let reservationsPrice=0
      axios.get(`reservations?user=${user.id}&is_finaly=false`)
      .then(res=>res.data)
      .then(async reservations=>{
        for (let i of reservations) {
          await axios.get('rooms/'+i.room)
          .then(res=>res.data)
          .then(room=>reservationsPrice+=room.price*i.nights)
        }
      })
      .then(()=>setReservationsPrice(reservationsPrice))
    }
  }
  useEffect(getReservationsPrice,[user])
  const logout=()=>{
    localStorage.setItem('user',null)
    setUser(null)
    alert("you are successfully logged out")
    navigate(0)
  }
  return <>
    <header>
      <nav>
        <ul>
          <li className="home"><b><Link to="/">Home</Link></b></li>
          <li><Link to="/rooms">search rooms</Link></li>
          <li><Link to="/foods">search foods</Link></li>
          {<li><Link to="/reservations">reservation{user && ` | ${reservationsPrice}$`}</Link></li>}
        </ul>
        <ul>
          {user ? 
            <><li className="welcome">Welcome {user.username}</li><li onClick={logout}>log out</li></>
            :
            <><li><Link to="/login">sing in</Link></li><li><Link to="/register">sign up</Link></li></>
          }
        </ul>
      </nav>
    </header>
    <reservationsPriceContext.Provider value={getReservationsPrice}>
      <Routes>
        <Route path="/" element={<Main/>}></Route>
        <Route path="/register" element={<Register setUser={setUser}/>}></Route>
        <Route path="/login" element={<Login setUser={setUser}/>}></Route>
        <Route path="/rooms/*" element={<Rooms user={user}/>}></Route>
        <Route path="/not-found" element={<NotFound/>}></Route>
        <Route path="/reservations" element={<Reservations user={user}/>}></Route>
        <Route path="/reserving" element={<Reserving user={user}/>}></Route>
        <Route path="/foods/*" element={<Foods/>}></Route>
        <Route path="/*" element={<Navigate to="/not-found"/>}></Route>
      </Routes>
    </reservationsPriceContext.Provider>
    <footer>
      <div className="concat-us">
        <div>Contact us</div>
        <ul>
          <li>Address: Hamedan Iran</li>
          <li>Emali: aria@hotel.com</li>
          <li>Phone: 09181111111</li>
        </ul>
      </div>
      <div className="adds">
        <div>
          <img src={ad1} alt="add"/>
          <div>Lorem, ipsum.</div>
        </div>
        <div>
          <img src={ad1} alt="add"/>
          <div>Lorem, ipsum.</div>
        </div>
      </div>
    </footer>
  </>;
}

export default App;