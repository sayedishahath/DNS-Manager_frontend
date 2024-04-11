// import logo from './logo.svg';
import axios from 'axios';
import './App.css';
import Register from './components/userRegistartion'
import Login from  './components/userLogin'
import HostedZone from './components/hostedZone';
import Records from './components/hostedZoneRecords'

import { useState,useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams} from "react-router-dom";


function App() {
  const [userLoggedIn,setUserLoggedIn] =useState(false) 
  const [hostedZone,setHostedZone] = useState([])
  const[loading,setLoading]=useState(false)

 
  const loginSuccess=()=>{
    setUserLoggedIn(true)
  }
  const logout =()=>{
    const confirmation = window.confirm('are you sure?')
    if (confirmation){
      setLoading(true)
      setUserLoggedIn(false)
      localStorage.removeItem('token')
      setLoading(false)
      setHostedZone([])
    }
  }
  
  // useEffect(()=>{
    
  //   (async()=>{
  //     try{
  //       const response = await axios.get('https://dns-manager-x1h3.onrender.com/api/domain',{headers:{
  //         Authorization:localStorage.getItem('token')
  //       }})
  //       setHostedZone(response.data)
  //     }catch(err){
  //       alert(err.message)
  //       console.log(err)
  //     }
  //   })()
  
  // },[])

  return (

    <div className="App">
      {loading?<div className="loader align-items-center">
                <img src="./loader.gif" alt="loading..."/>
            </div>:
            <div>
      {/* Wrap your routes with BrowserRouter */}
      <BrowserRouter>
        {/* Define your routes */}
        <Routes>
          {/* Set your home page route to the Register component */}
          <Route path="/" element={<Register />} />
          
          <Route path="/login" element={<Login loginSuccess={loginSuccess}/>} />
          <Route path='/hostedZone' element={<HostedZone hostedZone={hostedZone} setHostedZone={setHostedZone}/>}/>
          <Route path = '/hostedZone/:zoneId/record' element={<Records hostedZone={hostedZone}/>}/>
          {/* Add more routes as needed */}
        </Routes>
        {userLoggedIn&&<Link to ="/login" onClick={logout}>Log out</Link>}
      </BrowserRouter>
      </div>}
    </div>
  )
}

export default App;