import axios from 'axios'
import {useState} from  'react'
import _ from 'lodash'
import { useNavigate ,Link } from 'react-router-dom'
export default function Register(){
    const navigate =useNavigate()
    const [loading,setLoading] = useState(false)
    const [name,setName] =useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword] =useState('')
    const [serverError,setServerError] = useState({
        name:'',
        email:'',
        password:'',
    })

    const [formError,setFormError]=useState({})
    const errors = {}
    const validateErrors =()=>{
        if(name.trim().length === 0){
            errors.name = 'name is required'
        }
        if(email.trim().length===0){
            errors.email = 'email is required'
        }
        if(password.trim().length === 0){
            errors.password = 'password is required'
        }
    }

    const handleSubmit =async (e)=>{
        e.preventDefault()
        const formData = {
            userName:name,
            email:email,
            password:password,
        }
        validateErrors()
        setLoading(true)
        if(_.isEmpty(errors)){
            try{
                const response =await axios.post('https://dns-manager-x1h3.onrender.com/api/register',formData)
                console.log(response.data)
                alert('registered succesfully')
                setLoading(false)
                setFormError({})
                setServerError({
                    name:'',
                    email:'',
                    password:'',
                })
                setName('')
                setEmail('')
                setPassword('')
                navigate('/login')
            }catch(err){
                // alert(err.message)
                // console.log(err)
                const errors = err.response.data.error
                const serverErrors= {}
                serverErrors.name=errors.find((e)=>{
                    return e.path ==='userName'
                })
                serverErrors.email=errors.find((e)=>{
                    return e.path==='email'
                })
                serverErrors.password=errors.find((e)=>{
                    return e.path==='password'
                })
                console.log(serverError)
                setServerError(serverErrors)
                setFormError({})
                setLoading(false)
            }   
        }else{
            setFormError(errors)
            setServerError({
                name:'',
                email:'',
                password:'',
            })
            console.log(formError)
        }
    }
    
    return(
        
        <div className='row justify-content-center' >
            {loading?<div className="loader justify-content-center">
                <img src="./loader.gif" alt="loading..."/>
            </div>:
            <div className='col-md-4'>
            <h3>Sign Up Here!</h3>
            
            <form onSubmit ={handleSubmit}>
                <div className='form-group'>
                <label className='form-label' htmlFor="name">Name:</label>
                <input 
                type="text"
                value={name}
                onChange={(e)=>{
                    setName(e.target.value)
                }} 
                className={'form-control' + (formError.name ||serverError.name ?  ' is-invalid' : '')}/>
                {formError.name&&<span className='invalid-feedback'>{formError.name}</span>}
                {(serverError.name&&<span className='invalid-feedback'>{serverError.name.msg}</span>)}
                </div>
                <div className='form-group'>
                <label className='form-label'htmlFor="email">Email:</label>
                <input 
                type="text"
                value={email}
                onChange={(e)=>{
                    setEmail(e.target.value)
                }} 
                className={'form-control' + (formError.email ||serverError.email ?  ' is-invalid' : '')}/>
                {(formError.email&&<span className='invalid-feedback'>{formError.email}</span>)}
                {(serverError.email&&<span className='invalid-feedback' >{serverError.email.msg}</span>)}
                </div>

                <div className='form-group'>
                <label className='form-label'htmlFor="password">Password:</label>
                <input 
                type="password"
                value={password}
                onChange={(e)=>{
                    setPassword(e.target.value)
                    console.log(password)
                }}
                className={'form-control' + (formError.password || serverError.password ?  ' is-invalid' : '')} />
                {(formError.password&&<span className='invalid-feedback'>{formError.password}</span>)}
                {(serverError.password&&<span className='invalid-feedback'>{serverError.password.msg}</span>)}
                </div>
                <input type ="submit" className="btn btn-primary"/>
            </form>
            
            <h5>already have an acount <Link to="/login" >login</Link> here</h5>
            </div>
        }</div>
    )
}