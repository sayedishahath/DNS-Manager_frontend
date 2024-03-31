// import logo from './logo.svg';
import axios from 'axios';
import './App.css';
import Register from './components/userRegistartion'
import Login from  './components/userLogin'
import HostedZone from './components/hostedZone';
import Records from './components/hostedZoneRecords'

import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, } from "react-router-dom";


function App() {
  const [userLoggedIn,setUserLoggedIn] =useState(false) 
  const [hostedZone,setHostedZone] = useState([])
 
  const loginSuccess=()=>{
    setUserLoggedIn(true)
  }
  const logout =()=>{
    const confirmation = window.confirm('are you sure?')
    if (confirmation){
      setUserLoggedIn(false)
      localStorage.removeItem('token')
    }
  }
  
  // useEffect(()=>{
  //   (async()=>{
  //     try{
  //       const response = await axios.get('https://dns-manager-x1h3.onrender.com/api/domain',{headers:{
  //         Authorization:localStorage.getItem('token')
  //       }})

  //       dispatchHostedZone({type:'GET_HOSTEDZONE',payload:response.data})
  //     }catch(err){
  //       alert(err.message)
  //       console.log(err)
  //     }
  //   })()
  // },[dispatchHostedZone])

  return (
    // <div className="App">
    //   <BrowserRouter>
    //     <div>
    //       <h1>DNS Manager</h1>
    //       <UserContext.Provider value={{hostedZone,dispatchHostedZone}}>
    //         {!userLoggedIn&&<Register/>}
    //         <Routes>
    //           <Route path="/login" element={<Login loginSuccess={loginSuccess} />} />
    //           <Route path='/hostedZone' element={<HostedZone/>}/>
    //           <Route path = '/hosted-zone/:zoneId/record' element={<Records/>}/>
    //           <Route path = '/logout' element ={<Login loginSuccess={loginSuccess}/>}/>
    //         </Routes>
    //       {userLoggedIn&&<Link to ='/logout' onClick={logout}>logout</Link>}
    //       </UserContext.Provider>
    //     </div>
    //   </BrowserRouter>
    // </div>


    <div className="App">
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
      </BrowserRouter>
    </div>
  )
}

export default App;