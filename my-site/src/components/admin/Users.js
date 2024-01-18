import "../../styles/admin/users.scss"
import {useGetUsersQuery,useDeleteUserMutation} from '../../redux/services/usersApi'
import {useNavigate} from 'react-router-dom'

function Users() {
    const {data:users,isLoading}=useGetUsersQuery()
    const [remove]=useDeleteUserMutation()
    const navigate=useNavigate()
    if(isLoading){
        return <main style={{minHeight:'calc(100vh - 53px)',display:'flex',justifyContent:'center',alignItems:'center'}}>
            <h1>
                Loading...
            </h1>
        </main>
    }
    return <main className="users">
        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Password</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user=><tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.password}</td>
                    <td>
                        <i className="fa fa-edit" onClick={()=>navigate('/admin/edit-user/'+user.id)}></i>
                    </td>
                    <td>
                        <i className="fa fa-trash" onClick={()=>remove(user.id)}></i>
                    </td>
                </tr>)}
            </tbody>
        </table>
    </main>;
}

export default Users;