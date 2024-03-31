import axios from 'axios'
import _ from 'lodash'

import { useParams } from "react-router-dom";
import { useEffect,useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default function Records(props){
    const [modal, setModal] = useState(false);
    const toggle = () => {
        setModal(!modal)
    }
    const {zoneId} = useParams()
    const {hostedZone} = props
    const hostedZoneId = hostedZone.find((ele)=>{
        return ele.zoneId ===zoneId
    })
    const [editId,setEditId] = useState('')
    const [dnsRecords,setDnsRecords] = useState([])
    const dnsRecord = dnsRecords.find((ele)=>{
        return ele._id === editId
    })
    console.log(dnsRecord)
    const [search,setSeacrh] = useState('')
    const [domain,setDomain] =useState('')
    const [recordType, setRecordType] = useState(dnsRecord?dnsRecord.recordType:'');
    const [recordValue, setRecordValue] = useState(dnsRecord?dnsRecord.recordValue:'');
    const [ttl, setTtl] = useState( dnsRecord?dnsRecord.ttl:'');
    const [formErrors,setFormErrors] = useState({})
    
    const errors = {}
    const validateErrors = ()=>{
        if(domain.trim().length===0){
            errors.domain ='domain is required'
        }
        if(recordType.trim().length === 0){
            errors.recordType = 'record type is required'
        }
        if(recordValue.trim().length === 0){
            errors.recordValue = 'record value is required'
        }
        if(ttl.trim().length === 0){
            errors.ttl = 'ttl is required'
        }
    }

    const [file, setFile] = useState(null);
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    }
    const handleFileUpload =async(e)=>{
        e.preventDefault()
        let fd= new FormData();
        fd.append("file", file);
        try{
            const response = await axios.post(`https://dns-manager-x1h3.onrender.com/api/dns/${zoneId}/upload-record`,fd, {
                headers: {
                 Authorization:localStorage.getItem('token'), 'Content-Type': 'multipart/form-data'
        }})
        console.log(response.data)
        alert('file uploaded succesfully and new records created')
        }catch(err){
            alert(err.response.data.message)
            console.log(err)
        }
    }
    useEffect(()=>{
        (async()=>{
            try{
                const response = await  axios.get(`https://dns-manager-x1h3.onrender.com/api/dns/${zoneId}`,{headers:{
                    Authorization:localStorage.getItem('token')
                }})
                console.log(response.data);
                setDnsRecords(response.data)
            }catch(err){
                alert(err.message)
            }
        })()
    },[])
    const formData={
        domain: domain,
        recordType: recordType,
        recordValue: recordValue,
        ttl : ttl
    }
    const handleSubmit=async(e)=>{
        e.preventDefault()
        validateErrors()
        if(_.isEmpty(errors)){        
        try{
            const response = await axios.post(`https://dns-manager-x1h3.onrender.com/api/dns/${zoneId}`,formData,{headers:{
                Authorization:localStorage.getItem("token")
            }});
            console.log(response);
            setFormErrors({})
            alert('new record added')
            setDnsRecords([...dnsRecords,response.data]);
        }catch(err){
            setFormErrors({})
            // console.log(err);
            alert(err.response.data.error.message)
        }
    }else{
        setFormErrors(errors)
    }
    }

    const handleDelete=async(id,zoneid)=>{
       const confirmation = window.confirm( "Are you sure to delete this Record ?")
       if(confirmation){
        try{
            const response = await axios.delete(`https://dns-manager-x1h3.onrender.com/api/dns/${zoneid}/${id}`,{headers:{
                Authorization:localStorage.getItem('token')
            }})
            // console.log(response.data)
            alert('record deleted successfully')
            setDnsRecords(dnsRecord.filter((ele)=>{
                return ele.deleteDNSRecord._id !==id
            })) 
        }catch(err){
            alert(err.response.data)
            // console.log(err.response.data)
        }
       }
    }
    const handleUpdate = async(e,id)=>{
        e.preventDefault()
        try{
            const response = await axios.put(`https://dns-manager-x1h3.onrender.com/api/dns/${zoneId}/${id}`,formData,{headers:{
                Authorization:localStorage.getItem('token')
            }})
            console.log(response.data)
            alert('record updated successfully')
            setDnsRecords(dnsRecords.map((ele)=> {
               if (ele._id === id) {
                   return response.data
               } else {
                   return ele;
               }
           })
          )
        }catch(err){
            alert(err.message)
            console.log(err)
        }
    }
    
    return(
        <div className='App'>
            
            <div className='row justify-content-center'>
            <div className='col-md-4'>
            <h2>create record -{hostedZoneId&&hostedZoneId.name}</h2>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                <label className='form-label' htmlFor="domain">Domain:</label>
                <input type="text" 
                id="domain" 
                name='domain'
                value={domain}
                onChange={(e) => setDomain(e.target.value)} 
                className='form-control'/>
                </div>
                <div className='form-group'>
                <label className='form-label' htmlFor="recordType">Record Type:</label>
                    <select 
                    id="recordType" 
                    value={recordType} 
                    onChange={(e)=>{
                        setRecordType(e.target.value)
                    }}
                    className={'form-control' + (formErrors.recordType?  ' is-invalid' : '')}>
                        <option value=''>select type</option>
                        <option value="A">A</option>
                        <option value="AAAA">AAAA</option>
                        <option value="CNAME">CNAME</option>
                        <option value="MX">MX</option>
                        <option value="PTR">PTR</option>
                        <option value="SRV">SRV</option>
                        <option value="TXT">TXT</option>
                        <option value="DS">DS</option>
                        <option value="NS">NS</option>
                        <option value="SOA">SOA</option>
                </select>
                {formErrors.recordType&&<span className='invalid-feedback'>{formErrors.recordType}</span>}<br/>
                {/* <input type="text" 
                id="recordType" 
                name='recordType'
                value={recordType} 
                onChange={(e) => setRecordType(e.target.value)} /> */}
                </div>
                <div className='form-group'>
                <label className='form-label' htmlFor="recordValue">Record Value:</label>
                <input type="text" 
                id="recordValue" 
                name='recordValue'
                value={recordValue} 
                onChange={(e) => setRecordValue(e.target.value)} 
                className={'form-control' + (formErrors.recordValue?  ' is-invalid' : '')}/>
                {formErrors.recordValue&&<span className='invalid-feedback'>{formErrors.recordValue}</span>}<br/>
                </div>
                <div className='form-group'>
                <label className='form-label' htmlFor="ttl">TTL (seconds):</label>
                <input type="text" 
                id="ttl" 
                name='ttl'
                value={ttl} 
                onChange={(e) => setTtl(e.target.value)} 
                className={'form-control' + (formErrors.ttl  ?  ' is-invalid' : '')}/>
                {formErrors.ttl&&<span className='invalid feedback'>{formErrors.ttl}</span>}<br/>
                </div>
                <input type='submit' className='btn btn-primary'/>
            </form>

            <form onSubmit={handleFileUpload}>
                <div className='row justify-content-center'>
                    <div className='col-md-4'>
                        <label className='form-label' htmlFor="file">Upload File:</label>
                        <input className='custom-file-input' type="file" id="file" onChange={handleFileChange} accept= ".csv, .json" required/>
                        <input className="form-control btn btn-primary"type= 'submit'/>
                    </div>
                </div>
            </form>
            </div>
            </div>
            <select 
                    id="search" 
                    value={search} 
                    onChange={(e)=>{
                        setSeacrh(e.target.value)
                    }}>
                        <option value=''>filter by type</option>
                        <option value="A">A</option>
                        <option value="AAAA">AAAA</option>
                        <option value="CNAME">CNAME</option>
                        <option value="MX">MX</option>
                        <option value="PTR">PTR</option>
                        <option value="SRV">SRV</option>
                        <option value="TXT">TXT</option>
                        <option value="DS">DS</option>
                        <option value="NS">NS</option>
                        <option value="SOA">SOA</option>
                </select>
            <div className='row justify-content-center'>
            <div className='col-md-8'>
            <table className='table ' border ="">
                <thead>
                    <tr>
                        <th>name</th>
                        <th>type</th>
                        <th>value</th>
                        <th>ttl</th>
                        <th>action</th>
                    </tr>
                </thead>
                <tbody>
                    {dnsRecords.filter((ele)=>{
                        return ele.recordType.toLowerCase().includes(search.toLowerCase())
                    }).map((ele)=>{
                        return(
                            <tr key={ele._id}>
                                <td>{ele.domain}</td>
                                <td>{ele.recordType}</td>
                                <td>{ele.recordValue}</td>
                                <td>{ele.ttl}</td>
                                <td><button
                                onClick={()=>{
                                    handleDelete(ele._id,ele.zoneId)
                                }}>
                                    Delete
                                    </button>
                                    <button onClick={()=>{
                                        setEditId(ele._id)
                                        toggle()
                                    }}>
                                    Edit
                                    </button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            </div>
            </div>
        <Modal isOpen={modal} toggle={toggle}> 
            <ModalHeader toggle={toggle}> Edit record</ModalHeader>
            <ModalBody>
            <form onSubmit={(e)=>{
                handleUpdate(e,editId)
            }}>    
                    
                    <label htmlFor="domain">Domain:</label>
                    <input type="text" 
                    id="domain" 
                    name='domain'
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)} 
                    />
                
                    <label htmlFor="recordType">Record Type:</label>
                        <select 
                        id="recordType" 
                        value={recordType} 
                        onChange={(e)=>{
                            setRecordType(e.target.value)
                        }}>
                            <option value=''>select type</option>
                            <option value="A">A</option>
                            <option value="AAAA">AAAA</option>
                            <option value="CNAME">CNAME</option>
                            <option value="MX">MX</option>
                            <option value="PTR">PTR</option>
                            <option value="SRV">SRV</option>
                            <option value="TXT">TXT</option>
                            <option value="DS">DS</option>
                            <option value="NS">NS</option>
                            <option value="SOA">SOA</option>
                    </select>
                    {formErrors.recordType&&<span style={{color:'red'}}>{formErrors.recordType}</span>}<br/>
                    <label htmlFor="recordValue">Record Value:</label>
                    <input type="text" 
                    id="recordValue" 
                    name='recordValue'
                    value={recordValue} 
                    onChange={(e) => setRecordValue(e.target.value)} />
                    {formErrors.recordValue&&<span style={{color:'red'}}>{formErrors.recordValue}</span>}<br/>

                    <label htmlFor="ttl">TTL (seconds):</label>
                    <input type="text" 
                    id="ttl" 
                    name='ttl'
                    value={ttl} 
                    onChange={(e) => setTtl(e.target.value)} />
                    {formErrors.ttl&&<span style={{color:'red'}}>{formErrors.ttl}</span>}<br/>

                    <input type='submit' />
                </form>
            </ModalBody>
      </Modal>
    </div>
    )
}