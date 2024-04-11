import { useState,useEffect} from "react"
import _ from "lodash"
import axios from 'axios'
import { Link } from "react-router-dom"
export default function HostedZone (props){
    const {hostedZone,setHostedZone} =props
    // const [hostedZone,setHostedZone] = useState([])
    const [domain,setDomain] =useState('')
    const [file, setFile] = useState(null);
    const [search,setSeacrh]= useState('')
    const [formErrors,setFormErrors]=useState({})
    const [loading,setLoading] =useState(false)
    
    useEffect(()=>{
        (async()=>{
          try{
            const response = await axios.get('https://dns-manager-x1h3.onrender.com/api/domain',{headers:{
              Authorization:localStorage.getItem('token')
            }})
            setHostedZone(response.data)
          }catch(err){
            alert(err.message)
            console.log(err)
          }
        })()
      },[])
    const errors ={}
    const validateErrors =()=>{
        if(domain.trim().length === 0){
            errors.domain = 'domain name is required'
        }
    }
    const handleFileChange = (e) => {
        e.preventDefault()
        setFile(e.target.files[0]);
    }
    const formData = {
        name: domain
    }
    const handleFileUpload =async(e)=>{
        e.preventDefault()
        let fd= new FormData();
        fd.append("file", file);
        setLoading(true)
        try{
            const response = await axios.post('https://dns-manager-x1h3.onrender.com/api/domain/upload',fd, {
                headers: {
                 Authorization:localStorage.getItem('token'), 'Content-Type': 'multipart/form-data'
        }})
        setDomain('')
        console.log(response)
        setLoading(false)
        alert('file upoladed successfully and new hosted zones created.')
        setHostedZone([...hostedZone,response.data])
        window.location.reload()
        }catch(err){
            setLoading(false)
            alert(err.message)
            console.log(err)
        }
    }
    const handleSubmit =async(e)=>{
        e.preventDefault()
        validateErrors()
        setLoading(true)
        if(_.isEmpty(errors)){
        try{
            const response = await axios.post('https://dns-manager-x1h3.onrender.com/api/domain',formData,{ headers: {
                Authorization: localStorage.getItem('token')
            }})
            console.log(response.data)
            setFormErrors({})
            setLoading(false)
            alert('hosted zone created succesfully')
            setHostedZone([...hostedZone,response.data])
        }catch(err){
            setFormErrors({})
            console.log(err)
            setLoading(false)
            alert(err.response.data.message)
        }
    }else{
        setLoading(false)
        setFormErrors(errors)
    }
    }
   
    const hanndleRemove =async(id)=>{
        const confirmation = window.confirm("are you sure?")
        setLoading(true)
        if(confirmation){
            try{
                const response = await axios.delete(`https://dns-manager-x1h3.onrender.com/api/domain/${id}`,{headers:{
                    Authorization :localStorage.getItem('token')
                }})
                console.log(response.data.deletedDomain)
                setLoading(false)
                alert('hosted zone deleted successfully')
                setHostedZone(hostedZone.filter((ele)=>{
                    return ele.zoneId!=id;
                }))
            }catch(err){
                console.log(err)
                setLoading(false)
                alert(err.response.data.errors.message)
            }
        }
        else{
            setLoading(false)
        }
    }
    return (
        <div className="App">
        {loading?<div className="loader align-items-center">
                <img src="./loader.gif" alt="loading..."/>
            </div>:
            <div>
        <div className="row justify-content-center">
            
            <h2>Create new Hosted Zone</h2>
            <div className="col-md-4">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                <label className="form-label" htmlFor="domain">Domain: </label>
                <input 
                    // required
                    type="text"
                    name="domain"
                    id="domain"
                    value={domain}
                    placeholder="enter domain name"
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
                <h2>your hosted zone - {hostedZone.length}</h2>
                <input type= "text" 
                    value={search}
                    placeholder='search'
                    onChange={(e)=>{
                        setSeacrh(e.target.value);
                    }}/>
                    <ol>
                    {hostedZone.filter((ele)=>{
                        return ele&&ele.name&&ele.name.toLowerCase().includes(search.toLowerCase()) 
                        }).map((domain)=>{
                        return (
                            <li key={domain._id}><Link to={`/hostedZone/${domain.zoneId}/record`}>{domain.name}</Link><button onClick={()=>{
                                hanndleRemove(domain.zoneId);
                            }}>remove</button></li>
                        )
                    })}
                    </ol>
            </div>}
            </div>
            </div>
            </div>
        }</div>
    )
}