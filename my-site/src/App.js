import "./styles/main.scss"
import { useState } from "react";
import ad1 from "./images/ad1.jpg"
import {Routes,Route,Link,Navigate} from 'react-router-dom'
import Register from "./components/Register";
import Login from "./components/Login";
import NotFound from "./components/NotFound";

function App() {
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
  const logout=()=>{
    localStorage.setItem('user',null)
    setUser(null)
    alert("you are successfully logged out")
  }
  return <>
    <header>
      <nav>
        <ul>
          <li className="home"><b><Link to="/">Home</Link></b></li>
          <li>search rooms</li>
          <li>search food</li>
          {user && <li>reservation | 0$</li>}
        </ul>
        <ul>
          {user ? 
            <><li>Welcome {user.username}</li><li onClick={logout}>log out</li></>
            :
            <><li><Link to="/login">sing in</Link></li><li><Link to="/register">sign up</Link></li></>
          }
        </ul>
      </nav>
    </header>
    <Routes>
      <Route path="/" element={<>Home</>}></Route>
      <Route path="/register" element={<Register setUser={setUser}/>}></Route>
      <Route path="/login" element={<Login setUser={setUser}/>}></Route>
      <Route path="/not-found" element={<NotFound/>}></Route>
      <Route path="/*" element={<Navigate to="/not-found"/>}></Route>
    </Routes>
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