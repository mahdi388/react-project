import '../../styles/register.scss'
import {useAddAdminMutation} from '../../redux/services/adminsApi'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

function Register() {
    const [addAdmin,{isLoading:isAddingAdmin}]=useAddAdminMutation()
    const navigate=useNavigate()
    const submitHandler=async (event)=>{
        event.preventDefault()
        if(event.target['password'].value!=event.target['repassword'].value){
            alert("The password was not repeated correctly")
            return
        }
        let admins=(await axios.get('admins/')).data
        if(admins.map(i=>i.username).includes(event.target['username'].value)){
            alert("The username is not new.")
            return
        }
        let admin={
            username:event.target['username'].value,
            password:event.target['password'].value,
            manager:event.target['manager'].checked
        }
        addAdmin(admin).then(()=>{
            alert('Success')
            navigate('/admin')
        })
    }
    return <main className="register">
        <aside>
            <h2>Add Admin</h2>
            <form onSubmit={submitHandler}>
                <input type="text" id='username' placeholder='Enter username' required={true}/>
                <input type="password" id='password' placeholder='Enter password' required={true}/>
                <input type="password" id='repassword' placeholder='Repeat password' required={true}/>
                <div className="manager">
                    <label htmlFor="manager">Manager:</label>
                    <input type="checkbox" id="manager"/>
                </div>
                <input type="submit" value="add" disabled={isAddingAdmin}/>
            </form>
        </aside>
    </main>;
}

export default Register;