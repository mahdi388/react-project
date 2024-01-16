import '../../styles/admin/login.scss'
import {useGetAdminsQuery} from '../../redux/services/adminsApi'
import {useNavigate} from 'react-router-dom'

function Login({setAdmin}) {
    const {data:admins}=useGetAdminsQuery()
    const navigate=useNavigate()
    const submitHandler=(event)=>{
        event.preventDefault()
        let isUsernameFound=false
        let admin
        for (let i of admins) {
            if(i.username==event.target['username'].value){
                isUsernameFound=true
                admin=i
                break
            }
        }
        if(!isUsernameFound){
            alert("username not found")
            return
        }
        if(admin.password!=event.target['password'].value){
            alert("the password is incorrect")
            return
        }
        alert("you are successfully logged in")
        setAdmin(admin)
        localStorage.setItem('admin',JSON.stringify(admin))
        navigate('/admin')
    }
    return <main className="login">
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