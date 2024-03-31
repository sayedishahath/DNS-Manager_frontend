import { useState } from "react"
import _ from "lodash"
import axios from 'axios'
import { Link } from "react-router-dom"
import{useContext} from 'react'
import { UserContext } from '../context/userContext'
export default function HostedZone (){
    const {hostedZone,dispatchHostedZone} = useContext(UserContext)
    const [domain,setDomain] =useState('')
    const [file, setFile] = useState(null);
    const [search,setSeacrh]= useState('')
    const [formErrors,setFormErrors]=useState({})
    const errors ={}
    const validateErrors =()=>{
        if(domain.trim().length === 0){
            errors.domain = 'domain name is required'
        }
    }
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }
    const formData = {
        name: domain
    }
    const handleFileUpload =async(e)=>{
        e.preventDefault()
        let fd= new FormData();
        fd.append("file", file);
        try{
            const response = await axios.post('https://dns-manager-x1h3.onrender.com/api/domain/upload',fd, {
                headers: {
                 Authorization:localStorage.getItem('token'), 'Content-Type': 'multipart/form-data'
        }})
        setDomain('')
        console.log(response.data)
        alert('file upoladed successfully and new hosted zones created.')
        }catch(err){
            alert(err.response.data)
            console.log(err)
        }
    }
    const handleSubmit =async(e)=>{
        e.preventDefault()
        validateErrors()
        if(_.isEmpty(errors)){

        
        try{
            const response = await axios.post('https://dns-manager-x1h3.onrender.com/api/domain',formData,{ headers: {
                Authorization: localStorage.getItem('token')
            }})
            console.log(response.data)
            setFormErrors({})
            alert('hosted zone created succesfully')
            dispatchHostedZone({
                type: 'ADD_HOSTEDZONE',
                payload: response.data
            })
        }catch(err){
            setFormErrors({})
            console.log(err)
            alert(err.response.data.message)
        }
    }else{
        setFormErrors(errors)
    }
    }
   
    const hanndleRemove =async(id)=>{
        const confirmation = window.confirm("are you sure?")
        if(confirmation){
            try{
                const response = await axios.delete(`https://dns-manager-x1h3.onrender.com/api/domain/${id}`,{headers:{
                    Authorization :localStorage.getItem('token')
                }})
                console.log(response.data.deletedDomain)
                alert('hosted zone deleted successfully')
                dispatchHostedZone({type:'REMOVE_HOSTEDZONE',payload: response.data.deletedDomain})
            }catch(err){
                console.log(err)
                alert(err.response.data.message)
            }
        }
    }
    return (
        
        <div className="row justify-content-center">
            <h2>Create new Hosted Zone</h2>
            <div className="col-md-4">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                <label className="form-label" htmlFor="domain">Domain: </label>
                <input 
                    type="text"
                    name="domain"
                    id="domain"
                    value={domain}
                    onChange={(e)=>{
                        setDomain(e.target.value)
                    }}
                    className={'form-control' + (formErrors.domain  ?  ' is-invalid' : '')}/>
                    {formErrors.domain&&<span style={{color:'red'}}>{formErrors.domain}</span>}
                    </div>
                <input type='submit' className="btn btn-primary"/>
            </form>
            <div className="row justify-content-center">
            <div className="col-md-4">
            <form onSubmit={handleFileUpload}>
                <label className="form-label" htmlFor="file">Upload File:</label>
                <input className="custom-file-input"type="file" id="file" onChange={handleFileChange} accept=".csv, .json" required/>
                <input className="form-control btn btn-primary" type= 'submit'/>
            </form>
            </div>
            </div>
            
            {
            <div>
                <h2>your hosted zone - {hostedZone.domain.length}</h2>
                <input type= "text" 
                    value={search}
                    placeholder='search'
                    onChange={(e)=>{
                        setSeacrh(e.target.value);
                    }}/>
                    <ol>
                    {hostedZone.domain.filter((ele)=>{
                        return ele.name.toLowerCase().includes(search.toLowerCase()) 
                        }).map((domain)=>{
                        return (
                            <li key={domain._id}><Link to={`/hosted-zone/${domain.zoneId}/record`}>{domain.name}</Link><button onClick={()=>{
                                hanndleRemove(domain.zoneId);
                            }}>remove</button></li>
                        )
                    })}
                    </ol>
            </div>}
            </div>
        </div>
    )
}