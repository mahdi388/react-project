import '../styles/register.scss'
import {useGetUsersQuery} from '../redux/services/usersApi'
import {useNavigate} from 'react-router-dom'

function Login({setUser}) {
    const {data:users}=useGetUsersQuery()
    const navigate=useNavigate()
    const submitHandler=(event)=>{
        event.preventDefault()
        let isUsernameFound=false
        let user
        for (let i of users) {
            if(i.username==event.target['username'].value){
                isUsernameFound=true
                user=i
                break
            }
        }
        if(!isUsernameFound){
            alert("username not found")
            return
        }
        if(user.password!=event.target['password'].value){
            alert("the password is incorrect")
            return
        }
        alert("you are successfully logged in")
        setUser(user)
        localStorage.setItem('user',JSON.stringify(user))
        navigate('/')
    }
    return <main className="register">
        <aside>
            <h2>Login</h2>
            <form onSubmit={submitHandler}>
                <input type="text" id='username' placeholder='Enter username' required={true}/>
                <input type="password" id='password' placeholder='Enter password' required={true}/>
                <input type="submit" value="log in"/>
            </form>
        </aside>
    </main>;
}

export default Login;