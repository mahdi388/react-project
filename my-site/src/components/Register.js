import '../styles/register.scss'
import {useAddUserMutation} from '../redux/services/usersApi'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

function Register({setUser}) {
    const [addUser,{isLoading:isAddingUser}]=useAddUserMutation()
    const navigate=useNavigate()
    const submitHandler=async (event)=>{
        event.preventDefault()
        if(event.target['password'].value!=event.target['repassword'].value){
            alert("The password was not repeated correctly")
            return
        }
        let users=(await axios.get('users/')).data
        if(users.map(i=>i.username).includes(event.target['username'].value)){
            alert("The username is not new.")
            return
        }
        let user={
            username:event.target['username'].value,
            password:event.target['password'].value
        }
        addUser(user).then(({data})=>{
            setUser(data)
            localStorage.setItem('user',JSON.stringify(data))
        })
        navigate(-1)
    }
    return <main className="register">
        <aside>
            <h2>Register</h2>
            <form onSubmit={submitHandler}>
                <input type="text" id='username' placeholder='Enter username' required={true}/>
                <input type="password" id='password' placeholder='Enter password' required={true}/>
                <input type="password" id='repassword' placeholder='Repeat password' required={true}/>
                <input type="submit" value="register" disabled={isAddingUser}/>
            </form>
        </aside>
    </main>;
}

export default Register;