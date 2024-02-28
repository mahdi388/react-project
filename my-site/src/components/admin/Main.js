import "../../styles/admin/main.scss"
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import Login from "./Login";
import AddAdmin from "./AddAdmin";
import { useEffect, useState } from "react";
import AddUser from "./AddUser";
import Users from "./Users";
import EditUser from "./EditUser";
import AddRoom from "./AddRoom";
import Rooms from "./Rooms";
import EditRoom from "./EditRoom";
import AddReservation from "./AddReservation";
import Reservations from "./Reservations";
import PaymentCheck from "./PaymentCheck";
import NotFound from "../NotFound";
import AddFood from "./AddFood";
import Foods from "./Foods";
import EditFood from "./EditFood";
import Orders from "./Orders";
import AddOrder from "./AddOrder";

function AdminMain() {
    var navigate=useNavigate()
    useEffect(() => {
        if(!admin){
            navigate('/admin/login')
        }
        document.getElementById('root').setAttribute('class', 'admin')
    }, [])
    let localStorageHandler = () => {
        const localStorageAdmin = JSON.parse(localStorage.getItem('admin'))
        if (localStorageAdmin) {
            if (localStorageAdmin == "null") {
                return null
            }
            return localStorageAdmin
        }
        localStorage.setItem('admin', null)
        return null
    }
    const [admin, setAdmin] = useState(localStorageHandler())
    const logout=()=>{
        localStorage.setItem('admin',null)
        setAdmin(null)
        alert("you are successfully logged out")
        navigate(0)
    }
    const openUl=event=>{
        event.currentTarget.lastElementChild.style.visibility='visible'
    }
    const closeUl=event=>{
        event.currentTarget.lastElementChild.style.visibility='hidden'
    }
    const openCloseUl=event=>{
        if(event.currentTarget.lastElementChild.style.visibility=='visible'){
            closeUl(event)
        }else{
            openUl(event)
        }
    }
    return <>
        {admin && 
            <header>
                <nav>
                    <ul>
                        {admin.manager ? <>
                            <li className="home">
                                <div>
                                    <b>
                                        <Link to="/admin">Home</Link>
                                    </b>
                                </div>
                            </li>
                            <li onMouseEnter={openUl} onMouseLeave={closeUl} onTouchEnd={openCloseUl}>
                                <div>users</div>
                                <ul>
                                    <li><Link to='/admin/users'>list</Link></li>
                                    <li><Link to='/admin/add-user'>add user</Link></li>
                                    <li><Link to='/admin/add-admin'>add admin</Link></li>
                                </ul>
                            </li>
                            <li onMouseEnter={openUl} onMouseLeave={closeUl} onTouchEnd={openCloseUl}>
                                <div>rooms</div>
                                <ul>
                                    <li><Link to="rooms">list</Link></li>
                                    <li><Link to="add-room">add room</Link></li>
                                </ul>
                            </li>
                            <li onMouseEnter={openUl} onMouseLeave={closeUl} onTouchEnd={openCloseUl}>
                                <div>foods</div>
                                <ul>
                                    <li><Link to="/admin/foods">list</Link></li>
                                    <li><Link to="/admin/add-food">add food</Link></li>
                                </ul>
                            </li>
                            <li onMouseEnter={openUl} onMouseLeave={closeUl} onTouchEnd={openCloseUl}>
                                <div>reservations</div>
                                <ul>
                                    <li><Link to="/admin/reservations">list</Link></li>
                                    <li><Link to="/admin/add-reservation">add</Link></li>
                                </ul>
                            </li>
                            <li onMouseEnter={openUl} onMouseLeave={closeUl} onTouchEnd={openCloseUl}>
                                <div>orders</div>
                                <ul>
                                    <li><Link to="/admin/orders">list</Link></li>
                                    <li><Link to="/admin/add-order">add</Link></li>
                                </ul>
                            </li>
                        </> : <>
                            <li className="home">
                                <div>
                                    <b>Home</b>
                                </div>
                            </li>
                        </>}
                    </ul>
                    <ul>
                        <li className="welcome">
                            <div>
                                Welcome {admin.username}
                            </div>
                        </li>
                        <li style={{cursor:'pointer'}} onClick={logout}>
                            <div>
                                log out
                            </div>
                        </li>
                    </ul>
                </nav>
            </header>
        }
        <Routes>
            <Route path="/"></Route>
            <Route path="/login" element={<Login setAdmin={setAdmin}/>}></Route>
            <Route path="/add-admin" element={<AddAdmin/>}></Route>
            <Route path="/add-user" element={<AddUser/>}></Route>
            <Route path="/users" element={<Users/>}></Route>
            <Route path="/edit-user/:id" element={<EditUser/>}></Route>
            <Route path="/add-room" element={<AddRoom/>}></Route>
            <Route path="/rooms" element={<Rooms/>}></Route>
            <Route path="/edit-room/:id" element={<EditRoom/>}></Route>
            <Route path="/add-food" element={<AddFood/>}></Route>
            <Route path="/foods" element={<Foods/>}></Route>
            <Route path="/edit-food/:id" element={<EditFood/>}></Route>
            <Route path="/add-reservation" element={<AddReservation/>}></Route>
            <Route path="/reservations" element={<Reservations/>}></Route>
            <Route path="/orders" element={<Orders/>}></Route>
            <Route path="/add-order" element={<AddOrder/>}></Route>
            <Route path="/payments" element={<PaymentCheck/>}></Route>
            <Route path="/not-found" element={<NotFound/>}></Route>
            <Route path="/*" element={<Navigate to="/not-found"/>}></Route>
        </Routes>
    </>;
}

export default AdminMain;