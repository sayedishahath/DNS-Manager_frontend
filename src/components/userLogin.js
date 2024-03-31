import axios from 'axios'
import { useState } from 'react'
import _ from 'lodash'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../context/userContext';
export default function Login(props){
    const navigate = useNavigate()
    const { dispatch } = useUserContext();
    const [email,setEmail]=useState('')
    const [password, setPassword] = useState('')
    const [loggedInUser,setLoggedInUser] = useState(null)
    const [formError,setFormError] =useState({})
    const [serverError,setServerError] = useState({
        email:'',
        password:'',
    })
    const errors ={}

    const validateErrors =()=>{
        if(email.trim().length===0){
            errors.email = 'email is required'
        }
        if(password.trim().length === 0){
            errors.password = 'password is required'
        }
    }
    const handleLogin =async(e)=>{
        e.preventDefault()
        const formData={
            email:email,
            password:password
        }
        validateErrors()
        if(_.isEmpty(errors)){
            try{
                const response = await axios.post('https://dns-manager-x1h3.onrender.com/api/login',formData)
                console.log(response.data)
                console.log(response.data.data)
                setLoggedInUser(response.data.data)
                const token = response.data.token
                localStorage.setItem('token',token)
                alert('login success')
                props.loginSuccess()
                setEmail('')
                setPassword('')
                setServerError("")
                dispatch({ type: 'LOGIN' }); // Dispatch login action
                navigate('/hostedZone')
            }catch(err){
                alert(err)
                const errors = err.response.data.error
                console.log(serverError)
                setServerError(errors)
                setFormError({})
            }
        }else{
            setFormError(errors)
            setServerError("")
            console.log(formError)
        }
    }
    return(
        <div>
            <h2>Login</h2>
            <div className='row justify-content-center'>
            <div className='col-md-4'>
            
            <form onSubmit={handleLogin}>
                <div className='form-group'>
                <label className='form-label'htmlFor='email'>email:</label>
                <input
                type="text"
                value={email}
                id="email"
                onChange={(e)=>{
                    setEmail(e.target.value)
                }} 
                className={'form-control' + (formError.email || serverError.email ?  ' is-invalid' : '')}/>
                {formError.email&&<span className='invalid-feedback'>{formError.email}</span>}
                </div>
                <div className='form-group'></div>
                <label className='form-label' htmlFor='password'>password:</label>
                <input
                type="password"
                value={password}
                id="password"
                onChange={(e)=>{
                    setPassword(e.target.value)
                }} 
                className={'form-control' + (formError.password ||serverError.password?  ' is-invalid' : '')}/>
                {formError.password&&<span className='invalid-feedback'>{formError.password}</span>}
                <input type="submit" value="Login" className='btn btn-primary' />
            </form></div>
            </div>
            <hr/>
        </div>
    )
}