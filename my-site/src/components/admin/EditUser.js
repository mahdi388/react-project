import '../../styles/register.scss'
import {useUpdateUserMutation,useGetUserQuery} from '../../redux/services/usersApi'
import {useNavigate,useParams} from 'react-router-dom'
import axios from 'axios'

function EditUser() {
    const [updateUser,{isLoading:isUpdatingUser}]=useUpdateUserMutation()
    const navigate=useNavigate()
    const params=useParams()
    const {data:user,isLoading}=useGetUserQuery(params.id)
    const submitHandler=async (event)=>{
        event.preventDefault()
        let users=(await axios.get('users/')).data
        if(users.map(i=>i.username).includes(event.target['username'].value) && user.username!=event.target['username'].value){
            alert("The username is not new.")
            return
        }
        let editedUser={
            id:user.id,
            username:event.target['username'].value,
            password:event.target['password'].value
        }
        updateUser(editedUser).then(()=>{
            alert('Success')
            navigate('/admin')
        })
    }
    if(isLoading){
        return <main style={{minHeight:'calc(100vh - 53px)',display:'flex',justifyContent:'center',alignItems:'center'}}>
            <h1>
                Loading...
            </h1>
        </main>
    }
    return <main className="register">
        <aside>
            <h2>Edit User</h2>
            <form onSubmit={submitHandler}>
                <input type="text" id='username' placeholder='Enter username' required={true} defaultValue={user.username}/>
                <input type="text" id='password' placeholder='Enter password' required={true} defaultValue={user.password}/>
                <input type="submit" value="register" disabled={isUpdatingUser}/>
            </form>
        </aside>
    </main>;
}

export default EditUser;