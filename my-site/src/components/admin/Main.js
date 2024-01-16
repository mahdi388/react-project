import "../../styles/admin/main.scss"
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import Login from "./Login";
import AddAdmin from "./AddAdmin";
import { useEffect, useState } from "react";

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
                                        Home
                                    </b>
                                </div>
                            </li>
                            <li onMouseEnter={openUl} onMouseLeave={closeUl} onTouchEnd={openCloseUl}>
                                <div>users</div>
                                <ul>
                                    <li>list</li>
                                    <li>add user</li>
                                    <li><Link to='/admin/add-admin'>add admin</Link></li>
                                </ul>
                            </li>
                            <li onMouseEnter={openUl} onMouseLeave={closeUl} onTouchEnd={openCloseUl}>
                                <div>rooms</div>
                                <ul>
                                    <li>list</li>
                                    <li>add room</li>
                                </ul>
                            </li>
                            <li onMouseEnter={openUl} onMouseLeave={closeUl} onTouchEnd={openCloseUl}>
                                <div>reservation</div>
                                <ul>
                                    <li>list</li>
                                    <li>add</li>
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
                        <li onClick={logout}>
                            <div>
                                log out
                            </div>
                        </li>
                    </ul>
                </nav>
            </header>
        }
        <Routes>
            <Route path="/login" element={<Login setAdmin={setAdmin}/>}></Route>
            <Route path="/add-admin" element={<AddAdmin/>}></Route>
        </Routes>
    </>;
}

export default AdminMain;